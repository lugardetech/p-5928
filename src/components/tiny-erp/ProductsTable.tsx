import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  nome: string;
  codigo: string;
  preco: string;
  unidade: string;
  estoque: string;
}

export const ProductsTable = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ["tiny-products"],
    queryFn: async () => {
      // First get the integration ID
      const { data: integration } = await supabase
        .from("integrations")
        .select("id")
        .eq("name", "tiny_erp")
        .single();

      if (!integration?.id) {
        throw new Error("Integração não encontrada");
      }

      const { data: userIntegration } = await supabase
        .from("user_integrations")
        .select("access_token")
        .eq("integration_id", integration.id)
        .single();

      if (!userIntegration?.access_token) {
        throw new Error("Token de acesso não encontrado");
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tiny-products`, {
        headers: {
          "Authorization": `Bearer ${userIntegration.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Falha ao buscar produtos");
      }

      const data = await response.json();
      return data.produtos as Product[];
    },
  });

  if (isLoading) {
    return <div>Carregando produtos...</div>;
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
          {products?.map((product) => (
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