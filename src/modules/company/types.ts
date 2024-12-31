import { Json } from "@/integrations/supabase/types";

export interface CompanyFormData {
  id?: string;
  name: string;
  trading_name?: string;
  tax_id: string;
  state_tax_id?: string;
  municipal_tax_id?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zip_code?: string;
  };
}

export interface CompanyData {
  id: string;
  name: string;
  trading_name: string | null;
  tax_id: string;
  state_tax_id: string | null;
  municipal_tax_id: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: Json | null;
  created_at: string | null;
  active: boolean | null;
  logo_url: string | null;
  settings: Json | null;
}