import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/Sidebar";
import DashboardPage from "@/modules/dashboard/pages/DashboardPage";
import ProfilePage from "@/modules/profile/pages/ProfilePage";
import CompanyPage from "@/modules/company/pages/CompanyPage";
import ProductsPage from "@/modules/products/pages/ProductsPage";
import SalesPage from "@/modules/sales/pages/SalesPage";
import PurchasesPage from "@/modules/purchases/pages/PurchasesPage";
import ReturnsPage from "@/modules/returns/pages/ReturnsPage";
import SupportPage from "@/modules/support/pages/SupportPage";
import SettingsPage from "@/modules/settings/pages/SettingsPage";
import NotificationsPage from "@/modules/notifications/pages/NotificationsPage";
import AnalyticsPage from "@/modules/analytics/pages/AnalyticsPage";
import TinyErpPage from "@/modules/tiny-erp/pages/TinyErpPage";
import TinyProductsPage from "@/modules/tiny-erp/pages/TinyProductsPage";
import MercadoLivrePage from "@/modules/mercadolivre/pages/MercadoLivrePage";
import MercadoLivreClaimsPage from "@/modules/mercadolivre/pages/ClaimsPage";
import MercadoLivreCallbackPage from "@/modules/mercadolivre/pages/MercadoLivreCallbackPage";
import TinyErpCallbackPage from "@/modules/tiny-erp/pages/TinyErpCallbackPage";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/company" element={<CompanyPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/purchases" element={<PurchasesPage />} />
            <Route path="/returns" element={<ReturnsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/integration/tiny-erp" element={<TinyErpPage />} />
            <Route path="/integration/tiny-erp/products" element={<TinyProductsPage />} />
            <Route path="/integration/tiny-erp/callback" element={<TinyErpCallbackPage />} />
            <Route path="/integration/mercado-livre" element={<MercadoLivrePage />} />
            <Route path="/integration/mercado-livre/claims" element={<MercadoLivreClaimsPage />} />
            <Route path="/integration/mercado-livre/callback" element={<MercadoLivreCallbackPage />} />
          </Routes>
        </main>
      </div>
      <Toaster />
    </Router>
  );
}

export default App;