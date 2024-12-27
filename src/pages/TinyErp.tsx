import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

const TinyErp = () => {
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  // Buscar integração do Tiny ERP
  const { data: integration } = useQuery({
    queryKey: ["tiny-integration"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("integrations")
        .select("id")
        .eq("name", "tiny_erp")
        .single();

      if (error) throw error;
      return data;
    },
  });

  const form = useForm<CredentialsForm>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      client_id: "",
      client_secret: "",
      redirect_uri: window.location.origin + "/integration/tiny-erp/callback",
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

      // Primeiro, verificar se já existe uma integração para este usuário
      const { data: existingIntegration, error: fetchError } = await supabase
        .from("user_integrations")
        .select("id")
        .eq("user_id", userId)
        .eq("integration_id", integration.id)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") { // PGRST116 é o código para "não encontrado"
        throw fetchError;
      }

      let error;
      if (existingIntegration) {
        // Se existir, atualizar
        ({ error } = await supabase
          .from("user_integrations")
          .update({
            settings: {
              client_id: data.client_id,
              client_secret: data.client_secret,
              redirect_uri: data.redirect_uri,
            },
          })
          .eq("id", existingIntegration.id));
      } else {
        // Se não existir, criar novo
        ({ error } = await supabase
          .from("user_integrations")
          .insert({
            integration_id: integration.id,
            user_id: userId,
            settings: {
              client_id: data.client_id,
              client_secret: data.client_secret,
              redirect_uri: data.redirect_uri,
            },
          }));
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
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-primary">Integração Tiny ERP</h1>
        <p className="text-secondary-foreground">Gerencie sua integração com o Tiny ERP</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Configurar Credenciais</CardTitle>
          <CardDescription>
            Insira as credenciais do seu aplicativo Tiny ERP para começar a integração.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                      O Client ID fornecido pelo Tiny ERP
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
                      O Client Secret fornecido pelo Tiny ERP
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
                      URL para onde o Tiny ERP redirecionará após a autenticação
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Salvar Credenciais</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TinyErp;