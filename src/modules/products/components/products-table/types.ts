import { Row } from "@tanstack/react-table";

export interface Product {
  id: string;
  nome: string;
  sku: string | null;
  preco: number;
  unidade: string;
  estoque: number;
  tipo: string | null;
  situacao: string | null;
}

export interface ProductTableRowProps {
  row: Row<Product>;
}