import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

import "./App.css";

function App() {
  return (
    <Router>
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
      <Toaster />
    </Router>
  );
}

export default App;