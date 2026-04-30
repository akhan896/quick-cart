import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, MapPin, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../api';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const [form, setForm] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
    paymentMethod: 'Credit Card',
  });

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return toast.error('Your cart is empty');
    setLoading(true);
    try {
      const orderData = {
        items: items.map((i) => ({
          product: i._id,
          name: i.name,
          image: i.image,
          price: i.price,
          quantity: i.quantity,
        })),
        shippingAddress: {
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
        },
        paymentMethod: form.paymentMethod,
        totalPrice,
      };
      const { data } = await placeOrder(orderData);
      setOrderId(data._id);
      clearCart();
      setSuccess(true);
      toast.success('Order placed successfully! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="page">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
            <div style={{
              width: 80, height: 80,
              background: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}>
              <CheckCircle size={40} style={{ color: 'var(--success)' }} />
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Order Placed! 🎉</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Thank you for shopping with QuickCart.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>
              Order ID: <code style={{ color: 'var(--accent-light)', background: 'var(--bg-card)', padding: '0.1rem 0.4rem', borderRadius: 4 }}>{orderId}</code>
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/orders" className="btn btn-primary">
                <ShoppingBag size={16} /> View My Orders
              </Link>
              <Link to="/" className="btn btn-secondary">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Checkout</h1>
          <p>Complete your order</p>
        </div>

        <div className="checkout-grid">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Shipping */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={18} style={{ color: 'var(--accent)' }} /> Shipping Address
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label>Street Address</label>
                  <input name="address" className="form-control" placeholder="123 Main Street" value={form.address} onChange={handleChange} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>City</label>
                    <input name="city" className="form-control" placeholder="New York" value={form.city} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Postal Code</label>
                    <input name="postalCode" className="form-control" placeholder="10001" value={form.postalCode} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input name="country" className="form-control" placeholder="United States" value={form.country} onChange={handleChange} required />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCard size={18} style={{ color: 'var(--accent)' }} /> Payment Method
              </h3>
              {['Credit Card', 'Debit Card', 'PayPal', 'Cash on Delivery'].map((method) => (
                <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem', marginBottom: '0.5rem', background: form.paymentMethod === method ? 'rgba(108,99,255,0.1)' : 'var(--bg-secondary)', border: `1px solid ${form.paymentMethod === method ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'var(--transition-fast)' }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={form.paymentMethod === method}
                    onChange={handleChange}
                    style={{ accentColor: 'var(--accent)' }}
                  />
                  <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{method}</span>
                </label>
              ))}
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? 'Placing Order…' : `Place Order — $${totalPrice.toFixed(2)}`}
            </button>
          </form>

          {/* Order Summary */}
          <div className="order-summary-card">
            <h3 style={{ marginBottom: '1.25rem' }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: 320, overflowY: 'auto', marginBottom: '1rem' }}>
              {items.map((item) => (
                <div key={item._id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <img src={item.image} alt={item.name} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }}
                    onError={(e) => { e.target.src = `https://placehold.co/50x50/16161f/6c63ff?text=${encodeURIComponent(item.name.slice(0,2))}`; }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>×{item.quantity}</p>
                  </div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--accent-light)', whiteSpace: 'nowrap' }}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              {[['Subtotal', `$${totalPrice.toFixed(2)}`], ['Shipping', 'Free'], ['Tax', 'Included']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{v}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>Total</span>
                <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '1.4rem', background: 'linear-gradient(135deg, var(--accent-light), #c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
