import { Json } from './base';

export interface Tables {
  categories: {
    Row: {
      id: string;
      created_at: string | null;
      name: string;
      active: boolean | null;
    };
    Insert: {
      id?: string;
      created_at?: string | null;
      name: string;
      active?: boolean | null;
    };
    Update: {
      id?: string;
      created_at?: string | null;
      name?: string;
      active?: boolean | null;
    };
    Relationships: [];
  };

  produtos: {
    Row: {
      id: string;
      created_at: string | null;
      nome: string;
      codigo: string;
      preco: number;
      estoque: number;
      unidade: string;
    };
    Insert: {
      id?: string;
      created_at?: string | null;
      nome: string;
      codigo: string;
      preco?: number;
      estoque?: number;
      unidade: string;
    };
    Update: {
      id?: string;
      created_at?: string | null;
      nome?: string;
      codigo?: string;
      preco?: number;
      estoque?: number;
      unidade?: string;
    };
    Relationships: [];
  };
}

export type TablesInsert<T extends keyof Tables> = Tables[T]['Insert']
export type TablesUpdate<T extends keyof Tables> = Tables[T]['Update']