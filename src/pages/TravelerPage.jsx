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
}) {
  return (
    <PageShell
      role={role}
      eyebrow="TRAVELER OPERATIONS"
      title="A dedicated workspace for publishing routes and accepting jobs"
      subtitle="Travelers should see trip opportunities, earnings context, and route publishing tools without the rest of the platform crowding the view."
      actions={(
        <div className="status-stack compact-stack">
          <div className="status-row"><span>Rewards</span><strong>{rewardsPoints}</strong></div>
          <div className="status-row"><span>Tier</span><strong>{loyaltyTier}</strong></div>
        </div>
      )}
    >
      <div className="grid split">
        <form className="card form-card" onSubmit={addRoute}>
          <h2>Publish a route</h2>
          <div className="form-grid">
            <input placeholder="Source" value={routeForm.source} onChange={(event) => setRouteForm((current) => ({ ...current, source: event.target.value }))} />
            <input placeholder="Destination" value={routeForm.destination} onChange={(event) => setRouteForm((current) => ({ ...current, destination: event.target.value }))} />
            <input type="time" value={routeForm.departure} onChange={(event) => setRouteForm((current) => ({ ...current, departure: event.target.value }))} />
            <input type="number" min="1" placeholder="Capacity" value={routeForm.capacity} onChange={(event) => setRouteForm((current) => ({ ...current, capacity: Number(event.target.value) }))} />
          </div>
          <button type="submit">Publish Route</button>
          <ul className="list compact route-list">
            {routes.length === 0 && <li>No routes published yet.</li>}
            {routes.slice(0, 4).map((route) => (
              <li key={route.id}>{route.source} → {route.destination} at {route.departure} ({route.capacity} slots)</li>
            ))}
          </ul>
        </form>

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
                  <small>{order.status} • Match {order.match}%</small>
                </div>
                <div className="job-actions">
                  <button type="button" className="mini" onClick={() => acceptOrder(order.id)}>Accept</button>
                  <button type="button" className="mini ghost" onClick={() => updateOrderStage(order.id)}>Advance</button>
                </div>
              </li>
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
          <span className="panel-label">Signals</span>
          <h2>Notifications</h2>
          <ul className="list compact">
            {notifications.map((notification) => (
              <li key={notification}>{notification}</li>
            ))}
          </ul>
        </article>
      </div>
    </PageShell>
  );
}
