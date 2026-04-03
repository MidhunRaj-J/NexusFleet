export function calculateDynamicPrice({ weight, distance, urgency }) {
  const urgencyMultiplier = urgency === 'express' ? 1.45 : urgency === 'flexible' ? 0.88 : 1;
  const base = weight * 52 + distance * 2.3;
  return Number((base * urgencyMultiplier).toFixed(2));
}

export function calculateBestMatch({ weight, urgency, capacity, distance }) {
  const score = Math.max(
    61,
    Math.min(
      98,
      Math.round(95 - weight * 1.5 + (urgency === 'express' ? 7 : 2) + capacity - distance * 0.08)
    )
  );

  return {
    traveler: score > 90 ? 'Asha N' : score > 80 ? 'Vikram R' : 'Fathima K',
    score,
    eta: Math.max(45, Math.round(distance * 3.6)),
  };
}

export function buildNotifications({ orders, routes, users, disputes }) {
  const latestOrder = orders[0];
  return [
    latestOrder ? `Order ${latestOrder.id} currently ${latestOrder.status}` : 'No active orders yet',
    `${routes.length} traveler routes currently published`,
    `${users.filter((user) => user.kyc === 'pending').length} KYC approvals pending`,
    `${disputes.filter((dispute) => dispute.status === 'open').length} disputes open`,
  ];
}

export function getRewardsSummary({ orders, routes, role }) {
  const rewardsPoints = orders.length * 45 + routes.length * 20 + (role === 'traveler' ? 220 : 60);
  const loyaltyTier = rewardsPoints > 600 ? 'Gold' : rewardsPoints > 280 ? 'Silver' : 'Bronze';

  return { rewardsPoints, loyaltyTier };
}

export function getTopTravelers({ baseList, userName, role, delivered, loyaltyTier }) {
  const travelers = [...baseList];

  if (userName !== 'Guest' && role === 'traveler') {
    travelers.push({ name: userName, trips: 12 + delivered, rating: 4.7, tier: loyaltyTier });
  }

  return travelers.sort((left, right) => right.trips - left.trips).slice(0, 5);
}
