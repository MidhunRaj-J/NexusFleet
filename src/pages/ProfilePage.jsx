import { PageShell } from '../components/PageShell';
import { DEFAULT_ADDRESSES, LANGUAGE_OPTIONS, NOTIFICATION_CHANNELS } from '../lib/platform';

export function ProfilePage({ role, profile, setProfile, sessions, setSessions, logoutAllDevices }) {
  const updateAddress = (addressId) => {
    setProfile((current) => ({
      ...current,
      defaultAddressId: addressId,
      addresses: current.addresses.map((address) => ({
        ...address,
        isDefault: address.id === addressId,
      })),
    }));
  };

  return (
    <PageShell
      role={role}
      eyebrow="PROFILE"
      title="Manage identity, saved addresses, and notification preferences"
      subtitle="Manage your account details, trusted devices, addresses, and notification preferences in one profile center."
    >
      <div className="grid split">
        <form className="card form-card">
          <h2>Identity</h2>
          <div className="form-grid single-column">
            <input
              placeholder="Full name"
              value={profile.name}
              onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))}
            />
            <input
              placeholder="Phone"
              value={profile.phone}
              onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))}
            />
            <input
              placeholder="Email"
              value={profile.email}
              onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))}
            />
            <input
              placeholder="Photo URL"
              value={profile.photoUrl}
              onChange={(event) => setProfile((current) => ({ ...current, photoUrl: event.target.value }))}
            />
            <select
              value={profile.language}
              onChange={(event) => setProfile((current) => ({ ...current, language: event.target.value }))}
            >
              {LANGUAGE_OPTIONS.map((language) => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          </div>
          <div className="badge-row">
            {NOTIFICATION_CHANNELS.map((channel) => (
              <label key={channel} className="chip-toggle">
                <input
                  type="checkbox"
                  checked={profile.notifications.includes(channel)}
                  onChange={() => setProfile((current) => ({
                    ...current,
                    notifications: current.notifications.includes(channel)
                      ? current.notifications.filter((item) => item !== channel)
                      : [...current.notifications, channel],
                  }))}
                />
                <span>{channel}</span>
              </label>
            ))}
          </div>
        </form>

        <article className="card panel-card">
          <span className="panel-label">Saved addresses</span>
          <h2>Address book</h2>
          <div className="stack-list">
            {[...profile.addresses, ...DEFAULT_ADDRESSES.filter((item) => !profile.addresses.some((address) => address.id === item.id))].map((address) => (
              <button key={address.id} type="button" className={`address-card ${profile.defaultAddressId === address.id ? 'active' : ''}`} onClick={() => updateAddress(address.id)}>
                <strong>{address.label}</strong>
                <span>{address.address}</span>
              </button>
            ))}
          </div>
          <div className="status-stack">
            <div className="status-row"><span>Default address</span><strong>{profile.defaultAddressId}</strong></div>
            <div className="status-row"><span>Language</span><strong>{profile.language}</strong></div>
          </div>
        </article>
      </div>

      <div className="grid split bottom-grid">
        <article className="card panel-card">
          <span className="panel-label">Security</span>
          <h2>Session devices</h2>
          <ul className="list compact admin-list">
            {sessions.map((device) => (
              <li key={device.id}>
                <div>
                  <strong>{device.name}</strong>
                  <span>{device.location} • {device.lastSeen}</span>
                </div>
                {device.suspicious && <span className="warning-pill">Suspicious</span>}
              </li>
            ))}
          </ul>
          <button type="button" className="hero-button ghost" onClick={logoutAllDevices}>Logout from all devices</button>
        </article>

        <article className="card panel-card">
          <span className="panel-label">Account center</span>
          <h2>Profile and security overview</h2>
          <p>
            Keep your account details, preferred channels, trusted devices, and default addresses up to date in one place.
          </p>
        </article>
      </div>
    </PageShell>
  );
}
