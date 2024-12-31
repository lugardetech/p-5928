import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyFormData } from "../types";
import { CompanyForm } from "../components/CompanyForm";
import { adaptFormDataToDatabase, adaptDatabaseToFormData } from "../utils/form-adapters";

export default function CompanyPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<CompanyFormData | null>(null);

  useEffect(() => {
    async function loadCompany() {
      try {
        const { data: profile } = await supabase.auth.getUser();
        
        if (!profile.user) return;

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("company_id")
          .eq("id", profile.user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (profileData?.company_id) {
          const { data: companyData, error: companyError } = await supabase
            .from("companies")
            .select("*")
            .eq("id", profileData.company_id)
            .maybeSingle();

          if (companyError) throw companyError;

          if (companyData) {
            const formData = adaptDatabaseToFormData(companyData);
            setCompany(formData);
          }
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

  async function onSubmit(data: CompanyFormData) {
    try {
      setLoading(true);
      
      const { data: profile } = await supabase.auth.getUser();
      if (!profile.user) return;

      const dbData = adaptFormDataToDatabase(data);
      let companyId = company?.id;

      if (!companyId) {
        const { data: newCompany, error: createError } = await supabase
          .from("companies")
          .insert([dbData])
          .select()
          .single();

        if (createError) throw createError;
        companyId = newCompany.id;

        const { error: updateProfileError } = await supabase
          .from("profiles")
          .update({ company_id: companyId })
          .eq("id", profile.user.id);

        if (updateProfileError) throw updateProfileError;
      } else {
        const { error: updateError } = await supabase
          .from("companies")
          .update(dbData)
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
          <CompanyForm
            initialData={company || undefined}
            onSubmit={onSubmit}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
}