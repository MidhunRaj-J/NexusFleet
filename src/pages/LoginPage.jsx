import { PageShell } from '../components/PageShell';

export function LoginPage({ role, auth, setAuth, login, sendOtp, resetPassword, socialLogin }) {
  const setField = (field, value) => setAuth((current) => ({ ...current, [field]: value }));

  return (
    <PageShell
      role={role}
      eyebrow="AUTHENTICATION"
      title="Login, register, verify, and reset from one dedicated page"
      subtitle="The app now keeps authentication separate from booking and operations, with OTP and social sign-in controls exposed in the UI."
    >
      <div className="grid split">
        <form className="card form-card" onSubmit={login}>
          <div className="section-header">
            <h2>{auth.mode === 'register' ? 'Create account' : 'Sign in'}</h2>
            <div className="segmented-control">
              <button type="button" className={auth.mode === 'login' ? 'active' : ''} onClick={() => setField('mode', 'login')}>Login</button>
              <button type="button" className={auth.mode === 'register' ? 'active' : ''} onClick={() => setField('mode', 'register')}>Register</button>
            </div>
          </div>

          <div className="form-grid single-column">
            <input type="email" placeholder="Email" value={auth.email} onChange={(event) => setField('email', event.target.value)} />
            <input type="tel" placeholder="Phone" value={auth.phone} onChange={(event) => setField('phone', event.target.value)} />
            <input type="password" placeholder="Password" value={auth.password} onChange={(event) => setField('password', event.target.value)} />
            <input type="text" placeholder="OTP" value={auth.otp} onChange={(event) => setField('otp', event.target.value)} />
          </div>

          <div className="action-row">
            <button type="button" className="ghost" onClick={sendOtp}>Send OTP</button>
            <button type="button" className="ghost" onClick={resetPassword}>Password reset</button>
            <button type="button" className="ghost" onClick={socialLogin}>Continue with {auth.social}</button>
          </div>

          <button type="submit">{auth.mode === 'register' ? 'Register account' : 'Sign in'}</button>
        </form>

        <article className="card panel-card">
          <span className="panel-label">Security</span>
          <h2>Session and verification</h2>
          <div className="status-stack">
            <div className="status-row"><span>Current mode</span><strong>{auth.mode}</strong></div>
            <div className="status-row"><span>Verified OTP</span><strong>{auth.otp || 'pending'}</strong></div>
            <div className="status-row"><span>Role context</span><strong>{role}</strong></div>
          </div>
          <p>
            This is a frontend simulation of email/phone verification, password reset, and social login. JWTs,
            device trust, and suspicious-login alerts need a backend service.
          </p>
        </article>
      </div>
    </PageShell>
  );
}
