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
      addresses: {
        Row: {
          address_type: string
          city: string
          complement: string | null
          country: string
          created_at: string
          customer_id: string
          id: string
          is_default: boolean | null
          neighborhood: string | null
          number: string | null
          postal_code: string
          state: string
          street: string
          updated_at: string
        }
        Insert: {
          address_type: string
          city: string
          complement?: string | null
          country?: string
          created_at?: string
          customer_id: string
          id?: string
          is_default?: boolean | null
          neighborhood?: string | null
          number?: string | null
          postal_code: string
          state: string
          street: string
          updated_at?: string
        }
        Update: {
          address_type?: string
          city?: string
          complement?: string | null
          country?: string
          created_at?: string
          customer_id?: string
          id?: string
          is_default?: boolean | null
          neighborhood?: string | null
          number?: string | null
          postal_code?: string
          state?: string
          street?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          id: string
          name: string
          parent_id: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          active: boolean | null
          created_at: string
          customer_type: string
          document_number: string | null
          document_type: string | null
          email: string
          id: string
          name: string
          phone: string | null
          profile_id: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          customer_type: string
          document_number?: string | null
          document_type?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          profile_id?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          customer_type?: string
          document_number?: string | null
          document_type?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          profile_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          status: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      inventory_history: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          operation_type: string
          product_id: string | null
          product_variation_id: string | null
          quantity_change: number
          reference_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          operation_type: string
          product_id?: string | null
          product_variation_id?: string | null
          quantity_change: number
          reference_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          operation_type?: string
          product_id?: string | null
          product_variation_id?: string | null
          quantity_change?: number
          reference_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_history_product_variation_id_fkey"
            columns: ["product_variation_id"]
            isOneToOne: false
            referencedRelation: "product_variations"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string | null
          product_variation_id: string | null
          quantity: number
          total_price: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id?: string | null
          product_variation_id?: string | null
          quantity: number
          total_price: number
          unit_price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string | null
          product_variation_id?: string | null
          quantity?: number
          total_price?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_variation_id_fkey"
            columns: ["product_variation_id"]
            isOneToOne: false
            referencedRelation: "product_variations"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address_id: string
          created_at: string
          customer_id: string
          discount_amount: number | null
          id: string
          notes: string | null
          order_number: string
          order_type: string
          payment_method: string
          payment_status: string
          shipping_address_id: string
          shipping_amount: number
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          billing_address_id: string
          created_at?: string
          customer_id: string
          discount_amount?: number | null
          id?: string
          notes?: string | null
          order_number: string
          order_type?: string
          payment_method: string
          payment_status: string
          shipping_address_id: string
          shipping_amount: number
          status: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          billing_address_id?: string
          created_at?: string
          customer_id?: string
          discount_amount?: number | null
          id?: string
          notes?: string | null
          order_number?: string
          order_type?: string
          payment_method?: string
          payment_status?: string
          shipping_address_id?: string
          shipping_amount?: number
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_billing_address_id_fkey"
            columns: ["billing_address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_shipping_address_id_fkey"
            columns: ["shipping_address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variations: {
        Row: {
          active: boolean | null
          attributes: Json
          created_at: string
          id: string
          name: string
          price: number
          product_id: string
          sku: string
          stock_quantity: number | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          attributes: Json
          created_at?: string
          id?: string
          name: string
          price: number
          product_id: string
          sku: string
          stock_quantity?: number | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          attributes?: Json
          created_at?: string
          id?: string
          name?: string
          price?: number
          product_id?: string
          sku?: string
          stock_quantity?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          category_id: string | null
          cost_price: number | null
          created_at: string
          description: string | null
          dimensions: string | null
          id: string
          image_url: string | null
          min_stock_quantity: number | null
          name: string
          price: number
          sku: string
          stock_quantity: number | null
          updated_at: string
          weight: number | null
        }
        Insert: {
          active?: boolean | null
          category_id?: string | null
          cost_price?: number | null
          created_at?: string
          description?: string | null
          dimensions?: string | null
          id?: string
          image_url?: string | null
          min_stock_quantity?: number | null
          name: string
          price: number
          sku: string
          stock_quantity?: number | null
          updated_at?: string
          weight?: number | null
        }
        Update: {
          active?: boolean | null
          category_id?: string | null
          cost_price?: number | null
          created_at?: string
          description?: string | null
          dimensions?: string | null
          id?: string
          image_url?: string | null
          min_stock_quantity?: number | null
          name?: string
          price?: number
          sku?: string
          stock_quantity?: number | null
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          role: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          role?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          role?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          created_at: string
          customer_id: string
          description: string
          id: string
          priority: string
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          customer_id: string
          description: string
          id?: string
          priority?: string
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          customer_id?: string
          description?: string
          id?: string
          priority?: string
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_integrations: {
        Row: {
          access_token: string | null
          created_at: string
          id: string
          integration_id: string
          refresh_token: string | null
          refresh_token_expires_at: string | null
          settings: Json | null
          status: boolean | null
          token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string
          id?: string
          integration_id: string
          refresh_token?: string | null
          refresh_token_expires_at?: string | null
          settings?: Json | null
          status?: boolean | null
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string
          id?: string
          integration_id?: string
          refresh_token?: string | null
          refresh_token_expires_at?: string | null
          settings?: Json | null
          status?: boolean | null
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_integrations_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "integrations"
            referencedColumns: ["id"]
          },
        ]
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
