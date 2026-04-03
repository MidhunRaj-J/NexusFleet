import { PageShell } from '../components/PageShell';

export function LoginPage({ role, auth, setAuth, login }) {
  return (
    <PageShell
      role={role}
      eyebrow="ACCESS"
      title="Sign in to the right workspace"
      subtitle="The app keeps login separate so each user type lands in a focused workspace instead of being dropped into everything at once."
    >
      <div className="grid split">
        <form className="card form-card" onSubmit={login}>
          <h2>Secure access</h2>
          <div className="form-grid single-column">
            <input
              type="email"
              placeholder="Email"
              value={auth.email}
              onChange={(event) => setAuth((current) => ({ ...current, email: event.target.value }))}
            />
            <input
              type="password"
              placeholder="Password"
              value={auth.password}
              onChange={(event) => setAuth((current) => ({ ...current, password: event.target.value }))}
            />
          </div>
          <button type="submit">Sign In</button>
        </form>

        <article className="card panel-card">
          <span className="panel-label">Why this matters</span>
          <h2>Role-specific pages keep the UI calm.</h2>
          <p>
            Customers can book without seeing moderation tools, travelers can publish routes without clutter, and
            admins can stay in a separate operations view.
          </p>
          <div className="status-stack">
            <div className="status-row"><span>Signed in as</span><strong>{auth.email || 'not signed in'}</strong></div>
            <div className="status-row"><span>Current mode</span><strong>{role}</strong></div>
          </div>
        </article>
      </div>
    </PageShell>
  );
}
