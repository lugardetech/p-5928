export interface Product {
  id: string;
  nome: string;
  sku: string | null;
  preco: number | null;
  unidade: string | null;
  estoque: number | null;
  tipo: string | null;
  situacao: string | null;
}

export interface ProductTableRowProps {
  row: any; // Usando any temporariamente para resolver o erro do TableRow
}