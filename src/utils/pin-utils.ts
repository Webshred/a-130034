
// Utility functions for PIN authentication

/**
 * Store a page's authentication timestamp
 */
export const markPageAuthenticated = (pageName: string): void => {
  const authenticated = JSON.parse(localStorage.getItem('pinAuthenticatedPages') || '{}');
  authenticated[pageName] = new Date().getTime();
  localStorage.setItem('pinAuthenticatedPages', JSON.stringify(authenticated));
};

/**
 * Check if a page is already authenticated within the time window
 */
export const isPageAuthenticated = (pageName: string): boolean => {
  const authenticated = JSON.parse(localStorage.getItem('pinAuthenticatedPages') || '{}');
  const lastAuth = authenticated[pageName];
  if (!lastAuth) return false;
  
  // Check if authentication is still valid (15 minutes)
  const now = new Date().getTime();
  return now - lastAuth < 15 * 60 * 1000; // 15 minutes
};

/**
 * Clear expired authentications from localStorage
 */
export const clearExpiredAuthentications = (): void => {
  const authenticatedPages = JSON.parse(localStorage.getItem('pinAuthenticatedPages') || '{}');
  const now = new Date().getTime();
  
  // Filter out expired authentications (15 minutes)
  const updatedAuthenticated = Object.keys(authenticatedPages).reduce((acc: Record<string, number>, page) => {
    if (now - authenticatedPages[page] < 15 * 60 * 1000) { // 15 minutes
      acc[page] = authenticatedPages[page];
    }
    return acc;
  }, {});
  
  localStorage.setItem('pinAuthenticatedPages', JSON.stringify(updatedAuthenticated));
};

// Define which paths require PIN protection
export const protectedPaths = [
  "/",  // Dashboard
  "/inventaire", // Inventory
  "/finances",   // Finances 
  "/aide",       // Help
  "/compte"      // Account
];
