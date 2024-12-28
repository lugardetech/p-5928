import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "@/pages/Index";
import Analytics from "@/pages/Analytics";
import Notifications from "@/pages/Notifications";
import Settings from "@/pages/Settings";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";
import TinyErp from "@/pages/TinyErp";
import TinyErpCallback from "@/pages/TinyErpCallback";
import Sidebar from "@/components/Sidebar";

// Módulos
import SalesPage from "@/modules/sales/pages/SalesPage";
import PurchasesPage from "@/modules/purchases/pages/PurchasesPage";
import SupportPage from "@/modules/support/pages/SupportPage";
import ReturnsPage from "@/modules/returns/pages/ReturnsPage";
import ProductsPage from "@/modules/products/pages/ProductsPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-64 p-8">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/integration/tiny-erp" element={<TinyErp />} />
              <Route path="/integration/tiny-erp/callback" element={<TinyErpCallback />} />
              
              {/* Rotas dos módulos */}
              <Route path="/sales" element={<SalesPage />} />
              <Route path="/purchases" element={<PurchasesPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/returns" element={<ReturnsPage />} />
              <Route path="/products" element={<ProductsPage />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;