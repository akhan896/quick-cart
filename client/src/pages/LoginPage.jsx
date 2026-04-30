import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Eye, EyeOff } from 'lucide-react';
import { loginUser } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      login(data);
      toast.success(`Welcome back, ${data.name}! 👋`);
      navigate(redirect);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="icon-box">
            <ShoppingCart size={26} color="white" />
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to your QuickCart account</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                style={{ paddingRight: '2.8rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-light)', fontWeight: 600 }}>
            Create one
          </Link>
        </p>

        {/* Demo hint */}
        <div style={{
          marginTop: '1.5rem',
          padding: '0.85rem',
          background: 'rgba(108, 99, 255, 0.08)',
          border: '1px solid rgba(108, 99, 255, 0.2)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
        }}>
          <strong style={{ color: 'var(--accent-light)' }}>Demo Admin:</strong><br />
          admin@quickcart.com / admin123
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
