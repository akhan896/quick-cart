import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag } from 'lucide-react';
import { getMyOrders } from '../api';
import Spinner from '../components/common/Spinner';

const getStatusClass = (status) => {
  const map = { pending: 'status-pending', processing: 'status-processing', shipped: 'status-shipped', delivered: 'status-delivered', cancelled: 'status-cancelled' };
  return map[status] || 'status-pending';
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getMyOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="page"><Spinner text="Loading orders…" /></div>;

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>My Orders</h1>
          <p>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <Package size={72} />
            <h3>No orders yet</h3>
            <p style={{ marginBottom: '1.5rem' }}>Your orders will appear here once you shop.</p>
            <Link to="/" className="btn btn-primary"><ShoppingBag size={16} /> Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Order ID</p>
                    <code style={{ fontSize: '0.82rem', color: 'var(--accent-light)' }}>{order._id}</code>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                    <span className={`status-badge ${getStatusClass(order.status)}`}>● {order.status}</span>
                  </div>
                </div>

                <div className="order-card-body">
                  {/* Items preview */}
                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    {order.items.slice(0, 4).map((item, i) => (
                      <div key={i} style={{ position: 'relative' }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }}
                          onError={(e) => { e.target.src = `https://placehold.co/56x56/16161f/6c63ff?text=${encodeURIComponent(item.name?.slice(0,2))}`; }}
                        />
                        {item.quantity > 1 && (
                          <span style={{ position: 'absolute', top: -4, right: -4, background: 'var(--accent)', color: 'white', fontSize: '0.65rem', fontWeight: 700, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {item.quantity}
                          </span>
                        )}
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div style={{ width: 56, height: 56, borderRadius: 8, background: 'var(--bg-secondary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {order.items.reduce((s, i) => s + i.quantity, 0)} item{order.items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''}
                        {' · '}{order.paymentMethod}
                      </p>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        📍 {order.shippingAddress?.city}, {order.shippingAddress?.country}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total</p>
                      <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '1.15rem', background: 'linear-gradient(135deg, var(--accent-light), #c4b5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        ${order.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
