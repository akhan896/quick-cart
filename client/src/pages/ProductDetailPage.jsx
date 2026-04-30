import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Star, Package, CheckCircle } from 'lucide-react';
import { fetchProduct } from '../api';
import { useCart } from '../context/CartContext';
import Spinner from '../components/common/Spinner';
import toast from 'react-hot-toast';

const renderStars = (rating) =>
  Array.from({ length: 5 }, (_, i) => (
    <span key={i} style={{ fontSize: '1.3rem', color: i < Math.round(rating) ? 'var(--warning)' : 'var(--text-muted)' }}>★</span>
  ));

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await fetchProduct(id);
        setProduct(data);
      } catch {
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    toast.success(`${product.name} added to cart!`, {
      style: { background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' },
      iconTheme: { primary: 'var(--accent)', secondary: 'white' },
    });
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div className="page"><Spinner text="Loading product…" /></div>;
  if (!product) return null;

  return (
    <div className="page">
      <div className="container">
        <Link to="/" className="btn btn-secondary btn-sm" style={{ marginBottom: '2rem', display: 'inline-flex' }}>
          <ArrowLeft size={16} /> Back to Store
        </Link>

        <div className="product-detail-grid">
          {/* Image */}
          <div className="product-detail-img">
            <img
              src={product.image}
              alt={product.name}
              onError={(e) => {
                e.target.src = `https://placehold.co/600x600/16161f/6c63ff?text=${encodeURIComponent(product.name.slice(0, 2))}`;
              }}
            />
          </div>

          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-light)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {product.category}
              </span>
              <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginTop: '0.5rem' }}>{product.name}</h1>
            </div>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ display: 'flex' }}>{renderStars(product.rating)}</div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                {product.rating} ({product.numReviews?.toLocaleString()} reviews)
              </span>
            </div>

            {/* Price */}
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              background: 'linear-gradient(135deg, var(--accent-light), #c4b5fd)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              ${product.price.toFixed(2)}
            </div>

            {/* Description */}
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{product.description}</p>

            {/* Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
              {product.stock > 0 ? (
                <>
                  <CheckCircle size={16} style={{ color: 'var(--success)' }} />
                  <span style={{ color: 'var(--success)' }}>In Stock</span>
                  <span style={{ color: 'var(--text-muted)' }}>({product.stock} available)</span>
                </>
              ) : (
                <>
                  <Package size={16} style={{ color: 'var(--danger)' }} />
                  <span style={{ color: 'var(--danger)' }}>Out of Stock</span>
                </>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            {product.stock > 0 && (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                  <span className="qty-value">{qty}</span>
                  <button className="qty-btn" onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>+</button>
                </div>
                <button
                  className={`btn btn-primary btn-lg`}
                  style={{ flex: 1, minWidth: 200 }}
                  onClick={handleAdd}
                >
                  {added ? <CheckCircle size={18} /> : <ShoppingCart size={18} />}
                  {added ? 'Added to Cart!' : 'Add to Cart'}
                </button>
              </div>
            )}

            {/* Meta */}
            <div className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                ['Category', product.category],
                ['Stock', product.stock > 0 ? `${product.stock} units` : 'Out of stock'],
                ['Rating', `${product.rating}/5 from ${product.numReviews?.toLocaleString()} reviews`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
