import { useNavigate } from 'react-router-dom';
import { AnimatedNumber } from '../components/AnimatedNumber';
import { PageShell } from '../components/PageShell';

export function LandingPage({ role, setRole, roleInfo, ordersCount, routeCount, disputeCount, activeEscrow }) {
  const navigate = useNavigate();

  const openRole = (nextRole) => {
    setRole(nextRole);
    navigate(`/${nextRole}`);
  };

  return (
    <PageShell
      role={role}
      eyebrow="NEXUSFLEET PLATFORM"
      title="A cleaner logistics product with distinct pages for each workflow"
      subtitle="Customers book deliveries, travelers publish routes, and admins manage trust in focused spaces instead of one crowded screen."
      actions={(
        <>
          <button type="button" className="hero-button" onClick={() => openRole('customer')}>Open Customer Flow</button>
          <button type="button" className="hero-button ghost" onClick={() => openRole('traveler')}>Open Traveler Flow</button>
        </>
      )}
      footer={(
        <div className="hero-strip">
          <div>
            <strong><AnimatedNumber value={ordersCount} /></strong>
            <span>Orders</span>
          </div>
          <div>
            <strong><AnimatedNumber value={routeCount} /></strong>
            <span>Routes</span>
          </div>
          <div>
            <strong><AnimatedNumber value={disputeCount} /></strong>
            <span>Open disputes</span>
          </div>
          <div>
            <strong><AnimatedNumber value={activeEscrow} /></strong>
            <span>Escrow locked</span>
          </div>
        </div>
      )}
    >
      <div className="grid split">
        <article className="card panel-card">
          <span className="panel-label">Refined structure</span>
          <h2>Each audience gets its own page.</h2>
          <p>
            The interface now separates customer booking, traveler operations, and admin review so the app feels more
            like a product and less like an all-in-one demo board.
          </p>
        </article>
        <article className="card panel-card accent-panel">
          <span className="panel-label">Current mode</span>
          <h2>{roleInfo.title}</h2>
          <p>{roleInfo.subtitle}</p>
        </article>
      </div>

      <div className="grid three feature-grid">
        <article className="card mini-card">
          <h3>Customer flow</h3>
          <p>Dedicated booking, pricing, and order history pages.</p>
        </article>
        <article className="card mini-card">
          <h3>Traveler flow</h3>
          <p>Route publishing, acceptance actions, and performance signals.</p>
        </article>
        <article className="card mini-card">
          <h3>Admin flow</h3>
          <p>KYC review, dispute resolution, and moderation tools.</p>
        </article>
      </div>
    </PageShell>
  );
}
