import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { CredentialsFormFields, credentialsSchema, type CredentialsForm as CredentialsFormType } from "./forms/CredentialsFormFields";

interface CredentialsFormProps {
  onSuccess?: () => void;
}

export const CredentialsForm = ({ onSuccess }: CredentialsFormProps) => {
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        console.log("ID do usuário atual:", user.id);
      }
    };
    getCurrentUser();
  }, []);

  const form = useForm<CredentialsFormType>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      client_id: "",
      client_secret: "",
      redirect_uri: window.location.origin + "/integration/tiny-erp/callback",
    },
  });

  const onSubmit = async (data: CredentialsFormType) => {
    try {
      if (!userId) {
        console.error("Usuário não autenticado");
        throw new Error("Usuário não autenticado");
      }

      console.log("Iniciando salvamento de credenciais para usuário:", userId);
      console.log("Dados a serem salvos:", data);

      // Verificar se já existe uma integração
      const { data: existingIntegration, error: fetchError } = await supabase
        .from("integrations")
        .select("*")
        .eq("user_id", userId)
        .eq("name", "tiny_erp")
        .maybeSingle();

      console.log("Resultado da busca por integração existente:", { existingIntegration, fetchError });

      if (fetchError) {
        console.error("Erro ao buscar integração:", fetchError);
        if (fetchError.code !== "PGRST116") {
          throw fetchError;
        }
      }

      const integrationData = {
        settings: {
          client_id: data.client_id,
          client_secret: data.client_secret,
          redirect_uri: data.redirect_uri,
        },
        name: "tiny_erp",
        description: "Integração com o Tiny ERP para gerenciamento de produtos e pedidos",
        user_id: userId,
      };

      let result;
      
      if (existingIntegration) {
        console.log("Atualizando integração existente:", existingIntegration.id);
        result = await supabase
          .from("integrations")
          .update(integrationData)
          .eq("id", existingIntegration.id)
          .select()
          .single();
      } else {
        console.log("Criando nova integração");
        result = await supabase
          .from("integrations")
          .insert(integrationData)
          .select()
          .single();
      }

      console.log("Resultado da operação:", result);

      if (result.error) {
        console.error("Erro ao salvar credenciais:", result.error);
        throw result.error;
      }

      console.log("Credenciais salvas com sucesso!", result.data);

      toast({
        title: "Credenciais salvas com sucesso!",
        description: "Agora você pode prosseguir com a autenticação.",
      });

      onSuccess?.();
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