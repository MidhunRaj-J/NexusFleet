import { Link, NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/auth', label: 'Login' },
  { to: '/profile', label: 'Profile' },
  { to: '/customer', label: 'Customer' },
  { to: '/tracking', label: 'Tracking' },
  { to: '/payments', label: 'Payments' },
  { to: '/traveler', label: 'Traveler' },
  { to: '/admin', label: 'Admin' },
];

export function PageShell({ role, title, subtitle, eyebrow, children, actions, footer }) {
  return (
    <div className={`app-shell theme-${role}`}>
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <header className="topbar">
        <Link to="/" className="brand-mark" aria-label="NexusFleet home">
          <span className="brand-orb" />
          <span>
            <strong>NexusFleet</strong>
            <small>Refined logistics operations</small>
          </span>
        </Link>

        <nav className="main-nav" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="role-chip">{role.toUpperCase()} MODE</div>
      </header>

      <main className="page-frame">
        <section className="page-hero card">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          {actions ? <div className="hero-actions">{actions}</div> : null}
        </section>

        <section className="page-content fade-in">{children}</section>

        {footer ? <section className="page-footer fade-in">{footer}</section> : null}
      </main>
    </div>
  );
}
