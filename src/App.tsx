import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom"; // Removed Routes, Route, Navigate for minimal test
import { AppContextProvider } from "./context/AppContext";
// Removed all page and layout imports for minimal test

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppContextProvider>
      <BrowserRouter>
        {/* Minimal content to test BrowserRouter rendering */}
        <div className="p-4 text-center text-2xl font-bold text-blue-600">
          Hello from Dyad App!
        </div>
      </BrowserRouter>
    </AppContextProvider>
    <Toaster />
    <Sonner />
  </QueryClientProvider>
);

export default App;