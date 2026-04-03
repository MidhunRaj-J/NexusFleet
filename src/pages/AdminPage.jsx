import { PageShell } from '../components/PageShell';

export function AdminPage({ role, users, disputes, approveKyc, resolveDispute, suspendUser, analytics, orders, transactions }) {
  return (
    <PageShell
      role={role}
      eyebrow="ADMIN OPERATIONS"
      title="User management, analytics, finance, disputes, and security live here"
      subtitle="This page now brings together the admin functions that were requested across moderation, analytics, and risk control."
    >
      <div className="grid three analytics-grid">
        <article className="card mini-card"><h3>Total users</h3><strong>{analytics.totalUsers}</strong></article>
        <article className="card mini-card"><h3>Active deliveries</h3><strong>{analytics.activeDeliveries}</strong></article>
        <article className="card mini-card"><h3>Revenue</h3><strong>₹{analytics.revenue}</strong></article>
      </div>

      <div className="grid split">
        <article className="card panel-card">
          <span className="panel-label">KYC review</span>
          <h2>User moderation</h2>
          <ul className="list compact admin-list">
            {users.map((user) => (
              <li key={user.id}>
                <div>
                  <strong>{user.id}</strong>
                  <span>{user.name} • {user.role} • KYC: {user.kyc}</span>
                </div>
                <div className="job-actions">
                  {user.kyc === 'pending' && <button type="button" className="mini" onClick={() => approveKyc(user.id)}>Approve</button>}
                  <button type="button" className="mini ghost" onClick={() => suspendUser(user.id)}>Suspend</button>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className="card panel-card">
          <span className="panel-label">Disputes</span>
          <h2>Resolution desk</h2>
          <ul className="list compact admin-list">
            {disputes.length === 0 && <li>No disputes currently open.</li>}
            {disputes.map((dispute) => (
              <li key={dispute.id}>
                <div>
                  <strong>{dispute.id}</strong>
                  <span>Order {dispute.orderId} • {dispute.reason} • {dispute.status}</span>
                </div>
                {dispute.status === 'open' && (
                  <button type="button" className="mini" onClick={() => resolveDispute(dispute.id)}>Resolve</button>
                )}
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="grid split bottom-grid">
        <article className="card panel-card">
          <span className="panel-label">Orders and finance</span>
          <h2>Platform controls</h2>
          <div className="status-stack">
            <div className="status-row"><span>Orders</span><strong>{orders.length}</strong></div>
            <div className="status-row"><span>Transactions</span><strong>{transactions.length}</strong></div>
            <div className="status-row"><span>Open disputes</span><strong>{analytics.openDisputes}</strong></div>
            <div className="status-row"><span>Refunds</span><strong>₹{analytics.refunds}</strong></div>
          </div>
        </article>

        <article className="card panel-card">
          <span className="panel-label">Security</span>
          <h2>Risk posture</h2>
          <ul className="list compact">
            <li>Data encryption: enabled in production architecture</li>
            <li>Fraud detection: simulated by restricted item checks</li>
            <li>Rate limiting: backend required</li>
            <li>Secure APIs: backend required</li>
          </ul>
        </article>
      </div>
    </PageShell>
  );
}
