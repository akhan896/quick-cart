import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state">
            <ShoppingCart size={72} />
            <h3>Your cart is empty</h3>
            <p style={{ marginBottom: '1.5rem' }}>Looks like you haven't added anything yet.</p>
            <Link to="/" className="btn btn-primary">
              <ShoppingBag size={17} /> Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Shopping Cart</h1>
          <p>{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="checkout-grid">
          {/* Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map((item) => (
              <div key={item._id} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = `https://placehold.co/90x90/16161f/6c63ff?text=${encodeURIComponent(item.name.slice(0, 2))}`;
                  }}
                />
                <div>
                  <Link
                    to={`/products/${item._id}`}
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem', display: 'block' }}
                  >
                    {item.name}
                  </Link>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>{item.category}</p>
                  <div className="cart-item-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                      <span className="qty-value">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontWeight: 800,
                    fontSize: '1.15rem',
                    background: 'linear-gradient(135deg, var(--accent-light), #c4b5fd)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.25rem' }}>
                    ${item.price.toFixed(2)} each
                  </p>
                </div>
              </div>
            ))}

            <button
              className="btn btn-secondary btn-sm"
              style={{ alignSelf: 'flex-start' }}
              onClick={clearCart}
            >
              <Trash2 size={14} /> Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="order-summary-card">
            <h3 style={{ marginBottom: '1.25rem' }}>Order Summary</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {items.map((item) => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{item.name} × {item.quantity}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>Total</span>
                <span style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontWeight: 800,
                  fontSize: '1.5rem',
                  background: 'linear-gradient(135deg, var(--accent-light), #c4b5fd)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.25rem' }}>Free shipping on all orders</p>
            </div>

            <button className="btn btn-primary btn-full btn-lg" onClick={handleCheckout}>
              Proceed to Checkout <ArrowRight size={17} />
            </button>
            <Link to="/" className="btn btn-secondary btn-full" style={{ marginTop: '0.75rem', justifyContent: 'center' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
