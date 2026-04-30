import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const renderStars = (rating) => {
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} style={{ color: i < Math.round(rating) ? 'var(--warning)' : 'var(--text-muted)' }}>★</span>
  ));
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stock === 0) return;
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`, {
      style: {
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border)',
      },
      iconTheme: { primary: 'var(--accent)', secondary: 'white' },
    });
  };

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="img-wrapper">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://placehold.co/500x500/16161f/6c63ff?text=${encodeURIComponent(product.name.slice(0, 2))}`;
          }}
        />
        <span className="badge">{product.category}</span>
        {product.stock === 0 && <span className="out-of-stock-badge">Out of Stock</span>}
      </div>
      <div className="body">
        <p className="category-tag">{product.category}</p>
        <h3 className="name">{product.name}</h3>
        <div className="rating">
          {renderStars(product.rating)}
          <span>({product.numReviews?.toLocaleString()})</span>
        </div>
        <div className="footer">
          <span className="price">${product.price.toFixed(2)}</span>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart size={15} />
            Add
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
