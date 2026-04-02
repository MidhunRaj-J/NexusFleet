import { useMemo, useState } from 'react';
import logo from './assets/logo.svg';
import { DELIVERY_STAGES, INITIAL_LEADERBOARD, ROLE_CONFIG, SAMPLE_USERS } from './config/roles';
import { usePersistentState } from './hooks/usePersistentState';

function App() {
  const [role, setRole] = usePersistentState('nexus-role', 'customer');
  const [user, setUser] = usePersistentState('nexus-user', { name: 'Guest', email: '' });
  const [auth, setAuth] = useState({ email: '', password: '' });
  const [booking, setBooking] = useState({ pickup: '', drop: '', weight: 1, urgency: 'standard', distance: 12, capacity: 5 });
  const [orders, setOrders] = usePersistentState('nexus-orders', []);
  const [routes, setRoutes] = usePersistentState('nexus-routes', []);
  const [disputes, setDisputes] = usePersistentState('nexus-disputes', []);
  const [users, setUsers] = usePersistentState('nexus-users', SAMPLE_USERS);
  const [activeSection, setActiveSection] = useState('overview');
  const [routeForm, setRouteForm] = useState({ source: '', destination: '', departure: '08:00', capacity: 5 });

  const notifications = useMemo(() => {
    const latestOrder = orders[0];
    return [
      latestOrder ? `Order ${latestOrder.id} currently ${latestOrder.status}` : 'No active orders yet',
      `${routes.length} traveler routes currently published`,
      `${users.filter((u) => u.kyc === 'pending').length} KYC approvals pending`,
      `${disputes.filter((d) => d.status === 'open').length} disputes open`,
    ];
  }, [orders, routes, users, disputes]);

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
      escrow: 'locked',
      rating: null,
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const addRoute = (e) => {
    e.preventDefault();
    if (!routeForm.source || !routeForm.destination) return;
    const newRoute = {
      id: `RT-${2000 + routes.length + 1}`,
      ...routeForm,
      owner: user.name,
    };
    setRoutes((prev) => [newRoute, ...prev]);
    setRouteForm({ source: '', destination: '', departure: '08:00', capacity: 5 });
  };

  const acceptOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((item) =>
        item.id === orderId ? { ...item, traveler: user.name, status: 'Picked Up', proof: 'Photo Pending' } : item
      )
    );
  };

  const updateOrderStage = (orderId) => {
    setOrders((prev) =>
      prev.map((item) => {
        if (item.id !== orderId) return item;
        const currentIndex = DELIVERY_STAGES.indexOf(item.status);
        const nextIndex = Math.min(currentIndex + 1, DELIVERY_STAGES.length - 1);
        const nextStatus = DELIVERY_STAGES[nextIndex];
        return {
          ...item,
          status: nextStatus,
          escrow: nextStatus === 'Delivered' ? 'released' : 'locked',
          proof: nextStatus === 'Delivered' ? 'OTP + Photo Verified' : item.proof,
          rating: nextStatus === 'Delivered' ? 4.8 : item.rating,
        };
      })
    );
  };

  const openDispute = (orderId) => {
    setDisputes((prev) => [
      {
        id: `DP-${500 + prev.length + 1}`,
        orderId,
        status: 'open',
        reason: 'Delay beyond ETA',
      },
      ...prev,
    ]);
  };

  const resolveDispute = (disputeId) => {
    setDisputes((prev) => prev.map((d) => (d.id === disputeId ? { ...d, status: 'resolved' } : d)));
  };

  const approveKyc = (userId) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, kyc: 'approved' } : u)));
  };

  const rewardsPoints = orders.length * 45 + routes.length * 20 + (role === 'traveler' ? 220 : 60);
  const loyaltyTier = rewardsPoints > 600 ? 'Gold' : rewardsPoints > 280 ? 'Silver' : 'Bronze';
  const activeEscrow = orders.filter((o) => o.escrow === 'locked').length;
  const delivered = orders.filter((o) => o.status === 'Delivered').length;
  const topTravelers = useMemo(() => {
    const base = [...INITIAL_LEADERBOARD];
    if (user.name !== 'Guest' && role === 'traveler') {
      base.push({ name: user.name, trips: 12 + delivered, rating: 4.7, tier: loyaltyTier });
    }
    return base.sort((a, b) => b.trips - a.trips).slice(0, 5);
  }, [user.name, role, delivered, loyaltyTier]);

  const roleKey = role === 'partner' ? 'traveler' : role;
  const roleInfo = ROLE_CONFIG[roleKey];

  return (
    <div className="app-shell">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <header className="topbar">
        <img src={logo} alt="NexusFleet logo" className="logo" />
        <nav className="role-switch">
          <button className={role === 'customer' ? 'active' : ''} onClick={() => setRole('customer')}>Customer</button>
          <button className={role === 'traveler' ? 'active' : ''} onClick={() => setRole('traveler')}>Traveler</button>
          <button className={role === 'admin' ? 'active' : ''} onClick={() => setRole('admin')}>Admin</button>
        </nav>
      </header>

      <main className="layout">
        <section className="hero card">
          <div>
            <h1>{roleInfo.title}</h1>
            <p>
              {roleInfo.subtitle} NexusFleet now runs with persistent data, role abstractions, live workflow actions,
              and production-style operating views.
            </p>
            <div className="kpis">
              <div><strong>{orders.length || 0}</strong><span>Orders</span></div>
              <div><strong>{bestMatch.score}%</strong><span>AI Match</span></div>
              <div><strong>₹{dynamicPrice}</strong><span>Dynamic Price</span></div>
              <div><strong>{activeEscrow}</strong><span>Escrow Locked</span></div>
            </div>
            <div className="section-switch">
              {['overview', 'marketplace', 'tracking', 'rewards', 'admin'].map((section) => (
                <button
                  key={section}
                  className={activeSection === section ? 'active' : ''}
                  onClick={() => setActiveSection(section)}
                  type="button"
                >
                  {section}
                </button>
              ))}
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

        {activeSection === 'overview' && (
          <section className="grid three reveal">
            <article className="card">
              <h3>User System</h3>
              <p>Role abstraction with dedicated controls, profile contexts, and persistent session memory.</p>
            </article>
            <article className="card">
              <h3>Order + Matching Engine</h3>
              <p>Route similarity, time overlap, urgency score, and AI-assist traveler recommendation.</p>
            </article>
            <article className="card">
              <h3>Payment + Rewards</h3>
              <p>Escrow life cycle, delivery proof states, cashback points, and referral-ready mechanics.</p>
            </article>
          </section>
        )}

        {(activeSection === 'marketplace' || activeSection === 'overview') && (
          <section className="grid split reveal">
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
              <h2>Traveler Route Board</h2>
              <form className="form-grid" onSubmit={addRoute}>
                <input placeholder="Source" value={routeForm.source} onChange={(e) => setRouteForm((v) => ({ ...v, source: e.target.value }))} />
                <input placeholder="Destination" value={routeForm.destination} onChange={(e) => setRouteForm((v) => ({ ...v, destination: e.target.value }))} />
                <input type="time" value={routeForm.departure} onChange={(e) => setRouteForm((v) => ({ ...v, departure: e.target.value }))} />
                <input type="number" min="1" placeholder="Capacity" value={routeForm.capacity} onChange={(e) => setRouteForm((v) => ({ ...v, capacity: Number(e.target.value) }))} />
                <button type="submit" className="grid-btn">Publish Route</button>
              </form>
              <ul className="list compact">
                {routes.length === 0 && <li>No routes published yet.</li>}
                  {routes.slice(0, 4).map((route) => (
                    <li key={route.id}>{route.source}{' -> '}{route.destination} at {route.departure} ({route.capacity} slots)</li>
                  ))}
              </ul>
            </article>
          </section>
        )}

        {(activeSection === 'tracking' || activeSection === 'overview') && (
        <section className="grid split reveal">
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
            <div className="action-row">
              {orders[0] && <button type="button" onClick={() => updateOrderStage(orders[0].id)}>Advance Latest Order Stage</button>}
              {orders[0] && <button type="button" className="ghost" onClick={() => openDispute(orders[0].id)}>Open Dispute on Latest</button>}
              {orders[0] && role === 'traveler' && <button type="button" className="ghost" onClick={() => acceptOrder(orders[0].id)}>Accept Latest Order</button>}
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
              {topTravelers.map((p) => (
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
        )}

        {(activeSection === 'admin' || (activeSection === 'overview' && role === 'admin')) && (
          <section className="grid split reveal">
            <article className="card">
              <h2>KYC and User Moderation</h2>
              <ul className="list compact">
                {users.map((u) => (
                  <li key={u.id}>
                    {u.id} • {u.name} • {u.role} • KYC: {u.kyc}
                    {u.kyc === 'pending' && (
                      <button type="button" className="mini" onClick={() => approveKyc(u.id)}>Approve</button>
                    )}
                  </li>
                ))}
              </ul>
            </article>

            <article className="card">
              <h2>Dispute Resolution Desk</h2>
              <ul className="list compact">
                {disputes.length === 0 && <li>No disputes currently open.</li>}
                {disputes.map((d) => (
                  <li key={d.id}>
                    {d.id} • Order {d.orderId} • {d.reason} • {d.status}
                    {d.status === 'open' && (
                      <button type="button" className="mini" onClick={() => resolveDispute(d.id)}>Resolve</button>
                    )}
                  </li>
                ))}
              </ul>
            </article>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
