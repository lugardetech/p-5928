import { MainNavigation } from "./sidebar/MainNavigation";
import { ManagementNavigation } from "./sidebar/ManagementNavigation";
import { IntegrationsNavigation } from "./sidebar/IntegrationsNavigation";

export function Sidebar() {
  return (
    <div className="w-64 min-h-screen border-r">
      <div className="space-y-4 py-4">
        <MainNavigation />
        <ManagementNavigation />
        <IntegrationsNavigation />
      </div>
    </div>
  );
}