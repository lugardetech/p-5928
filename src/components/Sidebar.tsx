import { Home, PieChart, Settings, User, CreditCard, Bell, Grid, Building, ShoppingCart, ShoppingBag, HeadphonesIcon, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: PieChart, label: "Analytics", path: "/analytics" },
  { icon: ShoppingCart, label: "Vendas", path: "/sales" },
  { icon: ShoppingBag, label: "Compras", path: "/purchases" },
  { icon: HeadphonesIcon, label: "Atendimento", path: "/support" },
  { icon: RotateCcw, label: "Devoluções", path: "/returns" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
  {
    icon: Grid,
    label: "Integração",
    path: "/integration",
    submenu: [
      { icon: Building, label: "Tiny ERP", path: "/integration/tiny-erp" },
    ],
  },
  { icon: User, label: "Profile", path: "/profile" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="fixed left-0 top-0 h-full w-64 glass-card border-r border-white/10">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-primary">Finance</h2>
        </div>
        
        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              
              return (
                <li key={item.path}>
                  {hasSubmenu ? (
                    <div>
                      <div
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                          "text-secondary"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </div>
                      <ul className="ml-6 mt-2 space-y-2">
                        {item.submenu.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const isSubActive = location.pathname === subItem.path;
                          
                          return (
                            <li key={subItem.path}>
                              <Link
                                to={subItem.path}
                                className={cn(
                                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                                  "hover:bg-white/10",
                                  isSubActive ? "bg-white/10" : "text-secondary"
                                )}
                              >
                                <SubIcon className="h-5 w-5" />
                                <span>{subItem.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                        "hover:bg-white/10",
                        isActive ? "bg-white/10" : "text-secondary"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 mt-auto">
          <div className="flex items-center gap-3 px-4 py-3">
            <User className="h-8 w-8 rounded-full bg-accent p-1" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">John Doe</span>
              <span className="text-xs text-secondary">Premium User</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;