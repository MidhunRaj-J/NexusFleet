import { useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { DELIVERY_STAGES, INITIAL_LEADERBOARD, ROLE_CONFIG, SAMPLE_USERS } from './config/roles';
import {
  buildNotifications,
  calculateBestMatch,
  calculateDynamicPrice,
  getRewardsSummary,
  getTopTravelers,
} from './lib/logistics';
import { usePersistentState } from './hooks/usePersistentState';
import { AdminPage } from './pages/AdminPage';
import { CustomerPage } from './pages/CustomerPage';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { TravelerPage } from './pages/TravelerPage';
import { PageTransition } from './components/PageTransition';

function App() {
  const [role, setRole] = usePersistentState('nexus-role', 'customer');
  const [user, setUser] = usePersistentState('nexus-user', { name: 'Guest', email: '' });
  const [auth, setAuth] = useState({ email: '', password: '' });
  const [booking, setBooking] = useState({ pickup: '', drop: '', weight: 1, urgency: 'standard', distance: 12, capacity: 5 });
  const [orders, setOrders] = usePersistentState('nexus-orders', []);
  const [routes, setRoutes] = usePersistentState('nexus-routes', []);
  const [disputes, setDisputes] = usePersistentState('nexus-disputes', []);
  const [users, setUsers] = usePersistentState('nexus-users', SAMPLE_USERS);
  const [routeForm, setRouteForm] = useState({ source: '', destination: '', departure: '08:00', capacity: 5 });
  const location = useLocation();

  const notifications = useMemo(() => {
    return buildNotifications({ orders, routes, users, disputes });
  }, [orders, routes, users, disputes]);

  const dynamicPrice = useMemo(() => calculateDynamicPrice(booking), [booking]);

  const bestMatch = useMemo(() => {
    return calculateBestMatch(booking);
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

  const { rewardsPoints, loyaltyTier } = useMemo(
    () => getRewardsSummary({ orders, routes, role }),
    [orders, routes, role]
  );
  const activeEscrow = orders.filter((o) => o.escrow === 'locked').length;
  const delivered = orders.filter((o) => o.status === 'Delivered').length;
  const topTravelers = useMemo(
    () => getTopTravelers({ baseList: INITIAL_LEADERBOARD, userName: user.name, role, delivered, loyaltyTier }),
    [user.name, role, delivered, loyaltyTier]
  );

  const roleKey = role === 'partner' ? 'traveler' : role;
  const roleInfo = ROLE_CONFIG[roleKey];
  const routeClassName = `route-stage route-${location.pathname.replaceAll('/', '-') || 'home'}`;

  return (
    <PageTransition transitionKey={location.pathname} className={routeClassName}>
      <Routes location={location}>
        <Route path="/" element={<LandingPage role={role} setRole={setRole} roleInfo={roleInfo} ordersCount={orders.length} routeCount={routes.length} disputeCount={disputes.filter((dispute) => dispute.status === 'open').length} activeEscrow={activeEscrow} />} />
        <Route path="/login" element={<LoginPage role={role} auth={auth} setAuth={setAuth} login={login} />} />
        <Route path="/customer" element={<CustomerPage role={role} booking={booking} setBooking={setBooking} createOrder={createOrder} orders={orders} bestMatch={bestMatch} dynamicPrice={dynamicPrice} activeEscrow={activeEscrow} delivered={delivered} />} />
        <Route path="/traveler" element={<TravelerPage role={role} routeForm={routeForm} setRouteForm={setRouteForm} addRoute={addRoute} routes={routes} orders={orders} acceptOrder={acceptOrder} updateOrderStage={updateOrderStage} topTravelers={topTravelers} notifications={notifications} rewardsPoints={rewardsPoints} loyaltyTier={loyaltyTier} />} />
        <Route path="/admin" element={<AdminPage role={role} users={users} disputes={disputes} approveKyc={approveKyc} resolveDispute={resolveDispute} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PageTransition>
  );
}

export default App;
