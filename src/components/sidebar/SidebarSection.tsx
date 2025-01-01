import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
}

export function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <div className="px-3 py-2">
      <h2 className="mb-2 px-4 text-sm font-semibold tracking-tight">{title}</h2>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}

interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isSubmenuItem?: boolean;
  currentPath: string;
}

export function SidebarItem({ to, icon: Icon, children, isSubmenuItem = false, currentPath }: SidebarItemProps) {
  return (
    <Button
      variant={currentPath === to ? "secondary" : "ghost"}
      className={cn("w-full justify-start", isSubmenuItem && "pl-8")}
      size="sm"
      asChild
    >
      <Link to={to}>
        <Icon className="mr-2 h-4 w-4" />
        {children}
      </Link>
    </Button>
  );
}