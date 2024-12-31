export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
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
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];