export interface TinyProductBase {
  id: string;
  user_id: string | null;
  tiny_id: number;
  sku: string | null;
  nome: string;
  preco: number | null;
  preco_promocional: number | null;
  unidade: string | null;
  tipo: string | null;
  situacao: string | null;
  formato: string | null;
  descricao: string | null;
  estoque: number | null;
  estoque_minimo: number | null;
  estoque_maximo: number | null;
  peso_bruto: number | null;
  peso_liquido: number | null;
  created_at: string | null;
  updated_at: string | null;
  metadata: Record<string, any> | null;
}