import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<string>("");

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
        body: { access_token: userIntegration.access_token }
      });

      if (functionError) {
        console.error("❌ Erro na Edge Function:", functionError);
        throw new Error(functionError.message);
      }

      console.log("✅ Produtos recebidos:", data);
      
      if (!data?.itens) {
        throw new Error("Nenhum produto encontrado");
      }

      return data.itens.map(item => ({
        id: item.id,
        nome: item.descricao,
        codigo: item.sku,
        preco: item.precos?.preco?.toFixed(2) || "0.00",
        unidade: item.unidade || "-",
        estoque: "Consultar"
      }));
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

  // Obter lista única de unidades para o select
  const uniqueUnits = Array.from(new Set(products.map(product => product.unidade))).sort();

  // Filtrar produtos baseado na busca e unidade selecionada
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === "" || 
      product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUnit = selectedUnit === "" || product.unidade === selectedUnit;
    
    return matchesSearch && matchesUnit;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar por nome ou código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="w-[180px]">
          <Select value={selectedUnit} onValueChange={setSelectedUnit}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por unidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as unidades</SelectItem>
              {uniqueUnits.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

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
            {filteredProducts.map((product) => (
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
    </div>
  );
};