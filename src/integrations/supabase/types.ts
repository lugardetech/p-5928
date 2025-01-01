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
      accounts_payable: {
        Row: {
          amount: number
          company_id: string | null
          created_at: string | null
          due_date: string
          id: string
          metadata: Json | null
          notes: string | null
          payment_date: string | null
          payment_method: string | null
          purchase_id: string | null
          status: string | null
          supplier_id: string | null
          tiny_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          company_id?: string | null
          created_at?: string | null
          due_date: string
          id?: string
          metadata?: Json | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          purchase_id?: string | null
          status?: string | null
          supplier_id?: string | null
          tiny_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          company_id?: string | null
          created_at?: string | null
          due_date?: string
          id?: string
          metadata?: Json | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          purchase_id?: string | null
          status?: string | null
          supplier_id?: string | null
          tiny_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_payable_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      accounts_receivable: {
        Row: {
          amount: number
          company_id: string | null
          created_at: string | null
          customer_id: string | null
          due_date: string
          id: string
          metadata: Json | null
          notes: string | null
          order_id: string | null
          payment_date: string | null
          payment_method: string | null
          status: string | null
          tiny_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          company_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          due_date: string
          id?: string
          metadata?: Json | null
          notes?: string | null
          order_id?: string | null
          payment_date?: string | null
          payment_method?: string | null
          status?: string | null
          tiny_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          company_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          due_date?: string
          id?: string
          metadata?: Json | null
          notes?: string | null
          order_id?: string | null
          payment_date?: string | null
          payment_method?: string | null
          status?: string | null
          tiny_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_receivable_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_receivable_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_interactions: {
        Row: {
          company_id: string | null
          created_at: string | null
          duration: number | null
          id: string
          input: string
          metadata: Json | null
          model: string
          output: string | null
          tokens_used: number | null
          type: string
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          duration?: number | null
          id?: string
          input: string
          metadata?: Json | null
          model: string
          output?: string | null
          tokens_used?: number | null
          type: string
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          duration?: number | null
          id?: string
          input?: string
          metadata?: Json | null
          model?: string
          output?: string | null
          tokens_used?: number | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_interactions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_settings: {
        Row: {
          company_id: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          model: string
          provider: string
          settings: Json | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          model: string
          provider: string
          settings?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          model?: string
          provider?: string
          settings?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_suggestions: {
        Row: {
          applied: boolean | null
          applied_at: string | null
          applied_by: string | null
          company_id: string | null
          confidence: number | null
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          metadata: Json | null
          suggestion: string
          type: string
        }
        Insert: {
          applied?: boolean | null
          applied_at?: string | null
          applied_by?: string | null
          company_id?: string | null
          confidence?: number | null
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          metadata?: Json | null
          suggestion: string
          type: string
        }
        Update: {
          applied?: boolean | null
          applied_at?: string | null
          applied_by?: string | null
          company_id?: string | null
          confidence?: number | null
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          metadata?: Json | null
          suggestion?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_suggestions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          company_id: string | null
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          metadata: Json | null
          new_data: Json | null
          old_data: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          company_id?: string | null
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          metadata?: Json | null
          new_data?: Json | null
          old_data?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          company_id?: string | null
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          metadata?: Json | null
          new_data?: Json | null
          old_data?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_executions: {
        Row: {
          created_at: string | null
          error: string | null
          id: string
          metadata: Json | null
          result: Json | null
          rule_id: string | null
          status: string
          trigger_entity_id: string
          trigger_entity_type: string
        }
        Insert: {
          created_at?: string | null
          error?: string | null
          id?: string
          metadata?: Json | null
          result?: Json | null
          rule_id?: string | null
          status: string
          trigger_entity_id: string
          trigger_entity_type: string
        }
        Update: {
          created_at?: string | null
          error?: string | null
          id?: string
          metadata?: Json | null
          result?: Json | null
          rule_id?: string | null
          status?: string
          trigger_entity_id?: string
          trigger_entity_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_executions_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "automation_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_rules: {
        Row: {
          actions: Json
          company_id: string | null
          conditions: Json
          created_at: string | null
          description: string | null
          event_type: string
          id: string
          metadata: Json | null
          name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          actions: Json
          company_id?: string | null
          conditions: Json
          created_at?: string | null
          description?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          actions?: Json
          company_id?: string | null
          conditions?: Json
          created_at?: string | null
          description?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automation_rules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      cash_flow: {
        Row: {
          amount: number
          category: string
          company_id: string | null
          created_at: string | null
          date: string
          description: string | null
          id: string
          metadata: Json | null
          reference_id: string | null
          reference_type: string | null
          tiny_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          category: string
          company_id?: string | null
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          reference_type?: string | null
          tiny_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category?: string
          company_id?: string | null
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          reference_type?: string | null
          tiny_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cash_flow_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_service: {
        Row: {
          assigned_to: string | null
          company_id: string | null
          created_at: string | null
          customer_id: string | null
          description: string | null
          id: string
          metadata: Json | null
          priority: string | null
          resolution: string | null
          resolved_at: string | null
          status: string | null
          subject: string
          tiny_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          company_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          priority?: string | null
          resolution?: string | null
          resolved_at?: string | null
          status?: string | null
          subject: string
          tiny_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          company_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          priority?: string | null
          resolution?: string | null
          resolved_at?: string | null
          status?: string | null
          subject?: string
          tiny_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_service_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_service_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: Json | null
          company_id: string | null
          created_at: string | null
          email: string | null
          id: string
          metadata: Json | null
          name: string
          phone: string | null
          status: string | null
          tax_id: string | null
          tiny_id: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          address?: Json | null
          company_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          metadata?: Json | null
          name: string
          phone?: string | null
          status?: string | null
          tax_id?: string | null
          tiny_id?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: Json | null
          company_id?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          phone?: string | null
          status?: string | null
          tax_id?: string | null
          tiny_id?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
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
      purchase_items: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          product_id: string | null
          purchase_id: string | null
          quantity: number
          received_quantity: number | null
          tiny_id: string | null
          total_price: number
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          product_id?: string | null
          purchase_id?: string | null
          quantity: number
          received_quantity?: number | null
          tiny_id?: string | null
          total_price: number
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          product_id?: string | null
          purchase_id?: string | null
          quantity?: number
          received_quantity?: number | null
          tiny_id?: string | null
          total_price?: number
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_items_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      purchases: {
        Row: {
          company_id: string | null
          created_at: string | null
          delivery_date: string | null
          expected_date: string | null
          id: string
          metadata: Json | null
          notes: string | null
          number: string
          status: string | null
          supplier_id: string | null
          tiny_id: string | null
          total: number | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          delivery_date?: string | null
          expected_date?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          number: string
          status?: string | null
          supplier_id?: string | null
          tiny_id?: string | null
          total?: number | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          delivery_date?: string | null
          expected_date?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          number?: string
          status?: string | null
          supplier_id?: string | null
          tiny_id?: string | null
          total?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchases_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      service_interactions: {
        Row: {
          attachments: Json | null
          created_at: string | null
          id: string
          message: string
          metadata: Json | null
          service_id: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          service_id?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          service_id?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_interactions_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "customer_service"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: Json | null
          company_id: string | null
          contact_name: string | null
          created_at: string | null
          email: string | null
          id: string
          metadata: Json | null
          name: string
          payment_terms: string | null
          phone: string | null
          status: string | null
          tax_id: string | null
          tiny_id: string | null
          updated_at: string | null
        }
        Insert: {
          address?: Json | null
          company_id?: string | null
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          metadata?: Json | null
          name: string
          payment_terms?: string | null
          phone?: string | null
          status?: string | null
          tax_id?: string | null
          tiny_id?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: Json | null
          company_id?: string | null
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          payment_terms?: string | null
          phone?: string | null
          status?: string | null
          tax_id?: string | null
          tiny_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_company_id_fkey"
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
      tiny_orders: {
        Row: {
          cliente: Json | null
          created_at: string | null
          data_criacao: string | null
          data_prevista: string | null
          ecommerce: Json | null
          id: string
          numero_pedido: number
          situacao: number
          tiny_id: number
          transportador: Json | null
          updated_at: string | null
          user_id: string | null
          valor: number | null
          vendedor: Json | null
        }
        Insert: {
          cliente?: Json | null
          created_at?: string | null
          data_criacao?: string | null
          data_prevista?: string | null
          ecommerce?: Json | null
          id?: string
          numero_pedido: number
          situacao: number
          tiny_id: number
          transportador?: Json | null
          updated_at?: string | null
          user_id?: string | null
          valor?: number | null
          vendedor?: Json | null
        }
        Update: {
          cliente?: Json | null
          created_at?: string | null
          data_criacao?: string | null
          data_prevista?: string | null
          ecommerce?: Json | null
          id?: string
          numero_pedido?: number
          situacao?: number
          tiny_id?: number
          transportador?: Json | null
          updated_at?: string | null
          user_id?: string | null
          valor?: number | null
          vendedor?: Json | null
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
