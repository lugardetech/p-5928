import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Json } from "@/integrations/supabase/types";

interface TinyCustomer {
  nome: string;
  codigo: string;
  fantasia?: string;
  tipoPessoa?: string;
  cpfCnpj?: string;
  inscricaoEstadual?: string;
  rg?: string;
  telefone?: string;
  celular?: string;
  email?: string;
  endereco?: {
    endereco: string;
    numero: string;
    complemento?: string;
    bairro: string;
    municipio: string;
    cep: string;
    uf: string;
    pais: string;
  };
  id?: number;
}

export interface Order {
  id: string;
  numero: string;
  data_pedido: string;
  cliente: {
    nome: string;
    codigo: string;
  };
  situacao: string;
  valor_total: string;
}

interface TinyErpSettings {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
  [key: string]: string;
}

function isTinyErpSettings(settings: Json | null): settings is TinyErpSettings {
  if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
    return false;
  }

  const s = settings as Record<string, unknown>;
  return (
    typeof s.client_id === 'string' &&
    typeof s.client_secret === 'string' &&
    typeof s.redirect_uri === 'string'
  );
}

const situacaoMap: Record<number, string> = {
  0: "Pendente",
  1: "Aprovado",
  2: "Cancelado",
  3: "Em Andamento",
  4: "Em Digitação",
  5: "Pronto para Envio",
  6: "Enviado",
  7: "Entregue",
  8: "Devolvido"
};

export const useTinyOrders = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["tiny-orders"],
    queryFn: async () => {
      console.log("=== Iniciando busca de pedidos ===");
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      // Buscar integração e token de acesso
      const { data: integration, error: integrationError } = await supabase
        .from("integrations")
        .select("*")
        .eq("name", "tiny_erp")
        .eq("user_id", user.id)
        .maybeSingle();

      if (integrationError) {
        console.error("❌ Erro ao buscar integração:", integrationError);
        throw new Error("Erro ao buscar integração com Tiny ERP");
      }

      if (!integration) {
        console.error("❌ Integração não encontrada");
        throw new Error("Integração com Tiny ERP não configurada");
      }

      console.log("✅ Integração encontrada:", integration);

      if (!integration.access_token) {
        console.error("❌ Token de acesso não encontrado");
        throw new Error("Token de acesso não encontrado. Por favor, reconecte sua conta.");
      }

      console.log("✅ Token de acesso válido encontrado");

      // Sincronizar com a API do Tiny
      console.log("🔄 Sincronizando pedidos com Tiny API...");
      const { data: syncData, error: syncError } = await supabase.functions.invoke('tiny-orders', {
        body: { 
          access_token: integration.access_token,
          user_id: user.id
        }
      });

      if (syncError) {
        console.error("❌ Erro ao sincronizar pedidos:", syncError);
        throw syncError;
      }

      // Buscar pedidos do banco
      console.log("🔄 Buscando pedidos do banco de dados...");
      const { data: orders, error: ordersError } = await supabase
        .from('tiny_orders')
        .select('*')
        .eq('user_id', user.id)
        .order('data_criacao', { ascending: false });

      if (ordersError) {
        console.error("❌ Erro ao buscar pedidos:", ordersError);
        throw new Error("Erro ao buscar pedidos do banco de dados");
      }

      console.log("✅ Pedidos recebidos:", orders);

      return orders.map((order) => {
        const cliente = order.cliente as Record<string, any> | null;
        return {
          id: order.id,
          numero: order.numero_pedido.toString(),
          data_pedido: order.data_criacao,
          cliente: {
            nome: cliente?.nome || '-',
            codigo: cliente?.codigo || '-'
          },
          situacao: situacaoMap[order.situacao] || 'Desconhecido',
          valor_total: order.valor?.toFixed(2) || "0.00"
        };
      });
    },
    retry: false,
    meta: {
      onError: (error: Error) => {
        console.error("Query error:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar pedidos",
          description: error.message || "Ocorreu um erro ao carregar os pedidos",
        });
      }
    }
  });
};