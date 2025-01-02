import { TinyProductDetails } from './tiny-product-details';

export interface TinyProductAttachment {
  id: string;
  product_id: string | null;
  url: string;
  externo: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface TinyProductSupplier {
  id: string;
  product_id: string | null;
  fornecedor_id: number | null;
  fornecedor_nome: string | null;
  nome: string | null;
  codigo_produto_fornecedor: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface TinyProductVariation {
  id: string;
  product_id: string | null;
  tiny_id: number | null;
  descricao: string | null;
  sku: string | null;
  gtin: string | null;
  preco: number | null;
  preco_promocional: number | null;
  preco_custo: number | null;
  preco_custo_medio: number | null;
  controlar_estoque: boolean | null;
  sob_encomenda: boolean | null;
  dias_preparacao: number | null;
  localizacao: string | null;
  estoque_minimo: number | null;
  estoque_maximo: number | null;
  estoque: number | null;
  created_at: string | null;
  updated_at: string | null;
  grades?: TinyProductVariationGrade[];
}

export interface TinyProductVariationGrade {
  id: string;
  variation_id: string | null;
  chave: string | null;
  valor: string | null;
  created_at: string | null;
}

export interface TinyProductWithRelationships extends TinyProductDetails {
  anexos?: TinyProductAttachment[];
  fornecedores?: TinyProductSupplier[];
  variacoes?: TinyProductVariation[];
}