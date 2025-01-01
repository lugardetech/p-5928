import { Store, Package, AlertCircle } from "lucide-react";
import { SidebarSection, SidebarItem } from "./SidebarSection";
import { useLocation } from "react-router-dom";

export function IntegrationsNavigation() {
  const location = useLocation();

  return (
    <SidebarSection title="Integrações">
      <SidebarItem to="/integration/tiny-erp" icon={Store} currentPath={location.pathname}>
        Tiny ERP
      </SidebarItem>
      <SidebarItem 
        to="/integration/tiny-erp/products" 
        icon={Package} 
        currentPath={location.pathname}
        isSubmenuItem
      >
        Produtos
      </SidebarItem>
      <SidebarItem 
        to="/integration/tiny-erp/orders" 
        icon={ShoppingCart} 
        currentPath={location.pathname}
        isSubmenuItem
      >
        Pedidos
      </SidebarItem>
      <SidebarItem to="/integration/mercado-livre" icon={Store} currentPath={location.pathname}>
        Mercado Livre
      </SidebarItem>
      <SidebarItem 
        to="/integration/mercado-livre/claims" 
        icon={AlertCircle} 
        currentPath={location.pathname}
        isSubmenuItem
      >
        Reclamações
      </SidebarItem>
    </SidebarSection>
  );
}