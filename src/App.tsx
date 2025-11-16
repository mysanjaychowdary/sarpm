import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import CampaignsPage from "./pages/CampaignsPage";
import PanelManagementPage from "./pages/pages/PanelManagementPage";
import PanelUserManagementPage from "./pages/PanelUserManagementPage";
import CampaignDetailsPage from "./pages/CampaignDetailsPage";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContextProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/campaigns" element={<CampaignsPage />} />
              <Route path="/campaigns/:id" element={<CampaignDetailsPage />} />
              <Route path="/settings/panels" element={<PanelManagementPage />} />
              <Route path="/settings/panel-users" element={<PanelUserManagementPage />} />
              {/* Catch-all for 404 */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AppContextProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;