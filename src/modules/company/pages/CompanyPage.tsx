import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyFormData, CompanyData } from "../types";
import { CompanyForm } from "../components/CompanyForm";
import { adaptFormDataToDatabase, adaptDatabaseToFormData } from "../utils/form-adapters";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CompanyDetails } from "../components/CompanyDetails";

export default function CompanyPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadCompany();
  }, []);

  async function loadCompany() {
    try {
      setLoading(true);
      const { data: profile } = await supabase.auth.getUser();
      
      if (!profile.user) {
        console.log("Usuário não autenticado");
        setLoading(false);
        return;
      }

      console.log("Buscando perfil do usuário:", profile.user.id);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("company_id")
        .eq("id", profile.user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Erro ao carregar perfil:", profileError);
        throw profileError;
      }

      console.log("Perfil encontrado:", profileData);

      if (profileData?.company_id) {
        console.log("Buscando empresa com ID:", profileData.company_id);
        
        const { data: companyData, error: companyError } = await supabase
          .from("companies")
          .select("*")
          .eq("id", profileData.company_id)
          .maybeSingle();

        if (companyError) {
          console.error("Erro ao carregar empresa:", companyError);
          throw companyError;
        }

        if (companyData) {
          console.log("Dados da empresa carregados:", companyData);
          setCompany(companyData);
        } else {
          console.log("Nenhuma empresa encontrada para o ID:", profileData.company_id);
        }
      } else {
        console.log("Usuário não possui empresa vinculada");
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

  async function onSubmit(data: CompanyFormData) {
    try {
      setLoading(true);
      
      const { data: profile } = await supabase.auth.getUser();
      if (!profile.user) {
        console.log("Usuário não autenticado");
        return;
      }

      const dbData = adaptFormDataToDatabase(data);
      console.log("Salvando dados da empresa:", dbData);

      if (!company?.id) {
        // Criar nova empresa
        const { data: newCompany, error: createError } = await supabase
          .from("companies")
          .insert([{ ...dbData, id: crypto.randomUUID() }])
          .select()
          .single();

        if (createError) throw createError;

        // Atualizar perfil do usuário com o ID da empresa
        const { error: updateProfileError } = await supabase
          .from("profiles")
          .update({ company_id: newCompany.id })
          .eq("id", profile.user.id);

        if (updateProfileError) throw updateProfileError;

        setCompany(newCompany);
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
          setCompany(updatedCompany);
        }
      }

      toast({
        title: "Empresa salva com sucesso!",
        description: "Os dados da empresa foram atualizados.",
      });
      setShowForm(false);
      
      // Recarregar os dados da empresa após salvar
      await loadCompany();
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
              <DialogDescription>
                Preencha os dados da sua empresa para continuar.
              </DialogDescription>
            </DialogHeader>
            <CompanyForm
              initialData={company ? adaptDatabaseToFormData(company) : undefined}
              onSubmit={onSubmit}
              loading={loading}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <CompanyDetails company={company} />
    </div>
  );
}