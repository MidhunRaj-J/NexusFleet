export function FormField({ label, error, children, required = false, className = '' }) {
  return (
    <div className={`form-field ${className}`} style={{ marginBottom: '16px' }}>
      <label style={{
        display: 'block',
        marginBottom: '6px',
        fontWeight: 500,
        fontSize: '14px',
        color: '#333',
      }}>
        {label}
        {required && <span style={{ color: '#d32f2f' }}> *</span>}
      </label>
      {children}
      {error && (
        <p style={{
          margin: '6px 0 0 0',
          fontSize: '12px',
          color: '#d32f2f',
        }}>
          {error}
        </p>
      )}
    </div>
  );
}
