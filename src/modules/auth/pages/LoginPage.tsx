import { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Verificar se já está autenticado
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", !!session);
      if (session) {
        navigate("/");
      }
    });

    // Escutar mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, !!session);
      if (event === "SIGNED_IN" && session) {
        toast({
          title: "Login realizado com sucesso",
          description: "Você será redirecionado para o dashboard",
        });
        navigate("/");
      }
      if (event === "SIGNED_OUT") {
        toast({
          title: "Logout realizado com sucesso",
          description: "Você foi desconectado do sistema",
        });
      }
    });

    // Escutar erros de autenticação
    const { data: { subscription: errorSubscription } } = supabase.auth.onError((error) => {
      console.error("Auth error:", error);
      toast({
        variant: "destructive",
        title: "Erro ao realizar login",
        description: "Verifique suas credenciais e tente novamente",
      });
    });

    return () => {
      subscription.unsubscribe();
      errorSubscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md p-6">
        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#000000',
                  brandAccent: '#333333',
                }
              }
            }
          }}
          providers={["google"]}
          redirectTo={`${window.location.origin}/login`}
          magicLink={false}
          localization={{
            variables: {
              sign_in: {
                email_label: "Email",
                password_label: "Senha",
                button_label: "Entrar",
                loading_button_label: "Entrando...",
                social_provider_text: "Entrar com {{provider}}",
                link_text: "Já tem uma conta? Entre"
              },
              sign_up: {
                email_label: "Email",
                password_label: "Senha",
                button_label: "Criar conta",
                loading_button_label: "Criando conta...",
                social_provider_text: "Criar conta com {{provider}}",
                link_text: "Não tem uma conta? Cadastre-se"
              }
            }
          }}
        />
      </Card>
    </div>
  );
}