import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  Plus, Pencil, Trash2, X, Check, TrendingUp, DollarSign
} from 'lucide-react';
import {
  fetchProducts, createProduct, updateProduct, deleteProduct,
  getAllOrders, updateOrderStatus, getAllUsers
} from '../api';
import Spinner from '../components/common/Spinner';
import toast from 'react-hot-toast';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys', 'Food', 'Other'];
const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const getStatusClass = (s) => ({ pending: 'status-pending', processing: 'status-processing', shipped: 'status-shipped', delivered: 'status-delivered', cancelled: 'status-cancelled' }[s] || 'status-pending');

const emptyProduct = { name: '', description: '', price: '', category: 'Electronics', image: '', stock: '' };

const AdminPage = () => {
  const [tab, setTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'create' | 'edit'
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [pRes, oRes, uRes] = await Promise.all([fetchProducts({ limit: 100 }), getAllOrders(), getAllUsers()]);
      setProducts(pRes.data.products);
      setOrders(oRes.data);
      setUsers(uRes.data);
    } catch (err) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(emptyProduct); setEditTarget(null); setModal('product'); };
  const openEdit = (p) => { setForm({ name: p.name, description: p.description, price: p.price, category: p.category, image: p.image, stock: p.stock }); setEditTarget(p._id); setModal('product'); };
  const closeModal = () => { setModal(null); setEditTarget(null); };

  const handleFormChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (editTarget) {
        await updateProduct(editTarget, payload);
        toast.success('Product updated!');
      } else {
        await createProduct(payload);
        toast.success('Product created!');
      }
      closeModal();
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
      load();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, status } : o));
      toast.success('Order status updated');
    } catch {
      toast.error('Update failed');
    }
  };

  // Stats
  const totalRevenue = orders.reduce((s, o) => s + o.totalPrice, 0);
  const stats = [
    { label: 'Total Revenue', value: `$${totalRevenue.toFixed(0)}`, icon: DollarSign, color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
    { label: 'Orders', value: orders.length, icon: ShoppingBag, color: 'var(--accent-light)', bg: 'rgba(108,99,255,0.12)' },
    { label: 'Products', value: products.length, icon: Package, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    { label: 'Users', value: users.length, icon: Users, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  ];

  const TAB_BTN = (id, label, Icon) => (
    <button
      key={id}
      onClick={() => setTab(id)}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)',
        fontWeight: 600, fontSize: '0.88rem',
        background: tab === id ? 'linear-gradient(135deg, var(--accent), var(--accent-dark))' : 'var(--bg-glass)',
        color: tab === id ? 'white' : 'var(--text-secondary)',
        border: `1px solid ${tab === id ? 'transparent' : 'var(--border)'}`,
        cursor: 'pointer', transition: 'var(--transition-fast)',
      }}
    >
      <Icon size={16} /> {label}
    </button>
  );

  return (
    <div className="page">
      <div className="container">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage your store</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {TAB_BTN('dashboard', 'Dashboard', LayoutDashboard)}
            {TAB_BTN('products', 'Products', Package)}
            {TAB_BTN('orders', 'Orders', ShoppingBag)}
            {TAB_BTN('users', 'Users', Users)}
          </div>
        </div>

        {loading ? <Spinner text="Loading data…" /> : (
          <>
            {/* ── DASHBOARD TAB ── */}
            {tab === 'dashboard' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                  {stats.map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="stat-card">
                      <div className="stat-icon" style={{ background: bg }}>
                        <Icon size={22} style={{ color }} />
                      </div>
                      <div className="stat-content">
                        <div className="stat-value" style={{ color }}>{value}</div>
                        <div className="stat-label">{label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ marginBottom: '1rem' }}>Recent Orders</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map((o) => (
                          <tr key={o._id}>
                            <td><code style={{ color: 'var(--accent-light)', fontSize: '0.78rem' }}>{o._id.slice(-8)}</code></td>
                            <td>{o.user?.name || 'N/A'}</td>
                            <td style={{ color: 'var(--success)', fontWeight: 600 }}>${o.totalPrice.toFixed(2)}</td>
                            <td><span className={`status-badge ${getStatusClass(o.status)}`}>● {o.status}</span></td>
                            <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── PRODUCTS TAB ── */}
            {tab === 'products' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                  <button className="btn btn-primary" onClick={openCreate}>
                    <Plus size={16} /> Add Product
                  </button>
                </div>
                <div className="card" style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p._id}>
                          <td>
                            <img src={p.image} alt={p.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8 }}
                              onError={(e) => { e.target.src = `https://placehold.co/44x44/16161f/6c63ff?text=${encodeURIComponent(p.name.slice(0,2))}`; }}
                            />
                          </td>
                          <td style={{ fontWeight: 600, color: 'var(--text-primary)', maxWidth: 200 }}>
                            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                          </td>
                          <td><span className="chip" style={{ cursor: 'default' }}>{p.category}</span></td>
                          <td style={{ color: 'var(--accent-light)', fontWeight: 700 }}>${p.price.toFixed(2)}</td>
                          <td>
                            <span style={{ color: p.stock === 0 ? 'var(--danger)' : p.stock < 10 ? 'var(--warning)' : 'var(--success)', fontWeight: 600 }}>
                              {p.stock}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>
                                <Pencil size={13} />
                              </button>
                              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id, p.name)}>
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── ORDERS TAB ── */}
            {tab === 'orders' && (
              <div className="card" style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr><th>ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o._id}>
                        <td><code style={{ color: 'var(--accent-light)', fontSize: '0.78rem' }}>{o._id.slice(-8)}</code></td>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{o.user?.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{o.user?.email}</div>
                        </td>
                        <td>{o.items.reduce((s, i) => s + i.quantity, 0)} items</td>
                        <td style={{ color: 'var(--success)', fontWeight: 700 }}>${o.totalPrice.toFixed(2)}</td>
                        <td>
                          <select
                            value={o.status}
                            onChange={(e) => handleStatusChange(o._id, e.target.value)}
                            className="form-control"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem', width: 'auto', minWidth: 110 }}
                          >
                            {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                        <td style={{ fontSize: '0.8rem' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── USERS TAB ── */}
            {tab === 'users' && (
              <div className="card" style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            {u.name}
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          {u.isAdmin ? (
                            <span className="status-badge" style={{ background: 'rgba(108,99,255,0.15)', color: 'var(--accent-light)' }}>● Admin</span>
                          ) : (
                            <span className="status-badge status-pending">● User</span>
                          )}
                        </td>
                        <td style={{ fontSize: '0.8rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── PRODUCT MODAL ── */}
      {modal === 'product' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: '1rem', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '2rem', width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3>{editTarget ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={closeModal} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Product Name</label>
                <input name="name" className="form-control" value={form.name} onChange={handleFormChange} required placeholder="e.g. Sony WH-1000XM5" />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" className="form-control" rows={3} value={form.description} onChange={handleFormChange} required placeholder="Product description…" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Price ($)</label>
                  <input name="price" type="number" step="0.01" min="0" className="form-control" value={form.price} onChange={handleFormChange} required placeholder="0.00" />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input name="stock" type="number" min="0" className="form-control" value={form.stock} onChange={handleFormChange} required placeholder="0" />
                </div>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" className="form-control" value={form.category} onChange={handleFormChange}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input name="image" className="form-control" value={form.image} onChange={handleFormChange} required placeholder="https://images.unsplash.com/…" />
              </div>
              {form.image && (
                <img src={form.image} alt="preview" style={{ height: 100, objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
                  <Check size={16} /> {saving ? 'Saving…' : editTarget ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
