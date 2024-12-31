import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ArrowLeftRight,
  Settings,
  Bell,
  BarChart3,
  Store,
  Building2,
  UserCircle,
  RotateCcw,
  HeadphonesIcon,
  AlertCircle,
} from "lucide-react";

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 min-h-screen border-r">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-sm font-semibold tracking-tight">Painel</h2>
          <div className="space-y-1">
            <Button
              variant={location.pathname === "/" ? "secondary" : "ghost"}
              className="w-full justify-start"
              size="sm"
              asChild
            >
              <Link to="/">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button
              variant={location.pathname === "/profile" ? "secondary" : "ghost"}
              className="w-full justify-start"
              size="sm"
              asChild
            >
              <Link to="/profile">
                <UserCircle className="mr-2 h-4 w-4" />
                Meu Perfil
              </Link>
            </Button>
            <Button
              variant={location.pathname === "/company" ? "secondary" : "ghost"}
              className="w-full justify-start"
              size="sm"
              asChild
            >
              <Link to="/company">
                <Building2 className="mr-2 h-4 w-4" />
                Empresa
              </Link>
            </Button>
            <Button
              variant={location.pathname === "/products" ? "secondary" : "ghost"}
              className="w-full justify-start"
              size="sm"
              asChild
            >
              <Link to="/products">
                <Package className="mr-2 h-4 w-4" />
                Produtos
              </Link>
            </Button>
            <Button
              variant={location.pathname === "/sales" ? "secondary" : "ghost"}
              className="w-full justify-start"
              size="sm"
              asChild
            >
              <Link to="/sales">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Vendas
              </Link>
            </Button>
            <Button
              variant={location.pathname === "/purchases" ? "secondary" : "ghost"}
              className="w-full justify-start"
              size="sm"
              asChild
            >
              <Link to="/purchases">
                <ArrowLeftRight className="mr-2 h-4 w-4" />
                Compras
              </Link>
            </Button>
            <Button
              variant={location.pathname === "/returns" ? "secondary" : "ghost"}
              className="w-full justify-start"
              size="sm"
              asChild
            >
              <Link to="/returns">
                <RotateCcw className="mr-2 h-4 w-4" />
                Devoluções
              </Link>
            </Button>
            <Button
              variant={location.pathname === "/support" ? "secondary" : "ghost"}
              className="w-full justify-start"
              size="sm"
              asChild
            >
              <Link to="/support">
                <HeadphonesIcon className="mr-2 h-4 w-4" />
                Suporte
              </Link>
            </Button>
          </div>
        </div>

        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-sm font-semibold tracking-tight">Gestão</h2>
          <div className="space-y-1">
            <Button
              variant={location.pathname === "/settings" ? "secondary" : "ghost"}
              className="w-full justify-start"
              size="sm"
              asChild
            >
              <Link to="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </Link>
            </Button>
            <Button
              variant={location.pathname === "/notifications" ? "secondary" : "ghost"}
              className="w-full justify-start"
              size="sm"
              asChild
            >
              <Link to="/notifications">
                <Bell className="mr-2 h-4 w-4" />
                Notificações
              </Link>
            </Button>
            <Button
              variant={location.pathname === "/analytics" ? "secondary" : "ghost"}
              className="w-full justify-start"
              size="sm"
              asChild
            >
              <Link to="/analytics">
                <BarChart3 className="mr-2 h-4 w-4" />
                Análises
              </Link>
            </Button>
          </div>
        </div>

        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-sm font-semibold tracking-tight">Integrações</h2>
          <div className="space-y-1">
            <Button
              variant={location.pathname === "/integration/tiny-erp" ? "secondary" : "ghost"}
              className="w-full justify-start"
              size="sm"
              asChild
            >
              <Link to="/integration/tiny-erp">
                <Store className="mr-2 h-4 w-4" />
                Tiny ERP
              </Link>
            </Button>
            <Button
              variant={location.pathname === "/integration/tiny-erp/products" ? "secondary" : "ghost"}
              className="w-full pl-8 justify-start"
              size="sm"
              asChild
            >
              <Link to="/integration/tiny-erp/products">
                <Package className="mr-2 h-4 w-4" />
                Produtos
              </Link>
            </Button>
            <Button
              variant={location.pathname === "/integration/mercado-livre" ? "secondary" : "ghost"}
              className="w-full justify-start"
              size="sm"
              asChild
            >
              <Link to="/integration/mercado-livre">
                <Store className="mr-2 h-4 w-4" />
                Mercado Livre
              </Link>
            </Button>
            <Button
              variant={location.pathname === "/integration/mercado-livre/claims" ? "secondary" : "ghost"}
              className="w-full pl-8 justify-start"
              size="sm"
              asChild
            >
              <Link to="/integration/mercado-livre/claims">
                <AlertCircle className="mr-2 h-4 w-4" />
                Reclamações
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}