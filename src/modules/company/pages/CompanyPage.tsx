import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyFormData, CompanyData } from "../types";
import { CompanyForm } from "../components/CompanyForm";
import { adaptFormDataToDatabase, adaptDatabaseToFormData } from "../utils/form-adapters";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CompanyDetails } from "../components/CompanyDetails";

export default function CompanyPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<CompanyFormData | null>(null);
  const [showForm, setShowForm] = useState(false);

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
            const formData = adaptDatabaseToFormData(companyData as CompanyData);
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

      if (!company?.id) {
        // Criar nova empresa
        const { data: newCompany, error: createError } = await supabase
          .from("companies")
          .insert({ ...dbData, active: true })
          .select()
          .single();

        if (createError) throw createError;

        // Atualizar perfil do usuário com o ID da empresa
        const { error: updateProfileError } = await supabase
          .from("profiles")
          .update({ company_id: newCompany.id })
          .eq("id", profile.user.id);

        if (updateProfileError) throw updateProfileError;

        setCompany(adaptDatabaseToFormData(newCompany as CompanyData));
      } else {
        // Atualizar empresa existente
        const { data: updatedCompany, error: updateError } = await supabase
          .from("companies")
          .update(dbData)
          .eq("id", company.id)
          .select()
          .single();

        if (updateError) throw updateError;

        if (updatedCompany) {
          setCompany(adaptDatabaseToFormData(updatedCompany as CompanyData));
        }
      }

      toast({
        title: "Empresa salva com sucesso!",
        description: "Os dados da empresa foram atualizados.",
      });
      setShowForm(false);
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
      <div className="flex justify-end mb-6">
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Dados da Empresa</DialogTitle>
            </DialogHeader>
            <CompanyForm
              initialData={company || undefined}
              onSubmit={onSubmit}
              loading={loading}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      {company && <CompanyDetails company={company} />}
    </div>
  );
}