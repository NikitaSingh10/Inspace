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
    // In production, MUST use environment variable
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) {
      console.error('VITE_BACKEND_URL is not set! Please set it in Vercel environment variables.');
      throw new Error('Backend URL not configured. Please set VITE_BACKEND_URL environment variable.');
    }
    return backendUrl;
  }
};

export const backendUrl = getBackendUrl();
export const currency = "₹";
export const delivery_fee = 20;

// Stripe publishable key - should be set in environment variables
export const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';