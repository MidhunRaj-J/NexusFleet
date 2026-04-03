const ITEM_KEYWORDS = ['document', 'food', 'fragile', 'electronics', 'clothing', 'medicine', 'cash'];

export const ITEM_CATEGORIES = ['documents', 'food', 'fragile', 'electronics', 'clothing', 'medicine', 'gifts'];
export const URGENCY_OPTIONS = ['normal', 'express'];
export const TIME_WINDOWS = ['same day', 'evening', '24 hours', 'flexible'];
export const ISSUE_TYPES = ['Late delivery', 'Damaged item', 'Fraud', 'Traveler cancellation', 'Customer cancellation'];
export const TRANSPORT_TYPES = ['Bike', 'Car', 'Train', 'Flight'];
export const LANGUAGE_OPTIONS = ['English', 'Hindi', 'Malayalam', 'Tamil'];
export const NOTIFICATION_CHANNELS = ['Push', 'SMS', 'Email'];
export const DEFAULT_ADDRESSES = [
  { id: 'ADDR-1', label: 'Home', address: '12 Green Avenue, Kochi', isDefault: true },
  { id: 'ADDR-2', label: 'Office', address: '18 Marina Road, Bengaluru', isDefault: false },
];
export const INITIAL_SESSION_DEVICES = [
  { id: 'DEV-1', name: 'Chrome on Windows', location: 'Kochi', lastSeen: 'Just now', suspicious: false },
  { id: 'DEV-2', name: 'Android Phone', location: 'Kochi', lastSeen: 'Today, 8:12 AM', suspicious: false },
];
export const INITIAL_TRANSACTIONS = [];
export const INITIAL_REVIEWS = [];
export const INITIAL_CHAT_MESSAGES = [
  { id: 'MSG-1', sender: 'System', text: 'Welcome to NexusFleet support chat.', time: 'Just now' },
];
export const INITIAL_TRAVELERS = [
  { id: 'TRV-1', name: 'Asha N', rating: 4.9, reliability: 96, distanceDeviation: 6, transportType: 'Car', capacity: 6, availability: true, verified: true },
  { id: 'TRV-2', name: 'Vikram R', rating: 4.8, reliability: 93, distanceDeviation: 9, transportType: 'Bike', capacity: 3, availability: true, verified: true },
  { id: 'TRV-3', name: 'Fathima K', rating: 4.7, reliability: 90, distanceDeviation: 11, transportType: 'Train', capacity: 12, availability: false, verified: true },
];

