import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/masked-input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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

type CompanyFormValues = z.infer<typeof companyFormSchema>;

export default function CompanyPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<any>(null);

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
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

  useEffect(() => {
    async function loadCompany() {
      try {
        const { data: profile } = await supabase.auth.getUser();
        
        if (!profile.user) return;

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("company_id")
          .eq("id", profile.user.id)
          .single();

        if (profileError) throw profileError;

        if (profileData?.company_id) {
          const { data: companyData, error: companyError } = await supabase
            .from("companies")
            .select("*")
            .eq("id", profileData.company_id)
            .single();

          if (companyError) throw companyError;

          setCompany(companyData);
          form.reset(companyData);
        }
      } catch (error) {
        console.error("Erro ao carregar empresa:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados da empresa",
          description: "Por favor, tente novamente mais tarde.",
        });
      } finally {
        setLoading(false);
      }
    }

    loadCompany();
  }, []);

  async function onSubmit(data: CompanyFormValues) {
    try {
      setLoading(true);
      
      const { data: profile } = await supabase.auth.getUser();
      if (!profile.user) return;

      let companyId = company?.id;

      if (!companyId) {
        // Criar nova empresa
        const { data: newCompany, error: createError } = await supabase
          .from("companies")
          .insert([data])
          .select()
          .single();

        if (createError) throw createError;
        companyId = newCompany.id;

        // Atualizar perfil com company_id
        const { error: updateProfileError } = await supabase
          .from("profiles")
          .update({ company_id: companyId })
          .eq("id", profile.user.id);

        if (updateProfileError) throw updateProfileError;
      } else {
        // Atualizar empresa existente
        const { error: updateError } = await supabase
          .from("companies")
          .update(data)
          .eq("id", companyId);

        if (updateError) throw updateError;
      }

      toast({
        title: "Empresa salva com sucesso!",
        description: "Os dados da empresa foram atualizados.",
      });
    } catch (error) {
      console.error("Erro ao salvar empresa:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar empresa",
        description: "Por favor, tente novamente mais tarde.",
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Dados da Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Razão Social</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="trading_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Fantasia</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tax_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CNPJ</FormLabel>
                      <FormControl>
                        <MaskedInput 
                          mask="99.999.999/9999-99"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state_tax_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inscrição Estadual</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <MaskedInput 
                          mask="(99) 99999-9999"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input {...field} type="url" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.zip_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <MaskedInput 
                          mask="99999-999"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}