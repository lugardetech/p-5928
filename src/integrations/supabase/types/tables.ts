import { Json } from './base';

export interface Tables {
  integrations: {
    Row: {
      id: string;
      created_at: string | null;
      name: string;
      description: string | null;
    };
    Insert: {
      id?: string;
      created_at?: string | null;
      name: string;
      description?: string | null;
    };
    Update: {
      id?: string;
      created_at?: string | null;
      name?: string;
      description?: string | null;
    };
    Relationships: [];
  };

  mercadolivre_claims: {
    Row: {
      id: string;
      created_at: string | null;
      user_id: string;
      claim_id: string;
      status: string | null;
      date_created: string | null;
      date_closed: string | null;
      title: string | null;
      description: string | null;
      reason: string | null;
      order_id: string | null;
      buyer: Json | null;
    };
    Insert: {
      id?: string;
      created_at?: string | null;
      user_id: string;
      claim_id: string;
      status?: string | null;
      date_created?: string | null;
      date_closed?: string | null;
      title?: string | null;
      description?: string | null;
      reason?: string | null;
      order_id?: string | null;
      buyer?: Json | null;
    };
    Update: {
      id?: string;
      created_at?: string | null;
      user_id?: string;
      claim_id?: string;
      status?: string | null;
      date_created?: string | null;
      date_closed?: string | null;
      title?: string | null;
      description?: string | null;
      reason?: string | null;
      order_id?: string | null;
      buyer?: Json | null;
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

  user_integrations: {
    Row: {
      id: string;
      created_at: string | null;
      user_id: string;
      integration_id: string;
      settings: Json | null;
      access_token: string | null;
      refresh_token: string | null;
      token_expires_at: string | null;
      refresh_token_expires_at: string | null;
    };
    Insert: {
      id?: string;
      created_at?: string | null;
      user_id: string;
      integration_id: string;
      settings?: Json | null;
      access_token?: string | null;
      refresh_token?: string | null;
      token_expires_at?: string | null;
      refresh_token_expires_at?: string | null;
    };
    Update: {
      id?: string;
      created_at?: string | null;
      user_id?: string;
      integration_id?: string;
      settings?: Json | null;
      access_token?: string | null;
      refresh_token?: string | null;
      token_expires_at?: string | null;
      refresh_token_expires_at?: string | null;
    };
    Relationships: [
      {
        foreignKeyName: "user_integrations_integration_id_fkey";
        columns: ["integration_id"];
        isOneToOne: false;
        referencedRelation: "integrations";
        referencedColumns: ["id"];
      }
    ];
  };
}