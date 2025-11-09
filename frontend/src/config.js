// Configuration file for the frontend application

// Get the current hostname and protocol
const getBackendUrl = () => {
  // Check if we're in development or production
  if (import.meta.env.DEV) {
    // In development, use the current hostname with port 4000
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    // For localhost or IP address, use port 4000
    return `${protocol}//${hostname}:4000`;
  } else {
    // In production, use environment variable or fallback to same origin
    return import.meta.env.VITE_BACKEND_URL || window.location.origin;
  }
};

export const backendUrl = getBackendUrl();
export const currency = "₹";
export const delivery_fee = 20;

// Stripe publishable key - should be set in environment variables
export const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';