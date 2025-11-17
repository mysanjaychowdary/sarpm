import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext";
import { SessionContextProvider } from "./context/SessionContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute"; // Import AdminRoute
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import CampaignsPage from "./pages/CampaignsPage";
import PanelManagementPage from "./pages/PanelManagementPage";
import PanelUserManagementPage from "./pages/PanelUserManagementPage";
import CampaignDetailsPage from "./pages/CampaignDetailsPage";
import TeamMemberManagementPage from "./pages/TeamMemberManagementPage";
import SmsApiSettingsPage from "./pages/SmsApiSettingsPage"; // New: Import SmsApiSettingsPage
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Login from "./pages/Login";
import { ThemeProvider } from "./components/layout/ThemeProvider"; // Import ThemeProvider

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme"> {/* Add ThemeProvider here */}
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SessionContextProvider>
            <AppContextProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<Index />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/campaigns" element={<CampaignsPage />} />
                    <Route path="/campaigns/:id" element={<CampaignDetailsPage />} />
                    {/* Admin-only routes */}
                    <Route element={<AdminRoute />}>
                      <Route path="/settings/panels" element={<PanelManagementPage />} />
                      <Route path="/settings/panel-users" element={<PanelUserManagementPage />} />
                      <Route path="/settings/team-members" element={<TeamMemberManagementPage />} />
                      <Route path="/settings/sms-api" element={<SmsApiSettingsPage />} /> {/* New: SMS API Settings route */}
                    </Route>
                    {/* Catch-all for 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Route>
              </Routes>
            </AppContextProvider>
          </SessionContextProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider> {/* Close ThemeProvider */}
  </QueryClientProvider>
);

export default App;