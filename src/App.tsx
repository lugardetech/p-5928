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
import TinyOrdersPage from "@/modules/tiny-erp/pages/TinyOrdersPage";
import MercadoLivrePage from "@/modules/mercadolivre/pages/MercadoLivrePage";
import MercadoLivreClaimsPage from "@/modules/mercadolivre/pages/ClaimsPage";
import MercadoLivreCallbackPage from "@/modules/mercadolivre/pages/MercadoLivreCallbackPage";
import TinyErpCallbackPage from "@/modules/tiny-erp/pages/TinyErpCallbackPage";
import LoginPage from "@/modules/auth/pages/LoginPage";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="flex">
        <ProtectedRoute>
          <Sidebar />
        </ProtectedRoute>
        <main className="flex-1">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/company" element={<ProtectedRoute><CompanyPage /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
            <Route path="/sales" element={<ProtectedRoute><SalesPage /></ProtectedRoute>} />
            <Route path="/purchases" element={<ProtectedRoute><PurchasesPage /></ProtectedRoute>} />
            <Route path="/returns" element={<ProtectedRoute><ReturnsPage /></ProtectedRoute>} />
            <Route path="/support" element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/integration/tiny-erp" element={<ProtectedRoute><TinyErpPage /></ProtectedRoute>} />
            <Route path="/integration/tiny-erp/products" element={<ProtectedRoute><TinyProductsPage /></ProtectedRoute>} />
            <Route path="/integration/tiny-erp/orders" element={<ProtectedRoute><TinyOrdersPage /></ProtectedRoute>} />
            <Route path="/integration/tiny-erp/callback" element={<ProtectedRoute><TinyErpCallbackPage /></ProtectedRoute>} />
            <Route path="/integration/mercado-livre" element={<ProtectedRoute><MercadoLivrePage /></ProtectedRoute>} />
            <Route path="/integration/mercado-livre/claims" element={<ProtectedRoute><MercadoLivreClaimsPage /></ProtectedRoute>} />
            <Route path="/integration/mercado-livre/callback" element={<ProtectedRoute><MercadoLivreCallbackPage /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
      <Toaster />
    </Router>
  );
}

export default App;