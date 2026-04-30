const Spinner = ({ size = 40, text = '' }) => (
  <div className="loading-wrapper" style={{ flexDirection: 'column', gap: '1rem' }}>
    <div className="spinner" style={{ width: size, height: size }} />
    {text && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{text}</p>}
  </div>
);

export default Spinner;
