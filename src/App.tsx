
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import InventoryPage from "./pages/InventoryPage";
import FinancePage from "./pages/FinancePage";
import StatsPage from "./pages/StatsPage";
import NotFound from "./pages/NotFound";
import HelpPage from "./pages/HelpPage";
import EmployeesPage from "./pages/EmployeesPage";
import MessagesPage from "./pages/MessagesPage";
import AccountPage from "./pages/AccountPage";
import SettingsPage from "./pages/SettingsPage";
import AuthPage from "./pages/AuthPage";
import { useEffect } from "react";
import { CRMProvider } from "./contexts/CRMContext";
import { StatisticsProvider } from "./contexts/StatisticsContext";
import { AppSettingsProvider } from "./contexts/AppSettingsContext";
import { AuthProvider } from "./contexts/AuthContext";
import { trackPageView } from "./utils/analytics";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AuthRoute from "./components/layout/AuthRoute";

// Define routes configuration with redirects and authentication
const routes = [
  { 
    path: "/", 
    element: (
      <ProtectedRoute>
        <Index />
      </ProtectedRoute>
    ) 
  },
  { 
    path: "/inventaire", 
    element: (
      <ProtectedRoute>
        <InventoryPage />
      </ProtectedRoute>
    ) 
  },
  { 
    path: "/finances", 
    element: (
      <ProtectedRoute>
        <FinancePage />
      </ProtectedRoute>
    ) 
  },
  { 
    path: "/statistiques", 
    element: (
      <ProtectedRoute>
        <StatisticsProvider>
          <StatsPage />
        </StatisticsProvider>
      </ProtectedRoute>
    ) 
  },
  { 
    path: "/employes", 
    element: (
      <ProtectedRoute>
        <EmployeesPage />
      </ProtectedRoute>
    ) 
  },
  { 
    path: "/messages", 
    element: (
      <ProtectedRoute>
        <MessagesPage />
      </ProtectedRoute>
    ) 
  },
  { 
    path: "/aide", 
    element: (
      <ProtectedRoute>
        <HelpPage />
      </ProtectedRoute>
    ) 
  },
  { 
    path: "/parametres", 
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ) 
  },
  { 
    path: "/compte", 
    element: (
      <ProtectedRoute>
        <AccountPage />
      </ProtectedRoute>
    ) 
  },
  { 
    path: "/auth", 
    element: (
      <AuthRoute>
        <AuthPage />
      </AuthRoute>
    ) 
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
const RouterChangeHandler = () => {
  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
    
    // Track page view for analytics
    const currentPath = window.location.pathname;
    const pageName = currentPath === '/' ? 'dashboard' : currentPath.replace(/^\//, '');
    trackPageView(pageName);
  }, [location.pathname]);
  
  return null;
};

// Application main component with properly nested providers
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppSettingsProvider>
        <AuthProvider>
          <CRMProvider>
            <BrowserRouter>
              <TooltipProvider>
                <RouterChangeHandler />
                <Routes>
                  {routes.map((route) => (
                    <Route 
                      key={route.path} 
                      path={route.path} 
                      element={route.element} 
                    />
                  ))}
                </Routes>
              </TooltipProvider>
            </BrowserRouter>
          </CRMProvider>
        </AuthProvider>
      </AppSettingsProvider>
    </QueryClientProvider>
  );
};

export default App;
