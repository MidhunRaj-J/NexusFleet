// Environment configuration with defaults
export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  },
  features: {
    chatSupport: import.meta.env.VITE_ENABLE_CHAT_SUPPORT !== 'false',
    payments: import.meta.env.VITE_ENABLE_PAYMENTS !== 'false',
    kyc: import.meta.env.VITE_ENABLE_KYC !== 'false',
  },
  pricing: {
    base: Number(import.meta.env.VITE_BASE_PRICE) || 72,
    weightMultiplier: Number(import.meta.env.VITE_WEIGHT_MULTIPLIER) || 22,
    distanceMultiplier: Number(import.meta.env.VITE_DISTANCE_MULTIPLIER) || 4.4,
    expressMultiplier: Number(import.meta.env.VITE_EXPRESS_MULTIPLIER) || 1.45,
    minPrice: Number(import.meta.env.VITE_MIN_BOOKING_PRICE) || 180,
  },
  validation: {
    minPasswordLength: Number(import.meta.env.VITE_MIN_PASSWORD_LENGTH) || 6,
    maxDistanceKm: Number(import.meta.env.VITE_MAX_DISTANCE_KM) || 500,
    maxWeightKg: Number(import.meta.env.VITE_MAX_WEIGHT_KG) || 100,
  },
  ui: {
    itemsPerPage: Number(import.meta.env.VITE_ITEMS_PER_PAGE) || 10,
    appName: import.meta.env.VITE_APP_NAME || 'NexusFleet',
  },
};
