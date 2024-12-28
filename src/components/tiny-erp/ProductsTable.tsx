import { useState } from "react";
import { ProductSearch } from "./ProductSearch";
import { UnitFilter } from "./UnitFilter";
import { ProductsTableContent } from "./ProductsTableContent";
import { useTinyProducts } from "./hooks/useTinyProducts";

export const ProductsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<string>("all");

  const { data: products, isLoading, error } = useTinyProducts();

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
    
    const matchesUnit = selectedUnit === "all" || product.unidade === selectedUnit;
    
    return matchesSearch && matchesUnit;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
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