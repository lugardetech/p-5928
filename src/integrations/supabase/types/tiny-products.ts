export interface TinyProductParent {
  id: number;
  sku: string;
  descricao: string;
}

export interface TinyProductCategory {
  id: number;
  nome: string;
  caminhoCompleto: string;
}

export interface TinyProductBrand {
  id: number;
  nome: string;
}

export interface TinyProductPackaging {
  id: number;
  tipo: number;
  descricao: string;
}

export interface TinyProductDimensions {
  embalagem: TinyProductPackaging;
  largura: number;
  altura: number;
  comprimento: number;
  diametro: number;
  pesoLiquido: number;
  pesoBruto: number;
  quantidadeVolumes: number;
}

export interface TinyProductPricing {
  preco: number;
  precoPromocional: number;
  precoCusto: number;
  precoCustoMedio: number;
}

export interface TinyProductStock {
  controlar: boolean;
  sobEncomenda: boolean;
  diasPreparacao: number;
  localizacao: string;
  minimo: number;
  maximo: number;
  quantidade: number;
}

export interface TinyProductSupplier {
  id: number;
  nome: string;
  codigoProdutoNoFornecedor: string;
}

export interface TinyProductSEO {
  titulo: string;
  descricao: string;
  keywords: string[];
  linkVideo: string;
  slug: string;
}

export interface TinyProductTaxation {
  gtinEmbalagem: string;
  valorIPIFixo: number;
  classeIPI: string;
}

export interface TinyProductAttachment {
  url: string;
  externo: boolean;
}

export interface TinyProductVariationGrade {
  chave: string;
  valor: string;
}

export interface TinyProductVariation {
  id: number;
  descricao: string;
  sku: string;
  gtin: string;
  precos: TinyProductPricing;
  estoque: TinyProductStock;
  grade: TinyProductVariationGrade[];
}

export interface TinyProductKitItem {
  produto: {
    id: number;
    sku: string;
    descricao: string;
  };
  quantidade: number;
}

export interface TinyProductProduction {
  produtos: {
    produto: {
      id: number;
      sku: string;
      descricao: string;
    };
    quantidade: number;
  }[];
  etapas: string[];
}

export interface TinyProduct {
  id: string;
  user_id: string | null;
  tiny_id: number;
  sku: string | null;
  nome: string;
  descricao: string | null;
  descricao_complementar: string | null;
  tipo: string | null;
  situacao: string | null;
  produto_pai_id: number | null;
  produto_pai_sku: string | null;
  produto_pai_descricao: string | null;
  unidade: string | null;
  unidade_por_caixa: string | null;
  ncm: string | null;
  gtin: string | null;
  origem: string | null;
  garantia: string | null;
  observacoes: string | null;
  categoria_id: number | null;
  categoria_nome: string | null;
  categoria_caminho: string | null;
  marca_id: number | null;
  marca_nome: string | null;
  embalagem_id: number | null;
  embalagem_tipo: number | null;
  embalagem_descricao: string | null;
  largura: number | null;
  altura: number | null;
  comprimento: number | null;
  diametro: number | null;
  peso_bruto: number | null;
  peso_liquido: number | null;
  quantidade_volumes: number | null;
  preco: number | null;
  preco_promocional: number | null;
  preco_custo: number | null;
  preco_custo_medio: number | null;
  estoque: number | null;
  estoque_minimo: number | null;
  estoque_maximo: number | null;
  controlar_estoque: boolean | null;
  sob_encomenda: boolean | null;
  dias_preparacao: number | null;
  localizacao: string | null;
  seo_titulo: string | null;
  seo_descricao: string | null;
  seo_keywords: string[] | null;
  seo_link_video: string | null;
  seo_slug: string | null;
  gtin_embalagem: string | null;
  valor_ipi_fixo: number | null;
  classe_ipi: string | null;
  created_at: string | null;
  updated_at: string | null;
}