import { Settings, Bell, BarChart3 } from "lucide-react";
import { SidebarSection, SidebarItem } from "./SidebarSection";
import { useLocation } from "react-router-dom";

export function ManagementNavigation() {
  const location = useLocation();

  return (
    <SidebarSection title="Gestão">
      <SidebarItem to="/settings" icon={Settings} currentPath={location.pathname}>
        Configurações
      </SidebarItem>
      <SidebarItem to="/notifications" icon={Bell} currentPath={location.pathname}>
        Notificações
      </SidebarItem>
      <SidebarItem to="/analytics" icon={BarChart3} currentPath={location.pathname}>
        Análises
      </SidebarItem>
    </SidebarSection>
  );
}