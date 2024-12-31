import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { CredentialsFormFields, credentialsSchema, type CredentialsForm } from "./forms/CredentialsFormFields";

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

  const { data: integration } = useQuery({
    queryKey: ["mercadolivre-integration"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("integrations")
          .select("id")
          .eq("name", "mercado_livre")
          .maybeSingle();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Erro ao buscar integração:", error);
        throw error;
      }
    },
  });

  const form = useForm<CredentialsForm>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      client_id: "",
      client_secret: "",
      redirect_uri: window.location.origin + "/integration/mercado-livre/callback",
    },
  });

  const onSubmit = async (data: CredentialsForm) => {
    try {
      if (!integration?.id) {
        throw new Error("Integração não encontrada");
      }

      if (!userId) {
        throw new Error("Usuário não autenticado");
      }

      const { data: existingIntegration, error: fetchError } = await supabase
        .from("user_integrations")
        .select("id")
        .eq("user_id", userId)
        .eq("integration_id", integration.id)
        .maybeSingle();

      if (fetchError && fetchError.code !== "PGRST116") {
        throw fetchError;
      }

      let error;
      let savedData;
      
      if (existingIntegration) {
        const { error: updateError, data: updated } = await supabase
          .from("user_integrations")
          .update({
            settings: {
              client_id: data.client_id,
              client_secret: data.client_secret,
              redirect_uri: data.redirect_uri,
            },
          })
          .eq("id", existingIntegration.id)
          .select()
          .single();
        error = updateError;
        savedData = updated;
      } else {
        const { error: insertError, data: inserted } = await supabase
          .from("user_integrations")
          .insert({
            integration_id: integration.id,
            user_id: userId,
            settings: {
              client_id: data.client_id,
              client_secret: data.client_secret,
              redirect_uri: data.redirect_uri,
            },
          })
          .select()
          .single();
        error = insertError;
        savedData = inserted;
      }

      if (error) throw error;

      // Enviar dados para o webhook através da Edge Function
      const { data: webhookResponse, error: webhookError } = await supabase.functions.invoke(
        'mercadolivre-webhook',
        {
          body: savedData
        }
      );

      if (webhookError) {
        console.error('Erro ao enviar dados para webhook:', webhookError);
      } else {
        console.log('Dados enviados com sucesso para webhook');
      }

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