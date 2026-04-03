import { AnimatedNumber } from '../components/AnimatedNumber';
import { PageShell } from '../components/PageShell';

export function CustomerPage({
  role,
  booking,
  setBooking,
  createOrder,
  orders,
  bestMatch,
  dynamicPrice,
  activeEscrow,
  delivered,
}) {
  return (
    <PageShell
      role={role}
      eyebrow="CUSTOMER WORKSPACE"
      title="Book deliveries from a clean customer-first page"
      subtitle="Create a shipment, review the live traveler match, and monitor your own order history without the admin noise."
      actions={(
        <div className="hero-metrics">
          <div><strong>₹<AnimatedNumber value={dynamicPrice} decimals={2} /></strong><span>Price</span></div>
          <div><strong><AnimatedNumber value={bestMatch.score} />%</strong><span>Match</span></div>
          <div><strong><AnimatedNumber value={activeEscrow} /></strong><span>Escrow</span></div>
        </div>
      )}
    >
      <div className="grid split">
        <form className="card form-card" onSubmit={createOrder}>
          <h2>Create delivery order</h2>
          <div className="form-grid">
            <input placeholder="Pickup location" value={booking.pickup} onChange={(event) => setBooking((current) => ({ ...current, pickup: event.target.value }))} />
            <input placeholder="Drop location" value={booking.drop} onChange={(event) => setBooking((current) => ({ ...current, drop: event.target.value }))} />
            <input type="number" min="1" placeholder="Weight (kg)" value={booking.weight} onChange={(event) => setBooking((current) => ({ ...current, weight: Number(event.target.value) }))} />
            <input type="number" min="1" placeholder="Distance (km)" value={booking.distance} onChange={(event) => setBooking((current) => ({ ...current, distance: Number(event.target.value) }))} />
            <input type="number" min="1" placeholder="Capacity needed" value={booking.capacity} onChange={(event) => setBooking((current) => ({ ...current, capacity: Number(event.target.value) }))} />
            <select value={booking.urgency} onChange={(event) => setBooking((current) => ({ ...current, urgency: event.target.value }))}>
              <option value="standard">Standard</option>
              <option value="express">Express</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
          <div className="metrics">
            <p>Dynamic Price: <strong>₹{dynamicPrice.toFixed(2)}</strong></p>
            <p>Best Traveler: <strong>{bestMatch.traveler}</strong></p>
            <p>Match Score: <strong>{bestMatch.score}%</strong></p>
            <p>ETA: <strong>{bestMatch.eta} mins</strong></p>
          </div>
          <button type="submit">Create Order and Lock Escrow</button>
        </form>

        <article className="card panel-card">
          <span className="panel-label">Order history</span>
          <h2>Recent shipments</h2>
          <div className="timeline">
            {orders.length === 0 && <p>No orders yet. Create one to start tracking.</p>}
            {orders.slice(0, 4).map((order) => (
              <div key={order.id} className="timeline-item">
                <strong>{order.id}</strong>
                <span>{order.pickup} → {order.drop}</span>
                <small>{order.status} • {order.proof}</small>
              </div>
            ))}
          </div>
          <div className="status-stack">
            <div className="status-row"><span>Delivered</span><strong>{delivered}</strong></div>
            <div className="status-row"><span>Escrow locked</span><strong>{activeEscrow}</strong></div>
          </div>
        </article>
      </div>
    </PageShell>
  );
}
