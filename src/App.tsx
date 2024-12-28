import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/Sidebar";
import Index from "@/pages/Index";
import Products from "@/modules/products/pages/ProductsPage";
import Sales from "@/modules/sales/pages/SalesPage";
import Purchases from "@/modules/purchases/pages/PurchasesPage";
import Returns from "@/modules/returns/pages/ReturnsPage";
import Support from "@/modules/support/pages/SupportPage";
import Settings from "@/pages/Settings";
import Notifications from "@/pages/Notifications";
import Analytics from "@/pages/Analytics";
import Profile from "@/pages/Profile";
import Transactions from "@/pages/Transactions";
import TinyErp from "@/pages/TinyErp";
import TinyErpCallback from "@/pages/TinyErpCallback";
import MercadoLivre from "@/pages/MercadoLivre";
import MercadoLivreCallback from "@/pages/MercadoLivreCallback";
import Login from "@/pages/Login";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

import "./App.css";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escutar mudanças na autenticação
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
    <Router>
      {!user ? (
        <Routes>
          <Route path="/login" element={<Login />} />
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
                    <Route path="/" element={<Index />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/sales" element={<Sales />} />
                    <Route path="/purchases" element={<Purchases />} />
                    <Route path="/returns" element={<Returns />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/integration/tiny-erp" element={<TinyErp />} />
                    <Route path="/integration/tiny-erp/callback" element={<TinyErpCallback />} />
                    <Route path="/integration/mercado-livre" element={<MercadoLivre />} />
                    <Route path="/integration/mercado-livre/callback" element={<MercadoLivreCallback />} />
                  </Routes>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Toaster />
    </Router>
  );
}

export default App;