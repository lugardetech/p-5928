import { CompanyFormData, CompanyData } from "../types";
import { Json } from "@/integrations/supabase/types";

export function adaptFormDataToDatabase(formData: CompanyFormData): Partial<CompanyData> {
  return {
    name: formData.name,
    trading_name: formData.trading_name || null,
    tax_id: formData.tax_id,
    state_tax_id: formData.state_tax_id || null,
    municipal_tax_id: formData.municipal_tax_id || null,
    phone: formData.phone || null,
    email: formData.email || null,
    website: formData.website || null,
    address: formData.address as Json,
  };
}

export function adaptDatabaseToFormData(data: CompanyData): CompanyFormData {
  return {
    name: data.name,
    trading_name: data.trading_name || undefined,
    tax_id: data.tax_id,
    state_tax_id: data.state_tax_id || undefined,
    municipal_tax_id: data.municipal_tax_id || undefined,
    phone: data.phone || undefined,
    email: data.email || undefined,
    website: data.website || undefined,
    address: data.address as CompanyFormData['address'],
  };
}