import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const profileFormSchema = z.object({
  first_name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  last_name: z.string().min(2, {
    message: "Sobrenome deve ter pelo menos 2 caracteres.",
  }),
  phone: z.string().min(10, {
    message: "Telefone deve ter pelo menos 10 dígitos.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
    },
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setInitialLoading(false);
          return;
        }

        console.log("Carregando dados do perfil para usuário:", user.id);

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Erro ao carregar perfil:", error);
          toast({
            variant: "destructive",
            title: "Erro",
            description: "Não foi possível carregar os dados do perfil.",
          });
          return;
        }

        if (profile) {
          form.reset({
            first_name: profile.first_name || "",
            last_name: profile.last_name || "",
            phone: profile.phone || "",
          });
        }
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar os dados do perfil.",
        });
      } finally {
        setInitialLoading(false);
      }
    }

    loadProfile();
  }, [form, toast]);

  async function onSubmit(data: ProfileFormValues) {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o perfil.",
      });
    } finally {
      setLoading(false);
    }
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sobrenome</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu sobrenome" {...field} />
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
                <Input placeholder="Digite seu telefone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Salvar alterações
        </Button>
      </form>
    </Form>
  );
}