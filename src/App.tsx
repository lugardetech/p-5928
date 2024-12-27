import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import TinyErp from "@/pages/TinyErp";
import TinyErpCallback from "@/pages/TinyErpCallback";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/integration/tiny-erp" element={<TinyErp />} />
          <Route path="/integration/tiny-erp/callback" element={<TinyErpCallback />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;