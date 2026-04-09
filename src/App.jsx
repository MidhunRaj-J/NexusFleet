import { useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { DELIVERY_STAGES, INITIAL_LEADERBOARD, ROLE_CONFIG, SAMPLE_USERS } from './config/roles';
import { AdminPage } from './pages/AdminPage';
import { CustomerPage } from './pages/CustomerPage';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { PageTransition } from './components/PageTransition';
import { ProfilePage } from './pages/ProfilePage';
import { TrackingPage } from './pages/TrackingPage';
import { TravelerPage } from './pages/TravelerPage';
import { usePersistentState } from './hooks/usePersistentState';
import {
  DEFAULT_ADDRESSES,
  INITIAL_CHAT_MESSAGES,
  INITIAL_SESSION_DEVICES,
  INITIAL_REVIEWS,
  INITIAL_TRANSACTIONS,
  INITIAL_TRAVELERS,
  ISSUE_TYPES,
  ITEM_CATEGORIES,
  NOTIFICATION_CHANNELS,
  TIME_WINDOWS,
  TRANSPORT_TYPES,
  URGENCY_OPTIONS,
  calculateDynamicPrice,
  calculateRewards,
  buildNotificationFeed,
  buildOrderStages,
  calculateEta,
  detectRestrictedItems,
  getPlatformAnalytics,
  rankTravelers,
} from './lib/platform';

function App() {
  const [role, setRole] = usePersistentState('nexus-role', 'customer');
  const [user, setUser] = usePersistentState('nexus-user', { name: 'Guest', email: '' });
  const [auth, setAuth] = useState({ mode: 'login', email: '', phone: '', password: '', otp: '', social: 'Google', resetEmail: '' });
  const [profile, setProfile] = usePersistentState('nexus-profile', {
    name: 'Guest',
    phone: '',
    email: '',
    photoUrl: '',
    language: 'English',
    notifications: ['Push', 'Email'],
    addresses: DEFAULT_ADDRESSES,
    defaultAddressId: DEFAULT_ADDRESSES[0].id,
  });
  const [sessions, setSessions] = usePersistentState('nexus-sessions', INITIAL_SESSION_DEVICES);
  const [travelerProfile, setTravelerProfile] = usePersistentState('nexus-traveler-profile', {
    approval: 'pending',
    idProof: 'pending',
    licenseProof: 'pending',
    faceVerification: false,
    bankAccount: '',
    upiId: '',
    availability: true,
    transportType: 'Bike',
    recurring: 'daily',
    stops: '',
  });
  const [orderForm, setOrderForm] = useState({
    pickup: '',
    drop: '',
    itemCategory: 'documents',
    itemName: '',
    weight: 1,
    distance: 12,
    capacity: 5,
    length: '',
    width: '',
    height: '',
    instructions: '',
    itemImage: '',
    urgency: 'normal',
    timeWindow: 'same day',
    flexibleWindow: '08:00',
    manualBid: 0,
    specialInstructions: '',
  });
  const [routeForm, setRouteForm] = useState({ source: '', destination: '', departure: '08:00', stops: '', recurring: 'daily', capacity: 5, transportType: 'Bike' });
  const [orders, setOrders] = usePersistentState('nexus-orders', []);
  const [routes, setRoutes] = usePersistentState('nexus-routes', []);
  const [disputes, setDisputes] = usePersistentState('nexus-disputes', []);
  const [users, setUsers] = usePersistentState('nexus-users', SAMPLE_USERS);
  const [transactions, setTransactions] = usePersistentState('nexus-transactions', INITIAL_TRANSACTIONS);
  const [reviews, setReviews] = usePersistentState('nexus-reviews', INITIAL_REVIEWS);
  const [messages, setMessages] = usePersistentState('nexus-chat', INITIAL_CHAT_MESSAGES);
  const [finance, setFinance] = useState({ method: 'UPI', amount: 0, walletBalance: 0, travelerBalance: 0 });
  const [trackingOrderId, setTrackingOrderId] = useState('');
  const [reviewDraft, setReviewDraft] = useState({ rating: 5, comment: '' });
  const [chatDraft, setChatDraft] = useState('');
  const [complaintForm, setComplaintForm] = useState({ issueType: ISSUE_TYPES[0], description: '', evidence: '' });
  const location = useLocation();

  const notifications = useMemo(() => buildNotificationFeed({ orders, routes, disputes, messages }), [orders, routes, disputes, messages]);

  const restrictedCheck = useMemo(() => detectRestrictedItems({ category: orderForm.itemCategory, itemName: orderForm.itemName }), [orderForm.itemCategory, orderForm.itemName]);

  const dynamicPrice = useMemo(
    () => calculateDynamicPrice({ ...orderForm, restrictedFlag: !restrictedCheck.allowed, distance: Number(orderForm.distance || 12) }),
    [orderForm, restrictedCheck.allowed]
  );

  const candidateTravelers = useMemo(
    () => rankTravelers({ order: orderForm, routes, travelerPool: INITIAL_TRAVELERS }),
    [orderForm, routes]
  );
  const bestMatch = candidateTravelers[0] || { name: 'No traveler found', score: 0, eta: calculateEta(orderForm) };

  const login = (e) => {
    e.preventDefault();
    if (!auth.email && !auth.phone) return;
    const name = auth.email ? auth.email.split('@')[0] : profile.name || 'Guest';
    setUser({ name, email: auth.email || profile.email });
    setProfile((current) => ({
      ...current,
      name,
      email: auth.email || current.email,
      phone: auth.phone || current.phone,
    }));
    setSessions((current) => [
      { id: `DEV-${current.length + 1}`, name: 'Current browser session', location: 'Local machine', lastSeen: 'Just now', suspicious: false },
      ...current,
    ]);
  };

  const sendOtp = () => {
    setAuth((current) => ({ ...current, otp: '123456' }));
    setMessages((current) => [{ id: `MSG-${current.length + 1}`, sender: 'System', text: 'OTP sent for verification.', time: 'Now' }, ...current]);
  };

  const resetPassword = () => {
    setMessages((current) => [{ id: `MSG-${current.length + 1}`, sender: 'System', text: 'Password reset link queued.', time: 'Now' }, ...current]);
  };

  const socialLogin = () => {
    setMessages((current) => [{ id: `MSG-${current.length + 1}`, sender: 'System', text: `${auth.social} sign-in completed successfully.`, time: 'Now' }, ...current]);
  };

  const logoutAllDevices = () => {
    setSessions([]);
    setMessages((current) => [{ id: `MSG-${current.length + 1}`, sender: 'System', text: 'Logged out from all devices.', time: 'Now' }, ...current]);
  };

  const createOrder = (e) => {
    e.preventDefault();
    if (!orderForm.pickup || !orderForm.drop) return;

    const ranking = rankTravelers({ order: orderForm, routes, travelerPool: INITIAL_TRAVELERS });
    const selectedTraveler = ranking[0] || bestMatch;
    const orderId = `ORD-${10000 + orders.length + 1}`;
    const orderAmount = calculateDynamicPrice(orderForm);

    const newOrder = {
      id: orderId,
      ...orderForm,
      price: orderAmount,
      match: selectedTraveler.score,
      traveler: selectedTraveler.name,
      status: 'Placed',
      proof: 'OTP Pending',
      escrow: 'Holding',
      paymentStatus: 'Pending',
      reviewStatus: 'Pending',
      restrictedFlag: !restrictedCheck.allowed,
      restrictedReason: restrictedCheck.reason,
      eta: selectedTraveler.eta,
      ranking: ranking.slice(0, 3),
      history: ['Order placed'],
      rating: null,
    };
    setOrders((prev) => [newOrder, ...prev]);
    setTrackingOrderId(orderId);
    setFinance((current) => ({ ...current, amount: orderAmount }));
    setMessages((current) => [{ id: `MSG-${current.length + 1}`, sender: 'System', text: `New order ${orderId} created and routed for matching.`, time: 'Now' }, ...current]);
  };

  const addRoute = (e) => {
    e.preventDefault();
    if (!routeForm.source || !routeForm.destination) return;
    const newRoute = {
      id: `RT-${2000 + routes.length + 1}`,
      ...routeForm,
      owner: user.name,
      availability: travelerProfile.availability,
    };
    setRoutes((prev) => [newRoute, ...prev]);
    setRouteForm({ source: '', destination: '', departure: '08:00', stops: '', recurring: 'daily', capacity: 5, transportType: 'Bike' });
    setMessages((current) => [{ id: `MSG-${current.length + 1}`, sender: 'System', text: `Route ${newRoute.id} published.`, time: 'Now' }, ...current]);
  };

  const acceptOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((item) =>
        item.id === orderId ? { ...item, traveler: user.name, status: 'Accepted', proof: 'Photo Pending', history: [...(item.history || []), 'Traveler accepted request'] } : item
      )
    );
    setMessages((current) => [{ id: `MSG-${current.length + 1}`, sender: 'System', text: `Traveler accepted order ${orderId}.`, time: 'Now' }, ...current]);
  };

  const updateOrderStage = (orderId) => {
    let payout = null;
    setOrders((prev) =>
      prev.map((item) => {
        if (item.id !== orderId) return item;
        const staged = ['Placed', 'Accepted', 'Picked Up', 'In Transit', 'Delivered'];
        const currentIndex = staged.indexOf(item.status);
        const nextIndex = Math.min(currentIndex + 1, DELIVERY_STAGES.length - 1);
        const nextStatus = staged[Math.min(nextIndex, staged.length - 1)];
        if (nextStatus === 'Delivered') {
          payout = Math.round((item.price || 0) * 0.85);
        }
        return {
          ...item,
          status: nextStatus,
          escrow: nextStatus === 'Delivered' ? 'Released' : 'Holding',
          proof: nextStatus === 'Delivered' ? 'OTP + Photo Verified' : item.proof,
          rating: nextStatus === 'Delivered' ? 4.8 : item.rating,
          reviewStatus: nextStatus === 'Delivered' ? 'Ready' : item.reviewStatus,
          history: [...(item.history || []), nextStatus],
        };
      })
    );
    if (payout) {
      setTransactions((prev) => [{ id: `TX-${prev.length + 1}`, type: 'payout', amount: payout, method: 'Escrow release', status: 'Released' }, ...prev]);
      setFinance((current) => ({ ...current, travelerBalance: current.travelerBalance + payout, walletBalance: Math.max(0, current.walletBalance - payout) }));
    }
  };

  const openDispute = (orderId) => {
    setDisputes((prev) => [
      {
        id: `DP-${500 + prev.length + 1}`,
        orderId,
        status: 'open',
        reason: complaintForm.issueType,
        evidence: complaintForm.evidence,
        description: complaintForm.description,
      },
      ...prev,
    ]);
    setMessages((current) => [{ id: `MSG-${current.length + 1}`, sender: 'System', text: `Complaint filed for ${orderId}.`, time: 'Now' }, ...current]);
  };

  const resolveDispute = (disputeId) => {
    setDisputes((prev) => prev.map((d) => (d.id === disputeId ? { ...d, status: 'resolved' } : d)));
  };

  const approveKyc = (userId) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, kyc: 'approved' } : u)));
  };

  const suspendUser = (userId) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: 'suspended' } : u)));
  };

  const submitReview = (orderId) => {
    const currentOrder = orders.find((order) => order.id === orderId);
    if (!currentOrder) return;
    setReviews((prev) => [
      { id: `RV-${prev.length + 1}`, orderId, rating: reviewDraft.rating, comment: reviewDraft.comment, from: profile.name || user.name, to: currentOrder.traveler },
      ...prev,
    ]);
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, rating: reviewDraft.rating, reviewStatus: 'Submitted' } : order)));
  };

  const sendChatMessage = () => {
    if (!chatDraft.trim()) return;
    setMessages((current) => [{ id: `MSG-${current.length + 1}`, sender: profile.name || user.name, text: chatDraft.trim(), time: 'Now' }, ...current]);
    setChatDraft('');
  };

  const capturePayment = () => {
    const amount = Number(finance.amount || dynamicPrice);
    if (!amount) return;
    setTransactions((prev) => [{ id: `TX-${prev.length + 1}`, type: 'payment', amount, method: finance.method, status: 'Captured' }, ...prev]);
    setFinance((current) => ({ ...current, walletBalance: current.walletBalance + amount }));
    setOrders((prev) => prev.map((order) => (order.id === trackingOrderId ? { ...order, paymentStatus: 'Paid', escrow: 'Holding' } : order)));
  };

  const addRefund = (amount) => {
    setTransactions((prev) => [{ id: `TX-${prev.length + 1}`, type: 'refund', amount: Number(amount), method: 'Escrow', status: 'Refunded' }, ...prev]);
    setFinance((current) => ({ ...current, walletBalance: Math.max(0, current.walletBalance - Number(amount)) }));
  };

  const releaseEscrow = (orderId) => {
    const order = orders.find((item) => item.id === orderId);
    if (!order) return;
    const payout = Math.round((order.price || 0) * 0.85);
    setTransactions((prev) => [{ id: `TX-${prev.length + 1}`, type: 'payout', amount: payout, method: 'Escrow', status: 'Released' }, ...prev]);
    setFinance((current) => ({ ...current, walletBalance: Math.max(0, current.walletBalance - payout), travelerBalance: current.travelerBalance + payout }));
  };

  const currentTrackingOrder = orders.find((order) => order.id === trackingOrderId) || orders[0];
  const trackingHealth = {
    gps: currentTrackingOrder ? 'Active' : 'Idle',
    network: 'Stable',
    eta: currentTrackingOrder?.eta || calculateEta(orderForm),
    delayAlert: currentTrackingOrder && ['Picked Up', 'In Transit'].includes(currentTrackingOrder.status) ? 'Monitor' : 'Clear',
  };

  const { points: rewardsPoints, tier: loyaltyTier } = useMemo(
    () => calculateRewards(orders, role),
    [orders, role]
  );
  const activeEscrow = orders.filter((o) => o.escrow === 'locked').length;
  const delivered = orders.filter((o) => o.status === 'Delivered').length;
  const topTravelers = useMemo(
    () => [...INITIAL_LEADERBOARD, ...candidateTravelers.slice(0, 2)].sort((left, right) => right.rating - left.rating).slice(0, 5),
    [candidateTravelers]
  );

  const analytics = useMemo(
    () => getPlatformAnalytics({ orders, routes, transactions, disputes, users }),
    [orders, routes, transactions, disputes, users]
  );

  const roleKey = role === 'partner' ? 'traveler' : role;
  const roleInfo = ROLE_CONFIG[roleKey];
  const routeClassName = `route-stage route-${location.pathname.replaceAll('/', '-') || 'home'}`;

  return (
    <PageTransition transitionKey={location.pathname} className={routeClassName}>
      <Routes location={location}>
        <Route path="/" element={<LandingPage role={role} setRole={setRole} roleInfo={roleInfo} ordersCount={orders.length} routeCount={routes.length} disputeCount={disputes.filter((dispute) => dispute.status === 'open').length} activeEscrow={activeEscrow} />} />
        <Route path="/auth" element={<LoginPage role={role} auth={auth} setAuth={setAuth} login={login} sendOtp={sendOtp} resetPassword={resetPassword} socialLogin={socialLogin} />} />
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route path="/profile" element={<ProfilePage role={role} profile={profile} setProfile={setProfile} sessions={sessions} setSessions={setSessions} logoutAllDevices={logoutAllDevices} />} />
        <Route path="/customer" element={<CustomerPage role={role} orderForm={orderForm} setOrderForm={setOrderForm} createOrder={createOrder} orders={orders} bestMatch={bestMatch} candidateTravelers={candidateTravelers} dynamicPrice={dynamicPrice} restrictedCheck={restrictedCheck} notifications={notifications} reviews={reviews} reviewDraft={reviewDraft} setReviewDraft={setReviewDraft} submitReview={submitReview} chatDraft={chatDraft} setChatDraft={setChatDraft} sendChatMessage={sendChatMessage} messages={messages} complaintForm={complaintForm} setComplaintForm={setComplaintForm} openDispute={openDispute} itemCategories={ITEM_CATEGORIES} urgencyOptions={URGENCY_OPTIONS} timeWindows={TIME_WINDOWS} />} />
        <Route path="/tracking" element={<TrackingPage role={role} orders={orders} trackingOrderId={trackingOrderId} setTrackingOrderId={setTrackingOrderId} updateOrderStage={updateOrderStage} trackingHealth={trackingHealth} />} />
        <Route path="/payments" element={<PaymentsPage role={role} orders={orders} transactions={transactions} wallet={finance} setWallet={setFinance} addPayment={capturePayment} addRefund={addRefund} releaseEscrow={releaseEscrow} />} />
        <Route path="/traveler" element={<TravelerPage role={role} routeForm={routeForm} setRouteForm={setRouteForm} addRoute={addRoute} routes={routes} orders={orders} acceptOrder={acceptOrder} updateOrderStage={updateOrderStage} topTravelers={topTravelers} notifications={notifications} rewardsPoints={rewardsPoints} loyaltyTier={loyaltyTier} travelerProfile={travelerProfile} setTravelerProfile={setTravelerProfile} transportTypes={TRANSPORT_TYPES} />} />
        <Route path="/admin" element={<AdminPage role={role} users={users} disputes={disputes} approveKyc={approveKyc} resolveDispute={resolveDispute} suspendUser={suspendUser} analytics={analytics} orders={orders} transactions={transactions} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PageTransition>
  );
}

export default App;
