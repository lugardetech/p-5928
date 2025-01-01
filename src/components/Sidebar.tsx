import { LogOut } from "lucide-react";
import { MainNavigation } from "./sidebar/MainNavigation";
import { ManagementNavigation } from "./sidebar/ManagementNavigation";
import { IntegrationsNavigation } from "./sidebar/IntegrationsNavigation";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "./ui/use-toast";

export function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado do sistema"
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast({
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro ao tentar desconectar",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-64 min-h-screen border-r flex flex-col">
      <div className="flex-1 space-y-4 py-4">
        <MainNavigation />
        <ManagementNavigation />
        <IntegrationsNavigation />
      </div>
      <div className="p-4 border-t">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );
}