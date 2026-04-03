import { PageShell } from '../components/PageShell';
import { buildOrderStages } from '../lib/platform';

export function TrackingPage({ role, orders, trackingOrderId, setTrackingOrderId, updateOrderStage, trackingHealth }) {
  const trackedOrder = orders.find((order) => order.id === trackingOrderId) || orders[0];
  const stages = trackedOrder ? buildOrderStages(trackedOrder) : [];

  return (
    <PageShell
      role={role}
      eyebrow="TRACKING"
      title="Live delivery tracking and ETA monitoring"
      subtitle="This screen shows the current order state, live milestones, and delay alerts in one place."
    >
      <div className="grid split">
        <article className="card panel-card">
          <span className="panel-label">Selected order</span>
          <h2>Tracking detail</h2>
          <select value={trackingOrderId} onChange={(event) => setTrackingOrderId(event.target.value)}>
            {orders.length === 0 && <option value="">No orders available</option>}
            {orders.map((order) => (
              <option key={order.id} value={order.id}>{order.id} • {order.pickup} → {order.drop}</option>
            ))}
          </select>
          {trackedOrder ? (
            <>
              <div className="tracking-map">
                <div className="map-pin map-start">Pickup</div>
                <div className="map-route" />
                <div className="map-pin map-end">Drop</div>
              </div>
              <div className="timeline">
                {stages.map((stage) => (
                  <div key={stage.key} className={`timeline-item ${stage.done ? 'done' : ''}`}>
                    <strong>{stage.label}</strong>
                    <small>{stage.done ? 'Completed' : 'Pending'}</small>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p>No order selected yet.</p>
          )}
        </article>

        <article className="card panel-card">
          <span className="panel-label">Telemetry</span>
          <h2>ETA and health</h2>
          <div className="status-stack">
            <div className="status-row"><span>GPS status</span><strong>{trackingHealth.gps}</strong></div>
            <div className="status-row"><span>Network</span><strong>{trackingHealth.network}</strong></div>
            <div className="status-row"><span>ETA</span><strong>{trackingHealth.eta} mins</strong></div>
            <div className="status-row"><span>Delay alert</span><strong>{trackingHealth.delayAlert}</strong></div>
          </div>
          {trackedOrder && (
            <div className="action-row">
              <button type="button" onClick={() => updateOrderStage(trackedOrder.id)}>Advance stage</button>
            </div>
          )}
        </article>
      </div>
    </PageShell>
  );
}
