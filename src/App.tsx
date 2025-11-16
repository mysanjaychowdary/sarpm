import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext";
import { SessionContextProvider } from "./context/SessionContext"; // Import SessionContextProvider
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import CampaignsPage from "./pages/CampaignsPage";
import PanelManagementPage from "./pages/PanelManagementPage";
import PanelUserManagementPage from "./pages/PanelUserManagementPage";
import CampaignDetailsPage from "./pages/CampaignDetailsPage";
import EmployeeManagementPage from "./pages/EmployeeManagementPage";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Login from "./pages/Login"; // Import Login page
import ProtectedRoute from "./components/auth/ProtectedRoute"; // Import ProtectedRoute

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SessionContextProvider> {/* Wrap with SessionContextProvider */}
          <AppContextProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<MainLayout />}> {/* MainLayout wraps protected routes */}
                <Route element={<ProtectedRoute />}> {/* All routes inside here are protected */}
                  <Route index element={<Index />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/campaigns" element={<CampaignsPage />} />
                  <Route path="/campaigns/:id" element={<CampaignDetailsPage />} />
                </Route>
                {/* Admin-only routes */}
                <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
                  <Route path="/settings/panels" element={<PanelManagementPage />} />
                  <Route path="/settings/panel-users" element={<PanelUserManagementPage />} />
                  <Route path="/settings/employees" element={<EmployeeManagementPage />} />
                </Route>
                {/* Catch-all for 404 */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </AppContextProvider>
        </SessionContextProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;