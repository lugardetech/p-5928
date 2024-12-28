import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Product {
  id: string;
  nome: string;
  codigo: string;
  preco: string;
  unidade: string;
  estoque: string;
}

export const ProductsTable = () => {
  const { toast } = useToast();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ["tiny-products"],
    queryFn: async () => {
      console.log("=== Iniciando busca de produtos ===");
      
      // Primeiro, buscar a integração
      const { data: integration, error: integrationError } = await supabase
        .from("integrations")
        .select("id")
        .eq("name", "tiny_erp")
        .maybeSingle();

      if (integrationError) {
        console.error("❌ Erro ao buscar integração:", integrationError);
        throw new Error("Integração Tiny ERP não encontrada");
      }

      if (!integration?.id) {
        console.error("❌ Integração não encontrada");
        throw new Error("Integração Tiny ERP não encontrada");
      }

      console.log("✅ Integração encontrada:", integration);

      // Depois, buscar o token de acesso do usuário
      const { data: userIntegration, error: userIntegrationError } = await supabase
        .from("user_integrations")
        .select("access_token")
        .eq("integration_id", integration.id)
        .maybeSingle();

      if (userIntegrationError) {
        console.error("❌ Erro ao buscar integração do usuário:", userIntegrationError);
        throw userIntegrationError;
      }

      if (!userIntegration?.access_token) {
        console.error("❌ Token de acesso não encontrado");
        throw new Error("Token de acesso não encontrado");
      }

      console.log("✅ Token de acesso encontrado");

      // Agora sim, chamar a Edge Function
      console.log("🔄 Chamando Edge Function tiny-products...");
      const { data, error: functionError } = await supabase.functions.invoke('tiny-products', {
        headers: {
          Authorization: `Bearer ${userIntegration.access_token}`,
        },
      });

      if (functionError) {
        console.error("❌ Erro na Edge Function:", functionError);
        throw new Error(functionError.message);
      }

      console.log("✅ Produtos recebidos:", data);
      return data.produtos as Product[];
    },
    retry: false,
    meta: {
      onError: (error: Error) => {
        console.error("Query error:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar produtos",
          description: error.message || "Ocorreu um erro ao carregar os produtos",
        });
      }
    }
  });

  if (error) {
    return (
      <div className="p-4 text-red-500">
        {error instanceof Error ? error.message : "Erro ao carregar produtos"}
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-4">Carregando produtos...</div>;
  }

  if (!products?.length) {
    return <div className="p-4">Nenhum produto encontrado.</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Unidade</TableHead>
            <TableHead>Estoque</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.codigo}</TableCell>
              <TableCell>{product.nome}</TableCell>
              <TableCell>R$ {product.preco}</TableCell>
              <TableCell>{product.unidade}</TableCell>
              <TableCell>{product.estoque}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};