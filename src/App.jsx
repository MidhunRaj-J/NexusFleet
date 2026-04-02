import { useMemo, useState } from 'react';
import logo from './assets/logo.svg';

const initialLeaderboard = [
  { name: 'Asha N', trips: 128, rating: 4.9, tier: 'Gold' },
  { name: 'Vikram R', trips: 101, rating: 4.8, tier: 'Gold' },
  { name: 'Fathima K', trips: 77, rating: 4.7, tier: 'Silver' },
];

const notifications = [
  'New route match found for Kochi -> Coimbatore',
  'Escrow locked for BK-10421',
  'Delivery marked In Transit by traveler',
  'Admin flagged 0 high-risk fraud events today',
];

function App() {
  const [role, setRole] = useState('customer');
  const [user, setUser] = useState({ name: 'Guest', email: '' });
  const [auth, setAuth] = useState({ email: '', password: '' });
  const [booking, setBooking] = useState({ pickup: '', drop: '', weight: 1, urgency: 'standard', distance: 12, capacity: 5 });
  const [orders, setOrders] = useState([]);

  const demandMultiplier = booking.urgency === 'express' ? 1.45 : booking.urgency === 'flexible' ? 0.88 : 1;
  const dynamicPrice = useMemo(() => {
    const base = booking.weight * 52 + booking.distance * 2.3;
    return (base * demandMultiplier).toFixed(2);
  }, [booking.weight, booking.distance, demandMultiplier]);

  const bestMatch = useMemo(() => {
    const score = Math.max(
      61,
      Math.min(
        98,
        Math.round(95 - booking.weight * 1.5 + (booking.urgency === 'express' ? 7 : 2) + booking.capacity)
      )
    );
    return {
      traveler: score > 90 ? 'Asha N' : score > 80 ? 'Vikram R' : 'Fathima K',
      score,
      eta: Math.max(45, Math.round(booking.distance * 3.6)),
    };
  }, [booking]);

  const login = (e) => {
    e.preventDefault();
    if (!auth.email || !auth.password) return;
    const name = auth.email.split('@')[0];
    setUser({ name, email: auth.email });
  };

  const createOrder = (e) => {
    e.preventDefault();
    if (!booking.pickup || !booking.drop) return;

    const newOrder = {
      id: `BK-${10000 + orders.length + 1}`,
      ...booking,
      match: bestMatch.score,
      traveler: bestMatch.traveler,
      status: 'Escrow Locked',
      proof: 'OTP Pending',
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const rewardsPoints = orders.length * 45 + (role === 'partner' ? 220 : 60);
  const loyaltyTier = rewardsPoints > 600 ? 'Gold' : rewardsPoints > 280 ? 'Silver' : 'Bronze';

  return (
    <div className="app-shell">
      <header className="topbar">
        <img src={logo} alt="NexusFleet logo" className="logo" />
        <nav className="role-switch">
          <button className={role === 'customer' ? 'active' : ''} onClick={() => setRole('customer')}>Customer</button>
          <button className={role === 'partner' ? 'active' : ''} onClick={() => setRole('partner')}>Traveler</button>
          <button className={role === 'admin' ? 'active' : ''} onClick={() => setRole('admin')}>Admin</button>
        </nav>
      </header>

      <main className="layout">
        <section className="hero card">
          <div>
            <h1>Community-Driven Logistics Platform</h1>
            <p>
              Travelers earn while moving. Customers ship faster and smarter. Admins secure trust with escrow,
              verification, tracking, and fraud defense.
            </p>
            <div className="kpis">
              <div><strong>{orders.length || 0}</strong><span>Orders</span></div>
              <div><strong>{bestMatch.score}%</strong><span>AI Match</span></div>
              <div><strong>₹{dynamicPrice}</strong><span>Dynamic Price</span></div>
              <div><strong>{loyaltyTier}</strong><span>Loyalty Tier</span></div>
            </div>
          </div>
          <form className="auth card-soft" onSubmit={login}>
            <h3>{role.toUpperCase()} Access</h3>
            <input
              type="email"
              placeholder="Email"
              value={auth.email}
              onChange={(e) => setAuth((v) => ({ ...v, email: e.target.value }))}
            />
            <input
              type="password"
              placeholder="Password"
              value={auth.password}
              onChange={(e) => setAuth((v) => ({ ...v, password: e.target.value }))}
            />
            <button type="submit">Sign In</button>
            <small>Logged in as: {user.email || 'not signed in'}</small>
          </form>
        </section>

        <section className="grid three">
          <article className="card">
            <h3>User System</h3>
            <p>Role-based account experience for Customer, Traveler, and Admin with profile, history, and controls.</p>
          </article>
          <article className="card">
            <h3>Order + Matching Engine</h3>
            <p>Route similarity, time overlap, and capacity-aware matching with AI confidence score.</p>
          </article>
          <article className="card">
            <h3>Payment + Rewards</h3>
            <p>Escrow lock/release flow, earnings, cashback, referrals, and leaderboard gamification.</p>
          </article>
        </section>

        <section className="grid split">
          <form className="card" onSubmit={createOrder}>
            <h2>Create Delivery Order</h2>
            <div className="form-grid">
              <input placeholder="Pickup location" value={booking.pickup} onChange={(e) => setBooking((v) => ({ ...v, pickup: e.target.value }))} />
              <input placeholder="Drop location" value={booking.drop} onChange={(e) => setBooking((v) => ({ ...v, drop: e.target.value }))} />
              <input type="number" min="1" placeholder="Weight (kg)" value={booking.weight} onChange={(e) => setBooking((v) => ({ ...v, weight: Number(e.target.value) }))} />
              <input type="number" min="1" placeholder="Distance (km)" value={booking.distance} onChange={(e) => setBooking((v) => ({ ...v, distance: Number(e.target.value) }))} />
              <input type="number" min="1" placeholder="Capacity needed" value={booking.capacity} onChange={(e) => setBooking((v) => ({ ...v, capacity: Number(e.target.value) }))} />
              <select value={booking.urgency} onChange={(e) => setBooking((v) => ({ ...v, urgency: e.target.value }))}>
                <option value="standard">Standard</option>
                <option value="express">Express</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>
            <div className="metrics">
              <p>Dynamic Price: <strong>₹{dynamicPrice}</strong></p>
              <p>Best Traveler: <strong>{bestMatch.traveler}</strong></p>
              <p>Match Score: <strong>{bestMatch.score}%</strong></p>
              <p>ETA: <strong>{bestMatch.eta} mins</strong></p>
            </div>
            <button type="submit">Create Order and Lock Escrow</button>
          </form>

          <article className="card">
            <h2>{role === 'admin' ? 'Admin Intelligence Panel' : role === 'partner' ? 'Traveler Earnings Panel' : 'Customer Tracking Panel'}</h2>
            {role === 'customer' && (
              <ul className="list">
                <li>{'Track delivery states: Picked Up -> In Transit -> Delivered'}</li>
                <li>OTP + photo proof unlocks escrow release</li>
                <li>Review history, rating, and payments</li>
                <li>Loyalty tier: {loyaltyTier} | Points: {rewardsPoints}</li>
              </ul>
            )}
            {role === 'partner' && (
              <ul className="list">
                <li>Add routes and accept smart-matched jobs</li>
                <li>Earnings per trip + referral + streak bonus</li>
                <li>Leaderboard rank simulation and rating score</li>
                <li>KYC/verification status: Approved</li>
              </ul>
            )}
            {role === 'admin' && (
              <ul className="list">
                <li>Approve/reject users and monitor KYC queue</li>
                <li>Dispute handling, fraud alerts, and moderation</li>
                <li>Analytics: demand, ETA performance, conversion</li>
                <li>Intercity expansion monitor: Kerala ↔ Tamil Nadu</li>
              </ul>
            )}
          </article>
        </section>

        <section className="grid split">
          <article className="card">
            <h2>Live Orders</h2>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Route</th>
                    <th>Match</th>
                    <th>Status</th>
                    <th>Proof</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="5">No orders yet. Create one above.</td>
                    </tr>
                  )}
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td>{o.id}</td>
                      <td>{o.pickup}{' -> '}{o.drop}</td>
                      <td>{o.match}%</td>
                      <td>{o.status}</td>
                      <td>{o.proof}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="card">
            <h2>Gamification and Smart Notifications</h2>
            <div className="badge-row">
              <span className="pill">Coins: {rewardsPoints}</span>
              <span className="pill">Cashback Eligible</span>
              <span className="pill">Referral Bonus Active</span>
              <span className="pill">Tier: {loyaltyTier}</span>
            </div>
            <h3>Traveler Leaderboard</h3>
            <ul className="list compact">
              {initialLeaderboard.map((p) => (
                <li key={p.name}>{p.name} • {p.trips} trips • ⭐ {p.rating} • {p.tier}</li>
              ))}
            </ul>
            <h3>Notifications</h3>
            <ul className="list compact">
              {notifications.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </article>
        </section>
      </main>
    </div>
  );
}

export default App;
