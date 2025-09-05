import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Layout } from "@/components/agri/Layout";
import { LanguageProvider } from "@/components/agri/Language";
import AddProject from "./pages/AddProject";
import Dashboard from "./pages/Dashboard";
import Support from "./pages/Support";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LanguageProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/add-project" element={<AddProject />} />
              <Route path="/dashboard" element={<Placeholder title="Dashboard" />} />
              <Route path="/market" element={<Placeholder title="Carbon Market" />} />
              <Route path="/support" element={<Placeholder title="Support & Help Center" />} />
              <Route path="/about" element={<Placeholder title="About Us" />} />
              <Route path="/contact" element={<Placeholder title="Contact" />} />
              <Route path="/privacy" element={<Placeholder title="Privacy Policy" />} />
              <Route path="/terms" element={<Placeholder title="Terms & Conditions" />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
