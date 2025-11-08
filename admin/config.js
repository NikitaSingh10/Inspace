// Configuration file for the frontend application
const getBackendUrl = () => {
    const protocol = window.location.protocol; // http: or https:
    const hostname = window.location.hostname; // localhost or 192.168.1.100
    return `${protocol}//${hostname}:4000`;
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
  