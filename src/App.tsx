import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import CampaignsPage from "./pages/CampaignsPage"; // New import
import PanelManagementPage from "./pages/PanelManagementPage"; // New import
import PanelUserManagementPage from "./pages/PanelUserManagementPage"; // New import
import Panel3CredentialManagementPage from "./pages/Panel3CredentialManagementPage"; // New import
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContextProvider>
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/campaigns" element={<CampaignsPage />} /> {/* New route */}
              <Route path="/settings/panels" element={<PanelManagementPage />} /> {/* New route */}
              <Route path="/settings/panel-users" element={<PanelUserManagementPage />} /> {/* New route */}
              <Route path="/settings/panel3-credentials" element={<Panel3CredentialManagementPage />} /> {/* New route */}
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </AppContextProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;