import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/Sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

// Pages
import LoginPage from "@/modules/auth/pages/LoginPage";
import DashboardPage from "@/modules/dashboard/pages/DashboardPage";
import ProductsPage from "@/modules/products/pages/ProductsPage";
import SalesPage from "@/modules/sales/pages/SalesPage";
import PurchasesPage from "@/modules/purchases/pages/PurchasesPage";
import ReturnsPage from "@/modules/returns/pages/ReturnsPage";
import SupportPage from "@/modules/support/pages/SupportPage";
import SettingsPage from "@/modules/settings/pages/SettingsPage";
import NotificationsPage from "@/modules/notifications/pages/NotificationsPage";
import AnalyticsPage from "@/modules/analytics/pages/AnalyticsPage";
import ProfilePage from "@/modules/profile/pages/ProfilePage";
import TransactionsPage from "@/modules/transactions/pages/TransactionsPage";
import TinyErpPage from "@/modules/tiny-erp/pages/TinyErpPage";
import TinyErpCallbackPage from "@/modules/tiny-erp/pages/TinyErpCallbackPage";
import MercadoLivrePage from "@/modules/mercadolivre/pages/MercadoLivrePage";
import MercadoLivreCallbackPage from "@/modules/mercadolivre/pages/MercadoLivreCallbackPage";
import MercadoLivreClaimsPage from "@/modules/mercadolivre/pages/ClaimsPage";

import "./App.css";

const queryClient = new QueryClient();

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {!user ? (
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        ) : (
          <div className="border-t">
            <div className="bg-background">
              <div className="grid lg:grid-cols-5">
                <Sidebar />
                <div className="col-span-3 lg:col-span-4 lg:border-l">
                  <div className="px-4 py-6 lg:px-8">
                    <Routes>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/products" element={<ProductsPage />} />
                      <Route path="/sales" element={<SalesPage />} />
                      <Route path="/purchases" element={<PurchasesPage />} />
                      <Route path="/returns" element={<ReturnsPage />} />
                      <Route path="/support" element={<SupportPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="/notifications" element={<NotificationsPage />} />
                      <Route path="/analytics" element={<AnalyticsPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/transactions" element={<TransactionsPage />} />
                      <Route path="/integration/tiny-erp" element={<TinyErpPage />} />
                      <Route path="/integration/tiny-erp/callback" element={<TinyErpCallbackPage />} />
                      <Route path="/integration/mercado-livre" element={<MercadoLivrePage />} />
                      <Route path="/integration/mercado-livre/callback" element={<MercadoLivreCallbackPage />} />
                      <Route path="/integration/mercado-livre/claims" element={<MercadoLivreClaimsPage />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;