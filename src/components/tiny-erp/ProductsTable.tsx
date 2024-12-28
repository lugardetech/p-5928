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
      console.log("Fetching tiny_erp integration...");
      // First get the integration ID
      const { data: integration, error: integrationError } = await supabase
        .from("integrations")
        .select("id")
        .eq("name", "tiny_erp")
        .maybeSingle();

      if (integrationError) {
        console.error("Error fetching integration:", integrationError);
        throw integrationError;
      }

      if (!integration?.id) {
        console.error("Integration not found");
        throw new Error("Integração Tiny ERP não encontrada");
      }

      console.log("Fetching user integration with integration_id:", integration.id);
      const { data: userIntegration, error: userIntegrationError } = await supabase
        .from("user_integrations")
        .select("access_token")
        .eq("integration_id", integration.id)
        .maybeSingle();

      if (userIntegrationError) {
        console.error("Error fetching user integration:", userIntegrationError);
        throw userIntegrationError;
      }

      if (!userIntegration?.access_token) {
        console.error("Access token not found");
        throw new Error("Token de acesso não encontrado");
      }

      console.log("Fetching products from Edge Function...");
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tiny-products`, {
        headers: {
          "Authorization": `Bearer ${userIntegration.access_token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error fetching products:", errorText);
        throw new Error("Falha ao buscar produtos");
      }

      const data = await response.json();
      console.log("Products fetched successfully:", data);
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