import { LayoutDashboard, UserCircle, Building2, Package, ShoppingCart, ArrowLeftRight, RotateCcw, HeadphonesIcon } from "lucide-react";
import { SidebarSection, SidebarItem } from "./SidebarSection";
import { useLocation } from "react-router-dom";

export function MainNavigation() {
  const location = useLocation();

  return (
    <SidebarSection title="Painel">
      <SidebarItem to="/" icon={LayoutDashboard} currentPath={location.pathname}>
        Dashboard
      </SidebarItem>
      <SidebarItem to="/profile" icon={UserCircle} currentPath={location.pathname}>
        Meu Perfil
      </SidebarItem>
      <SidebarItem to="/company" icon={Building2} currentPath={location.pathname}>
        Empresa
      </SidebarItem>
      <SidebarItem to="/products" icon={Package} currentPath={location.pathname}>
        Produtos
      </SidebarItem>
      <SidebarItem to="/sales" icon={ShoppingCart} currentPath={location.pathname}>
        Vendas
      </SidebarItem>
      <SidebarItem to="/purchases" icon={ArrowLeftRight} currentPath={location.pathname}>
        Compras
      </SidebarItem>
      <SidebarItem to="/returns" icon={RotateCcw} currentPath={location.pathname}>
        Devoluções
      </SidebarItem>
      <SidebarItem to="/support" icon={HeadphonesIcon} currentPath={location.pathname}>
        Suporte
      </SidebarItem>
    </SidebarSection>
  );
}