// Configuration file for the admin application
const getBackendUrl = () => {
  // Check if we're in development or production
  if (import.meta.env.DEV) {
    // In development, use the current hostname with port 4000
    const protocol = window.location.protocol; // http: or https:
    const hostname = window.location.hostname; // localhost or 192.168.1.100
    return `${protocol}//${hostname}:4000`;
  } else {
    // In production, use environment variable or fallback to same origin
    return import.meta.env.VITE_BACKEND_URL || window.location.origin;
  }
};
  
export const config = {
  // Backend API URL
  backendUrl: getBackendUrl(),
  
  // Currency symbol
  currency: '₹',
  
  // Delivery fee
  delivery_fee: 40
};
  
// Export individual values for convenience
export const { backendUrl, currency, delivery_fee } = config;
  