import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye, EyeOff, UserPlus } from 'lucide-react';
import { registerUser } from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      return toast.error('Passwords do not match');
    }
    if (form.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      const { data } = await registerUser({ name: form.name, email: form.email, password: form.password });
      login(data);
      toast.success(`Welcome to QuickCart, ${data.name}! 🎉`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="icon-box">
            <UserPlus size={26} color="white" />
          </div>
          <h2>Create Account</h2>
          <p>Join QuickCart and start shopping</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input id="name" name="name" className="form-control" placeholder="John Doe" value={form.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input id="email" name="email" type="email" className="form-control" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Min. 6 characters"
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

          <div className="form-group">
            <label htmlFor="confirm">Confirm Password</label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              className="form-control"
              placeholder="Repeat your password"
              value={form.confirm}
              onChange={handleChange}
              required
              style={{ borderColor: form.confirm && form.confirm !== form.password ? 'var(--danger)' : '' }}
            />
            {form.confirm && form.confirm !== form.password && (
              <span style={{ color: 'var(--danger)', fontSize: '0.78rem' }}>Passwords don't match</span>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: '0.25rem' }}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-light)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
