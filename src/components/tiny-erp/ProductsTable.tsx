import { useState } from "react";
import { ProductSearch } from "./ProductSearch";
import { UnitFilter } from "./UnitFilter";
import { ProductsTableContent } from "./ProductsTableContent";
import { useTinyProducts } from "./hooks/useTinyProducts";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TinyProduct } from "@/integrations/supabase/types/tiny-products";

interface Product {
  id: string;
  nome: string;
  codigo: string;
  preco: string;
  unidade: string;
  estoque: string;
}

export const ProductsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<string>("all");

  const { data: tinyProducts, isLoading, error } = useTinyProducts();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !tinyProducts?.length) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-muted-foreground">
        {error ? "Erro ao carregar produtos." : "Nenhum produto encontrado."}
      </div>
    );
  }

  // Converter TinyProduct para Product
  const products: Product[] = tinyProducts.map(tp => ({
    id: tp.id,
    nome: tp.nome,
    codigo: tp.codigo || tp.sku || '',
    preco: tp.preco?.toString() || '0',
    unidade: tp.unidade || '',
    estoque: tp.estoque?.toString() || '0'
  }));

  // Obter lista única de unidades para o select
  const uniqueUnits = Array.from(
    new Set(products.map(product => product.unidade || ""))
  ).sort() as string[];

  // Filtrar produtos baseado na busca e unidade selecionada
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === "" || 
      product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUnit = selectedUnit === "all" || product.unidade === selectedUnit;
    
    return matchesSearch && matchesUnit;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <ProductSearch value={searchTerm} onChange={setSearchTerm} />
        <UnitFilter 
          units={uniqueUnits} 
          selectedUnit={selectedUnit} 
          onUnitChange={setSelectedUnit} 
        />
      </div>
      <ProductsTableContent products={filteredProducts} />
    </div>
  );
};