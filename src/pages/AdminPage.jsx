import { PageShell } from '../components/PageShell';

export function AdminPage({ role, users, disputes, approveKyc, resolveDispute }) {
  return (
    <PageShell
      role={role}
      eyebrow="ADMIN OPERATIONS"
      title="Trust, KYC, and disputes live on their own page"
      subtitle="Moderation tools stay separated from customer and traveler flows so the workspace feels calmer and more precise."
    >
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
                {user.kyc === 'pending' && (
                  <button type="button" className="mini" onClick={() => approveKyc(user.id)}>Approve</button>
                )}
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
    </PageShell>
  );
}
