import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("=== Iniciando Edge Function tiny-products ===")
    
    const { userId } = await req.json();
    
    if (!userId) {
      console.error("❌ User ID não fornecido");
      throw new Error('User ID não fornecido');
    }

    console.log("🔄 Buscando integração do usuário...");
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data: integration, error: integrationError } = await supabase
      .from('integrations')
      .select('*')
      .eq('user_id', userId)
      .eq('name', 'tiny_erp')
      .single();

    if (integrationError) {
      console.error("❌ Erro ao buscar integração:", integrationError);
      throw new Error('Erro ao buscar integração');
    }

    if (!integration?.access_token) {
      console.error("❌ Token de acesso não encontrado");
      throw new Error('Token de acesso não encontrado');
    }

    console.log("✅ Integração encontrada");

    // Verificar se o token está expirado
    if (integration.token_expires_at) {
      const expiresAt = new Date(integration.token_expires_at);
      if (expiresAt < new Date()) {
        console.log("🔄 Token expirado, tentando renovar...");
        
        const { data: refreshData, error: refreshError } = await supabase.functions.invoke('tiny-token-refresh', {
          body: { 
            refresh_token: integration.refresh_token,
            client_id: integration.settings.client_id,
            client_secret: integration.settings.client_secret
          }
        });

        if (refreshError) {
          console.error("❌ Erro ao renovar token:", refreshError);
          throw new Error('Erro ao renovar token. Por favor, reconecte sua conta do Tiny ERP.');
        }

        // Atualizar tokens no banco
        const { error: updateError } = await supabase
          .from('integrations')
          .update({
            access_token: refreshData.access_token,
            refresh_token: refreshData.refresh_token,
            token_expires_at: refreshData.token_expires_at,
            refresh_token_expires_at: refreshData.refresh_token_expires_at
          })
          .eq('id', integration.id);

        if (updateError) {
          console.error("❌ Erro ao atualizar tokens:", updateError);
          throw updateError;
        }

        integration.access_token = refreshData.access_token;
      }
    }

    // Fazer requisição para a API do Tiny
    console.log("🔄 Fazendo requisição para API do Tiny...");
    const response = await fetch('https://api.tiny.com.br/public-api/v3/produtos', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${integration.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`❌ Erro na API do Tiny: ${response.status} - ${response.statusText}`);
      const errorText = await response.text();
      console.error("Resposta da API:", errorText);
      
      if (response.status === 401) {
        throw new Error('Token de acesso expirado ou inválido. Por favor, reconecte sua conta do Tiny ERP.');
      }
      
      throw new Error(`Erro na API do Tiny: ${response.statusText}`);
    }

    const tinyData = await response.json();
    console.log("✅ Dados recebidos da API do Tiny");

    // Validar a resposta
    if (!tinyData || !tinyData.itens) {
      console.error("❌ Resposta inválida da API do Tiny");
      throw new Error('Resposta inválida da API do Tiny');
    }

    // Para cada produto, buscar detalhes e salvar no banco
    console.log("🔄 Buscando detalhes de cada produto...");
    for (const item of tinyData.itens) {
      try {
        // Buscar detalhes do produto
        const detailsResponse = await fetch(`https://api.tiny.com.br/public-api/v3/produtos/${item.id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${integration.access_token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!detailsResponse.ok) {
          console.error(`❌ Erro ao buscar detalhes do produto ${item.id}`);
          continue;
        }

        const detailsData = await detailsResponse.json();
        const produto = detailsData.produto;

        // Salvar produto principal
        const { data: savedProduct, error: productError } = await supabase
          .from('tiny_products')
          .upsert({
            user_id: userId,
            tiny_id: parseInt(item.id),
            sku: produto.sku,
            nome: produto.descricao,
            descricao_complementar: produto.descricaoComplementar,
            tipo: produto.tipo,
            situacao: produto.situacao,
            produto_pai_id: produto.produtoPai?.id,
            produto_pai_sku: produto.produtoPai?.sku,
            produto_pai_descricao: produto.produtoPai?.descricao,
            unidade: produto.unidade,
            unidade_por_caixa: produto.unidadePorCaixa,
            ncm: produto.ncm,
            gtin: produto.gtin,
            origem: produto.origem,
            garantia: produto.garantia,
            observacoes: produto.observacoes,
            categoria_id: produto.categoria?.id,
            categoria_nome: produto.categoria?.nome,
            categoria_caminho: produto.categoria?.caminhoCompleto,
            marca_id: produto.marca?.id,
            marca_nome: produto.marca?.nome,
            embalagem_id: produto.dimensoes?.embalagem?.id,
            embalagem_tipo: produto.dimensoes?.embalagem?.tipo,
            embalagem_descricao: produto.dimensoes?.embalagem?.descricao,
            largura: produto.dimensoes?.largura,
            altura: produto.dimensoes?.altura,
            comprimento: produto.dimensoes?.comprimento,
            diametro: produto.dimensoes?.diametro,
            peso_bruto: produto.dimensoes?.pesoBruto,
            peso_liquido: produto.dimensoes?.pesoLiquido,
            quantidade_volumes: produto.dimensoes?.quantidadeVolumes,
            preco: produto.precos?.preco,
            preco_promocional: produto.precos?.precoPromocional,
            preco_custo: produto.precos?.precoCusto,
            preco_custo_medio: produto.precos?.precoCustoMedio,
            estoque: produto.estoque?.quantidade,
            estoque_minimo: produto.estoque?.minimo,
            estoque_maximo: produto.estoque?.maximo,
            controlar_estoque: produto.estoque?.controlar,
            sob_encomenda: produto.estoque?.sobEncomenda,
            dias_preparacao: produto.estoque?.diasPreparacao,
            localizacao: produto.estoque?.localizacao,
            seo_titulo: produto.seo?.titulo,
            seo_descricao: produto.seo?.descricao,
            seo_keywords: produto.seo?.keywords,
            seo_link_video: produto.seo?.linkVideo,
            seo_slug: produto.seo?.slug,
            gtin_embalagem: produto.tributacao?.gtinEmbalagem,
            valor_ipi_fixo: produto.tributacao?.valorIPIFixo,
            classe_ipi: produto.tributacao?.classeIPI,
          }, {
            onConflict: 'user_id,tiny_id',
            ignoreDuplicates: false
          })
          .select('id')
          .single();

        if (productError) {
          console.error(`❌ Erro ao salvar produto ${item.id}:`, productError);
          continue;
        }

        const productId = savedProduct.id;

        // Salvar fornecedores
        if (produto.fornecedores?.length > 0) {
          const { error: suppliersError } = await supabase
            .from('tiny_product_suppliers')
            .upsert(
              produto.fornecedores.map(f => ({
                product_id: productId,
                fornecedor_id: f.id,
                fornecedor_nome: f.nome,
                codigo_produto_fornecedor: f.codigoProdutoNoFornecedor
              }))
            );

          if (suppliersError) {
            console.error(`❌ Erro ao salvar fornecedores do produto ${item.id}:`, suppliersError);
          }
        }

        // Salvar anexos
        if (produto.anexos?.length > 0) {
          const { error: attachmentsError } = await supabase
            .from('tiny_product_attachments')
            .upsert(
              produto.anexos.map(a => ({
                product_id: productId,
                url: a.url,
                externo: a.externo
              }))
            );

          if (attachmentsError) {
            console.error(`❌ Erro ao salvar anexos do produto ${item.id}:`, attachmentsError);
          }
        }

        // Salvar variações
        if (produto.variacoes?.length > 0) {
          for (const variacao of produto.variacoes) {
            const { data: savedVariation, error: variationError } = await supabase
              .from('tiny_product_variations')
              .upsert({
                product_id: productId,
                tiny_id: variacao.id,
                descricao: variacao.descricao,
                sku: variacao.sku,
                gtin: variacao.gtin,
                preco: variacao.precos?.preco,
                preco_promocional: variacao.precos?.precoPromocional,
                preco_custo: variacao.precos?.precoCusto,
                preco_custo_medio: variacao.precos?.precoCustoMedio,
                controlar_estoque: variacao.estoque?.controlar,
                sob_encomenda: variacao.estoque?.sobEncomenda,
                dias_preparacao: variacao.estoque?.diasPreparacao,
                localizacao: variacao.estoque?.localizacao,
                estoque_minimo: variacao.estoque?.minimo,
                estoque_maximo: variacao.estoque?.maximo,
                estoque: variacao.estoque?.quantidade
              })
              .select('id')
              .single();

            if (variationError) {
              console.error(`❌ Erro ao salvar variação do produto ${item.id}:`, variationError);
              continue;
            }

            // Salvar grades da variação
            if (variacao.grade?.length > 0) {
              const { error: gradesError } = await supabase
                .from('tiny_product_variation_grades')
                .upsert(
                  variacao.grade.map(g => ({
                    variation_id: savedVariation.id,
                    chave: g.chave,
                    valor: g.valor
                  }))
                );

              if (gradesError) {
                console.error(`❌ Erro ao salvar grades da variação ${variacao.id}:`, gradesError);
              }
            }
          }
        }

        // Salvar itens do kit
        if (produto.kit?.length > 0) {
          const { error: kitError } = await supabase
            .from('tiny_product_kit_items')
            .upsert(
              produto.kit.map(k => ({
                product_id: productId,
                item_id: k.produto.id,
                item_sku: k.produto.sku,
                item_descricao: k.produto.descricao,
                quantidade: k.quantidade
              }))
            );

          if (kitError) {
            console.error(`❌ Erro ao salvar itens do kit do produto ${item.id}:`, kitError);
          }
        }

        // Salvar itens de produção
        if (produto.producao?.produtos?.length > 0) {
          const { error: productionError } = await supabase
            .from('tiny_product_production_items')
            .upsert(
              produto.producao.produtos.map(p => ({
                product_id: productId,
                item_id: p.produto.id,
                item_sku: p.produto.sku,
                item_descricao: p.produto.descricao,
                quantidade: p.quantidade
              }))
            );

          if (productionError) {
            console.error(`❌ Erro ao salvar itens de produção do produto ${item.id}:`, productionError);
          }
        }

        // Salvar etapas de produção
        if (produto.producao?.etapas?.length > 0) {
          const { error: stepsError } = await supabase
            .from('tiny_product_production_steps')
            .upsert(
              produto.producao.etapas.map((etapa, index) => ({
                product_id: productId,
                etapa: etapa,
                ordem: index + 1
              }))
            );

          if (stepsError) {
            console.error(`❌ Erro ao salvar etapas de produção do produto ${item.id}:`, stepsError);
          }
        }

      } catch (error) {
        console.error(`❌ Erro ao processar produto ${item.id}:`, error);
      }
    }

    console.log("✅ Produtos salvos com sucesso");

    // Buscar produtos atualizados
    const { data: products, error: fetchError } = await supabase
      .from('tiny_products')
      .select(`
        *,
        tiny_product_attachments(*),
        tiny_product_variations(*),
        tiny_product_suppliers(*),
        tiny_product_kit_items(*),
        tiny_product_production_items(*),
        tiny_product_production_steps(*)
      `)
      .eq('user_id', userId);

    if (fetchError) {
      console.error("❌ Erro ao buscar produtos:", fetchError);
      throw fetchError;
    }

    return new Response(
      JSON.stringify({ itens: products }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 200,
      },
    );

  } catch (error) {
    console.error("❌ Erro na Edge Function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 400,
      },
    );
  }
});