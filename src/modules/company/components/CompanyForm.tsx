import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CompanyFormData } from "../types";
import { CompanyBasicInfo } from "./form/CompanyBasicInfo";
import { CompanyContactInfo } from "./form/CompanyContactInfo";
import { CompanyAddressInfo } from "./form/CompanyAddressInfo";

const companyFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  trading_name: z.string().optional(),
  tax_id: z.string().min(14, "CNPJ inválido"),
  state_tax_id: z.string().optional(),
  municipal_tax_id: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional(),
  website: z.string().url("URL inválida").optional(),
  address: z.object({
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip_code: z.string().optional(),
  }).optional(),
});

interface CompanyFormProps {
  initialData?: CompanyFormData;
  onSubmit: (data: CompanyFormData) => Promise<void>;
  loading?: boolean;
}

export function CompanyForm({ initialData, onSubmit, loading }: CompanyFormProps) {
  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: initialData || {
      name: "",
      trading_name: "",
      tax_id: "",
      state_tax_id: "",
      municipal_tax_id: "",
      phone: "",
      email: "",
      website: "",
      address: {
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        zip_code: "",
      },
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CompanyBasicInfo control={form.control} />
          <CompanyContactInfo control={form.control} />
        </div>
        <CompanyAddressInfo control={form.control} />
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}