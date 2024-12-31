import { useState } from "react";
import { ProductSearch } from "./ProductSearch";
import { UnitFilter } from "./UnitFilter";
import { ProductsTableContent } from "./ProductsTableContent";
import { useTinyProducts } from "./hooks/useTinyProducts";
import { Card } from "@/components/ui/card";

export const ProductsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<string>("all");

  const { data: products, isLoading, error } = useTinyProducts();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-full animate-pulse bg-muted rounded" />
        <div className="h-[400px] w-full animate-pulse bg-muted rounded" />
      </div>
    );
  }

  if (error || !products?.length) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-muted-foreground">
        {error ? "Erro ao carregar produtos." : "Nenhum produto encontrado."}
      </div>
    );
  }

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