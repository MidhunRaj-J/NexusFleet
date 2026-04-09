import { PageShell } from '../components/PageShell';

export function TravelerPage({
  role,
  routeForm,
  setRouteForm,
  addRoute,
  routes,
  orders,
  acceptOrder,
  updateOrderStage,
  topTravelers,
  notifications,
  rewardsPoints,
  loyaltyTier,
  travelerProfile,
  setTravelerProfile,
  transportTypes,
}) {
  return (
    <PageShell
      role={role}
      eyebrow="TRAVELER OPERATIONS"
      title="Traveler onboarding, route publishing, and availability management"
      subtitle="Complete verification, create recurring routes, and manage live availability from the operations workspace."
      actions={(
        <div className="status-stack compact-stack">
          <div className="status-row"><span>Rewards</span><strong>{rewardsPoints}</strong></div>
          <div className="status-row"><span>Tier</span><strong>{loyaltyTier}</strong></div>
        </div>
      )}
    >
      <div className="grid split">
        <article className="card form-card">
          <h2>Traveler onboarding</h2>
          <div className="form-grid single-column">
            <input placeholder="Aadhar / PAN proof" value={travelerProfile.idProof} onChange={(event) => setTravelerProfile((current) => ({ ...current, idProof: event.target.value }))} />
            <input placeholder="Driving license proof" value={travelerProfile.licenseProof} onChange={(event) => setTravelerProfile((current) => ({ ...current, licenseProof: event.target.value }))} />
            <input placeholder="Bank account" value={travelerProfile.bankAccount} onChange={(event) => setTravelerProfile((current) => ({ ...current, bankAccount: event.target.value }))} />
            <input placeholder="UPI ID" value={travelerProfile.upiId} onChange={(event) => setTravelerProfile((current) => ({ ...current, upiId: event.target.value }))} />
            <select value={travelerProfile.transportType} onChange={(event) => setTravelerProfile((current) => ({ ...current, transportType: event.target.value }))}>
              {transportTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
            <input placeholder="Intermediate stops" value={travelerProfile.stops} onChange={(event) => setTravelerProfile((current) => ({ ...current, stops: event.target.value }))} />
            <label className="toggle-row">
              <span>Face verification</span>
              <input type="checkbox" checked={travelerProfile.faceVerification} onChange={() => setTravelerProfile((current) => ({ ...current, faceVerification: !current.faceVerification }))} />
            </label>
            <label className="toggle-row">
              <span>Availability</span>
              <input type="checkbox" checked={travelerProfile.availability} onChange={() => setTravelerProfile((current) => ({ ...current, availability: !current.availability }))} />
            </label>
          </div>
          <div className="status-stack">
            <div className="status-row"><span>Approval</span><strong>{travelerProfile.approval}</strong></div>
            <div className="status-row"><span>Recurring</span><strong>{travelerProfile.recurring}</strong></div>
          </div>
        </article>

        <form className="card form-card" onSubmit={addRoute}>
          <h2>Publish a route</h2>
          <div className="form-grid">
            <input placeholder="Source" value={routeForm.source} onChange={(event) => setRouteForm((current) => ({ ...current, source: event.target.value }))} />
            <input placeholder="Destination" value={routeForm.destination} onChange={(event) => setRouteForm((current) => ({ ...current, destination: event.target.value }))} />
            <input type="time" value={routeForm.departure} onChange={(event) => setRouteForm((current) => ({ ...current, departure: event.target.value }))} />
            <input type="number" min="1" placeholder="Capacity" value={routeForm.capacity} onChange={(event) => setRouteForm((current) => ({ ...current, capacity: Number(event.target.value) }))} />
            <input placeholder="Intermediate stops" value={routeForm.stops} onChange={(event) => setRouteForm((current) => ({ ...current, stops: event.target.value }))} />
            <select value={routeForm.recurring} onChange={(event) => setRouteForm((current) => ({ ...current, recurring: event.target.value }))}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="one-time">One-time</option>
            </select>
            <select value={routeForm.transportType} onChange={(event) => setRouteForm((current) => ({ ...current, transportType: event.target.value }))}>
              {transportTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <button type="submit">Publish Route</button>
          <ul className="list compact route-list">
            {routes.length === 0 && <li>No routes published yet.</li>}
            {routes.slice(0, 4).map((route) => (
              <li key={route.id}>{route.source} → {route.destination} at {route.departure} ({route.capacity} slots) • {route.recurring}</li>
            ))}
          </ul>
        </form>
      </div>

      <div className="grid split bottom-grid">
        <article className="card panel-card">
          <span className="panel-label">Live jobs</span>
          <h2>Latest orders</h2>
          <ul className="job-list">
            {orders.length === 0 && <li>No jobs available yet.</li>}
            {orders.slice(0, 3).map((order) => (
              <li key={order.id} className="job-row">
                <div>
                  <strong>{order.id}</strong>
                  <span>{order.pickup} → {order.drop}</span>
                  <small>{order.status} • Match {order.match}% • {order.paymentStatus}</small>
                </div>
                <div className="job-actions">
                  <button type="button" className="mini" onClick={() => acceptOrder(order.id)}>Accept</button>
                  <button type="button" className="mini ghost" onClick={() => updateOrderStage(order.id)}>Advance</button>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className="card panel-card">
          <span className="panel-label">Signals</span>
          <h2>Notifications</h2>
          <ul className="list compact">
            {notifications.map((notification) => (
              <li key={notification}>{notification}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className="grid split bottom-grid">
        <article className="card panel-card">
          <span className="panel-label">Leaderboard</span>
          <h2>Top travelers</h2>
          <ul className="list compact">
            {topTravelers.map((traveler) => (
              <li key={traveler.name}>{traveler.name} • {traveler.trips} trips • ⭐ {traveler.rating} • {traveler.tier}</li>
            ))}
          </ul>
        </article>

        <article className="card panel-card">
          <span className="panel-label">Availability</span>
          <h2>Live state</h2>
          <div className="status-stack">
            <div className="status-row"><span>Document proof</span><strong>{travelerProfile.idProof}</strong></div>
            <div className="status-row"><span>License proof</span><strong>{travelerProfile.licenseProof}</strong></div>
            <div className="status-row"><span>Availability</span><strong>{travelerProfile.availability ? 'Online' : 'Offline'}</strong></div>
          </div>
        </article>
      </div>
    </PageShell>
  );
}
