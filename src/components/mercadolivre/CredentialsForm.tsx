import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const credentialsSchema = z.object({
  client_id: z.string().min(1, "Client ID é obrigatório"),
  client_secret: z.string().min(1, "Client Secret é obrigatório"),
  redirect_uri: z.string().url("URL de redirecionamento inválida").min(1, "URL de redirecionamento é obrigatória"),
});

type CredentialsForm = z.infer<typeof credentialsSchema>;

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
      if (existingIntegration) {
        const { error: updateError } = await supabase
          .from("user_integrations")
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
        const { error: insertError } = await supabase
          .from("user_integrations")
          .insert({
            integration_id: integration.id,
            user_id: userId,
            settings: {
              client_id: data.client_id,
              client_secret: data.client_secret,
              redirect_uri: data.redirect_uri,
            },
          });
        error = insertError;
      }

      if (error) throw error;

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
        <FormField
          control={form.control}
          name="client_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client ID</FormLabel>
              <FormControl>
                <Input placeholder="Insira seu Client ID" {...field} />
              </FormControl>
              <FormDescription>
                O Client ID fornecido pelo Mercado Livre
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="client_secret"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Secret</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Insira seu Client Secret" {...field} />
              </FormControl>
              <FormDescription>
                O Client Secret fornecido pelo Mercado Livre
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="redirect_uri"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de Redirecionamento</FormLabel>
              <FormControl>
                <Input placeholder="URL de redirecionamento" {...field} />
              </FormControl>
              <FormDescription>
                URL para onde o Mercado Livre redirecionará após a autenticação
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Salvar Credenciais</Button>
      </form>
    </Form>
  );
};