export const ROLE_CONFIG = {
  customer: {
    title: 'Customer Command Center',
    subtitle: 'Book, track, pay, and rate with full visibility.',
    accent: 'var(--accent-customer)',
  },
  traveler: {
    title: 'Traveler Operations Desk',
    subtitle: 'Add routes, accept jobs, and grow your earnings.',
    accent: 'var(--accent-traveler)',
  },
  admin: {
    title: 'Admin Intelligence Grid',
    subtitle: 'Moderation, risk, disputes, and platform analytics.',
    accent: 'var(--accent-admin)',
  },
};

export const DELIVERY_STAGES = ['Escrow Locked', 'Picked Up', 'In Transit', 'Delivered'];

export const INITIAL_LEADERBOARD = [
  { name: 'Asha N', trips: 128, rating: 4.9, tier: 'Gold' },
  { name: 'Vikram R', trips: 101, rating: 4.8, tier: 'Gold' },
  { name: 'Fathima K', trips: 77, rating: 4.7, tier: 'Silver' },
  { name: 'Joel M', trips: 63, rating: 4.6, tier: 'Silver' },
];

export const SAMPLE_USERS = [
  { id: 'USR-1001', name: 'Niya P', role: 'traveler', kyc: 'pending' },
  { id: 'USR-1002', name: 'Ameen K', role: 'customer', kyc: 'approved' },
  { id: 'USR-1003', name: 'Leena R', role: 'traveler', kyc: 'approved' },
];