function cleanWords(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

export function calculateDynamicPrice(order) {
  const weight = Number(order.weight || 1);
  const distance = Number(order.distance || 1);
  const dimensionFactor = Number(order.length || 0) + Number(order.width || 0) + Number(order.height || 0) > 0 ? 1.15 : 1;
  const urgencyMultiplier = order.urgency === 'express' ? 1.45 : 1;
  const flexibleDiscount = order.timeWindow === 'flexible' ? 0.92 : 1;
  const manualBid = Number(order.manualBid || 0);
  const restrictedPenalty = order.restrictedFlag ? 1.25 : 1;
  const base = (72 + weight * 22 + distance * 4.4) * dimensionFactor * urgencyMultiplier * flexibleDiscount * restrictedPenalty;
  return Math.max(180, Math.round(base + manualBid));
}

export function detectRestrictedItems({ category, itemName }) {
  const combined = `${category || ''} ${itemName || ''}`.toLowerCase();
  const flagged = ITEM_KEYWORDS.some((keyword) => combined.includes(keyword)) && combined.includes('cash');
  const risky = /explosive|weapon|gun|drugs|cash|passport/.test(combined);

  if (risky) {
    return { allowed: false, reason: 'Restricted item detected. Manual review required.' };
  }

  if (flagged) {
    return { allowed: false, reason: 'High-risk item combination needs admin approval.' };
  }

  return { allowed: true, reason: 'Item classification looks valid.' };
}

export function calculateEta(order) {
  const distance = Number(order.distance || 0);
  const urgencyPenalty = order.urgency === 'express' ? -12 : 0;
  const flexibleBonus = order.timeWindow === 'flexible' ? 10 : 0;
  return Math.max(25, Math.round(distance * 4.1 + 18 + urgencyPenalty + flexibleBonus));
}

export function rankTravelers({ order, routes = [], travelerPool = INITIAL_TRAVELERS }) {
  const orderWords = cleanWords(`${order.pickup} ${order.drop} ${order.itemCategory}`);
  const orderCapacity = Number(order.capacity || 1);
  const orderTime = Number(String(order.flexibleWindow || '08:00').split(':')[0] || 8);

  return travelerPool
    .map((traveler) => {
      const route = routes.find((item) => cleanWords(`${item.source} ${item.destination}`).some((word) => orderWords.includes(word)));
      const routeOverlap = route ? 34 : 18;
      const timeCompatibility = Math.max(0, 18 - Math.abs(orderTime - Number(String(route?.departure || '08').split(':')[0] || 8)) * 2);
      const capacityScore = traveler.capacity >= orderCapacity ? 22 : Math.max(0, 22 - (orderCapacity - traveler.capacity) * 6);
      const trustScore = traveler.rating * 10 + traveler.reliability * 0.18;
      const availabilityScore = traveler.availability ? 14 : 0;
      const distanceScore = Math.max(0, 16 - traveler.distanceDeviation);
      const score = Math.round(routeOverlap + timeCompatibility + capacityScore + trustScore + availabilityScore + distanceScore);

      return {
        ...traveler,
        score: Math.min(score, 100),
        eta: calculateEta(order) + traveler.distanceDeviation,
        routeMatch: routeOverlap > 20,
      };
    })
    .sort((left, right) => right.score - left.score);
}

export function calculateRewards(orders, role) {
  const points = orders.length * 45 + (role === 'traveler' ? 180 : 90);
  const tier = points >= 500 ? 'Gold' : points >= 250 ? 'Silver' : 'Bronze';
  return { points, tier };
}

export function getPlatformAnalytics({ orders = [], routes = [], transactions = [], disputes = [], users = [] }) {
  const deliveredOrders = orders.filter((order) => order.status === 'Delivered');
  const activeOrders = orders.filter((order) => ['Accepted', 'Picked Up', 'In Transit'].includes(order.status));
  const revenue = transactions.filter((entry) => entry.type === 'payment').reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const refunds = transactions.filter((entry) => entry.type === 'refund').reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  return {
    totalUsers: users.length,
    activeDeliveries: activeOrders.length,
    revenue,
    refunds,
    routeCount: routes.length,
    deliveredCount: deliveredOrders.length,
    openDisputes: disputes.filter((dispute) => dispute.status === 'open').length,
  };
}

export function buildNotificationFeed({ orders = [], routes = [], disputes = [], messages = [] }) {
  const latestOrder = orders[0];
  return [
    latestOrder ? `Order ${latestOrder.id} is ${latestOrder.status}` : 'No live orders yet',
    `${routes.length} routes published`,
    `${disputes.filter((item) => item.status === 'open').length} open disputes`,
    `${messages.length} support messages in chat`,
  ];
}

export function buildOrderStages(order) {
  return [
    { key: 'placed', label: 'Order placed', done: true },
    { key: 'accepted', label: 'Accepted', done: ['Accepted', 'Picked Up', 'In Transit', 'Delivered'].includes(order.status) },
    { key: 'picked', label: 'Picked up', done: ['Picked Up', 'In Transit', 'Delivered'].includes(order.status) },
    { key: 'moving', label: 'In transit', done: ['In Transit', 'Delivered'].includes(order.status) },
    { key: 'delivered', label: 'Delivered', done: order.status === 'Delivered' },
  ];
}
