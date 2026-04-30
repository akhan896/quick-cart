import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
        <div className="logo-icon" style={{ width: 24, height: 24, background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShoppingCart size={13} color="white" />
        </div>
        <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, color: 'var(--text-secondary)' }}>QuickCart</span>
      </div>
      <p>© {new Date().getFullYear()} QuickCart. Built with ❤️ using MERN stack.</p>
    </div>
  </footer>
);

export default Footer;
