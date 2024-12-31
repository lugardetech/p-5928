import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { CredentialsFormFields, credentialsSchema, type CredentialsForm as CredentialsFormType } from "./forms/CredentialsFormFields";

export const CredentialsForm = () => {
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  const form = useForm<CredentialsFormType>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      client_id: "",
      client_secret: "",
      redirect_uri: window.location.origin + "/integration/mercado-livre/callback",
    },
  });

  const onSubmit = async (data: CredentialsFormType) => {
    try {
      if (!userId) {
        throw new Error("Usuário não autenticado");
      }

      console.log("Salvando credenciais para o usuário:", userId);

      // Verificar se já existe uma integração
      const { data: existingIntegration, error: fetchError } = await supabase
        .from("integrations")
        .select("id")
        .eq("user_id", userId)
        .eq("name", "mercado_livre")
        .maybeSingle();

      console.log("Integração existente:", existingIntegration);
      console.log("Erro ao buscar:", fetchError);

      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError;
      }

      let error;
      
      if (existingIntegration) {
        console.log("Atualizando integração existente:", existingIntegration.id);
        const { error: updateError } = await supabase
          .from("integrations")
          .update({
            settings: {
              client_id: data.client_id,
              client_secret: data.client_secret,
              redirect_uri: data.redirect_uri,
            },
          })
          .eq("id", existingIntegration.id);
        error = updateError;
      } else {
        console.log("Criando nova integração");
        const { error: insertError } = await supabase
          .from("integrations")
          .insert({
            name: "mercado_livre",
            user_id: userId,
            description: "Integração com o Mercado Livre para gerenciamento de vendas e reclamações",
            settings: {
              client_id: data.client_id,
              client_secret: data.client_secret,
              redirect_uri: data.redirect_uri,
            },
          });
        error = insertError;
      }

      if (error) {
        console.error("Erro ao salvar credenciais:", error);
        throw error;
      }

      console.log("Credenciais salvas com sucesso!");

      toast({
        title: "Credenciais salvas com sucesso!",
        description: "Agora você pode prosseguir com a autenticação.",
      });
    } catch (error) {
      console.error("Erro ao salvar credenciais:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar credenciais",
        description: "Ocorreu um erro ao tentar salvar suas credenciais. Tente novamente.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <CredentialsFormFields form={form} />
        <Button type="submit">Salvar Credenciais</Button>
      </form>
    </Form>
  );
};