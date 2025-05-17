
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import InventoryPage from "./pages/InventoryPage";
import FinancePage from "./pages/FinancePage";
import NotFound from "./pages/NotFound";
import HelpPage from "./pages/HelpPage";
import AccountPage from "./pages/AccountPage";
import BillingPage from "./pages/BillingPage";
import EmployeesPage from "./pages/EmployeesPage";
import SettingsPage from "./pages/SettingsPage";
import AuthPage from "./pages/AuthPage";
import { useEffect } from "react";
import { CRMProvider } from "./contexts/CRMContext";
import { AppSettingsProvider } from "./contexts/AppSettingsContext";
import { AuthProvider } from "./contexts/AuthContext";
import { trackPageView } from "./utils/analytics";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { Toaster } from "./components/ui/toaster";

// Define routes configuration with redirects and authentication
const routes = [
  { 
    path: "/", 
    element: <ProtectedRoute><Index /></ProtectedRoute>
  },
  { 
    path: "/inventaire", 
    element: <ProtectedRoute><InventoryPage /></ProtectedRoute>
  },
  { 
    path: "/finances", 
    element: <ProtectedRoute><FinancePage /></ProtectedRoute>
  },
  { 
    path: "/employes", 
    element: <ProtectedRoute><EmployeesPage /></ProtectedRoute>
  },
  { 
    path: "/parametres", 
    element: <ProtectedRoute><SettingsPage /></ProtectedRoute>
  },
  { 
    path: "/aide", 
    element: <ProtectedRoute><HelpPage /></ProtectedRoute>
  },
  { 
    path: "/compte", 
    element: <ProtectedRoute><AccountPage /></ProtectedRoute>
  },
  { 
    path: "/facturation", 
    element: <ProtectedRoute><BillingPage /></ProtectedRoute>
  },
  { 
    path: "/auth", 
    element: <AuthPage />
  },
  { path: "*", element: <NotFound /> }
];

// Create query client with enhanced configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Router change handler component
const RouterChangeHandler = ({ children }) => {
  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
    
    // Track page view for analytics
    const currentPath = window.location.pathname;
    const pageName = currentPath === '/' ? 'dashboard' : currentPath.replace(/^\//, '');
    trackPageView(pageName);
  }, [window.location.pathname]);
  
  return children;
};

// Application main component with properly nested providers
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RouterChangeHandler>
          <AppSettingsProvider>
            <AuthProvider>
              <CRMProvider>
                <TooltipProvider>
                  <Routes>
                    {routes.map((route) => (
                      <Route 
                        key={route.path} 
                        path={route.path} 
                        element={route.element} 
                      />
                    ))}
                  </Routes>
                  <Toaster />
                </TooltipProvider>
              </CRMProvider>
            </AuthProvider>
          </AppSettingsProvider>
        </RouterChangeHandler>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
