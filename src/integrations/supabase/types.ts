export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          active: boolean | null
          address: Json | null
          created_at: string | null
          email: string | null
          id: string
          logo_url: string | null
          municipal_tax_id: string | null
          name: string
          phone: string | null
          settings: Json | null
          state_tax_id: string | null
          tax_id: string
          trading_name: string | null
          website: string | null
        }
        Insert: {
          active?: boolean | null
          address?: Json | null
          created_at?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          municipal_tax_id?: string | null
          name: string
          phone?: string | null
          settings?: Json | null
          state_tax_id?: string | null
          tax_id: string
          trading_name?: string | null
          website?: string | null
        }
        Update: {
          active?: boolean | null
          address?: Json | null
          created_at?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          municipal_tax_id?: string | null
          name?: string
          phone?: string | null
          settings?: Json | null
          state_tax_id?: string | null
          tax_id?: string
          trading_name?: string | null
          website?: string | null
        }
        Relationships: []
      }
      integrations: {
        Row: {
          access_token: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          refresh_token: string | null
          refresh_token_expires_at: string | null
          settings: Json | null
          token_expires_at: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          refresh_token?: string | null
          refresh_token_expires_at?: string | null
          settings?: Json | null
          token_expires_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          refresh_token?: string | null
          refresh_token_expires_at?: string | null
          settings?: Json | null
          token_expires_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      mercadolivre_claims: {
        Row: {
          claim_id: string
          created_at: string | null
          date_created: string | null
          fulfilled: boolean | null
          id: string
          last_updated: string | null
          parent_id: string | null
          players: Json | null
          quantity_type: string | null
          reason_id: string | null
          resolution: Json | null
          resource: string | null
          resource_id: number | null
          site_id: string | null
          stage: string | null
          status: string | null
          type: string | null
          user_id: string
        }
        Insert: {
          claim_id: string
          created_at?: string | null
          date_created?: string | null
          fulfilled?: boolean | null
          id?: string
          last_updated?: string | null
          parent_id?: string | null
          players?: Json | null
          quantity_type?: string | null
          reason_id?: string | null
          resolution?: Json | null
          resource?: string | null
          resource_id?: number | null
          site_id?: string | null
          stage?: string | null
          status?: string | null
          type?: string | null
          user_id: string
        }
        Update: {
          claim_id?: string
          created_at?: string | null
          date_created?: string | null
          fulfilled?: boolean | null
          id?: string
          last_updated?: string | null
          parent_id?: string | null
          players?: Json | null
          quantity_type?: string | null
          reason_id?: string | null
          resolution?: Json | null
          resource?: string | null
          resource_id?: number | null
          site_id?: string | null
          stage?: string | null
          status?: string | null
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string | null
          customer_id: string | null
          id: string
          items: Json | null
          status: string
          total: number | null
          type: string
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          items?: Json | null
          status: string
          total?: number | null
          type: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          id?: string
          items?: Json | null
          status?: string
          total?: number | null
          type?: string
        }
        Relationships: []
      }
      produtos: {
        Row: {
          category_id: string | null
          codigo: string
          created_at: string | null
          estoque: number
          id: string
          nome: string
          preco: number
          unidade: string
        }
        Insert: {
          category_id?: string | null
          codigo: string
          created_at?: string | null
          estoque?: number
          id?: string
          nome: string
          preco?: number
          unidade: string
        }
        Update: {
          category_id?: string | null
          codigo?: string
          created_at?: string | null
          estoque?: number
          id?: string
          nome?: string
          preco?: number
          unidade?: string
        }
        Relationships: [
          {
            foreignKeyName: "produtos_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          active: boolean | null
          avatar_url: string | null
          company_id: string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          permissions: Json | null
          phone: string | null
          role: string | null
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          permissions?: Json | null
          phone?: string | null
          role?: string | null
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          permissions?: Json | null
          phone?: string | null
          role?: string | null
          settings?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          created_at: string | null
          customer_id: string | null
          description: string | null
          id: string
          priority: string | null
          status: string
          title: string
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          status: string
          title: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          status?: string
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
