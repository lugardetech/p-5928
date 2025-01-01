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

  tiny_orders: {
    Row: {
      id: string;
      user_id: string | null;
      tiny_id: number;
      numero_pedido: number;
      situacao: number;
      data_criacao: string | null;
      data_prevista: string | null;
      valor: number | null;
      cliente: Json | null;
      vendedor: Json | null;
      transportador: Json | null;
      ecommerce: Json | null;
      created_at: string | null;
      updated_at: string | null;
    };
    Insert: {
      id?: string;
      user_id?: string | null;
      tiny_id: number;
      numero_pedido: number;
      situacao: number;
      data_criacao?: string | null;
      data_prevista?: string | null;
      valor?: number | null;
      cliente?: Json | null;
      vendedor?: Json | null;
      transportador?: Json | null;
      ecommerce?: Json | null;
      created_at?: string | null;
      updated_at?: string | null;
    };
    Update: {
      id?: string;
      user_id?: string | null;
      tiny_id?: number;
      numero_pedido?: number;
      situacao?: number;
      data_criacao?: string | null;
      data_prevista?: string | null;
      valor?: number | null;
      cliente?: Json | null;
      vendedor?: Json | null;
      transportador?: Json | null;
      ecommerce?: Json | null;
      created_at?: string | null;
      updated_at?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "tiny_orders_user_id_fkey";
        columns: ["user_id"];
        isOneToOne: false;
        referencedRelation: "users";
        referencedColumns: ["id"];
      }
    ];
  };
}

export type TablesInsert<T extends keyof Tables> = Tables[T]['Insert']
export type TablesUpdate<T extends keyof Tables> = Tables[T]['Update']
