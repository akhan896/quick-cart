import { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, Package } from 'lucide-react';
import { fetchProducts } from '../api';
import ProductCard from '../components/common/ProductCard';
import Spinner from '../components/common/Spinner';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys', 'Food', 'Other'];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [inputVal, setInputVal] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      const { data } = await fetchProducts(params);
      setProducts(data.products);
      setPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, category, page]);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(inputVal);
    setPage(1);
  };

  const handleCategory = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="container hero-content">
          <h1>
            Discover Amazing<br />
            <span>Products Today</span>
          </h1>
          <p>Shop the latest electronics, fashion, books, and more — all in one place.</p>

          <form className="search-bar" onSubmit={handleSearch} style={{ maxWidth: 560 }}>
            <div className="search-input-wrapper" style={{ flex: 1 }}>
              <Search size={17} />
              <input
                className="form-control"
                placeholder="Search products…"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
      </section>

      {/* ── Main Content ── */}
      <main className="page">
        <div className="container">
          {/* Category Chips */}
          <div className="filter-chips">
            <SlidersHorizontal size={16} style={{ color: 'var(--text-muted)', alignSelf: 'center' }} />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`chip ${category === cat ? 'active' : ''}`}
                onClick={() => handleCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results info */}
          {!loading && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              {total} product{total !== 1 ? 's' : ''} found
              {search && <> for <strong style={{ color: 'var(--accent-light)' }}>"{search}"</strong></>}
              {search && (
                <button
                  style={{ marginLeft: '0.5rem', color: 'var(--danger)', fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => { setSearch(''); setInputVal(''); setPage(1); }}
                >
                  ✕ Clear
                </button>
              )}
            </p>
          )}

          {/* Grid */}
          {loading ? (
            <Spinner text="Loading products…" />
          ) : products.length === 0 ? (
            <div className="empty-state">
              <Package size={56} />
              <h3>No products found</h3>
              <p>Try a different search or category</p>
            </div>
          ) : (
            <>
              <div className="product-grid">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="pagination">
                  <button
                    className="page-btn"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    ‹
                  </button>
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      className={`page-btn ${p === page ? 'active' : ''}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    className="page-btn"
                    onClick={() => setPage((p) => Math.min(pages, p + 1))}
                    disabled={page === pages}
                  >
                    ›
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default HomePage;
