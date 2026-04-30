import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, LayoutDashboard, Package, ChevronDown, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { userInfo, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <ShoppingCart size={18} />
          </div>
          Quick<span>Cart</span>
        </Link>

        {/* Desktop Links */}
        <div className="navbar-links" style={{ display: 'flex' }}>
          <NavLink to="/" className="nav-link" end>
            <span className="nav-text">Home</span>
          </NavLink>

          <NavLink to="/cart" className="nav-link">
            <ShoppingCart size={17} />
            <span className="nav-text">Cart</span>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </NavLink>

          {userInfo ? (
            <div className="user-menu">
              <button
                className="user-avatar"
                onClick={() => setDropdownOpen((p) => !p)}
                style={{ border: 'none' }}
              >
                {userInfo.name?.charAt(0).toUpperCase()}
              </button>
              {dropdownOpen && (
                <>
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 150 }}
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="user-dropdown">
                    <div style={{ padding: '0.6rem 0.85rem 0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {userInfo.name}
                    </div>
                    <div className="dropdown-divider" />
                    <Link
                      to="/orders"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Package size={15} /> My Orders
                    </Link>
                    {userInfo.isAdmin && (
                      <Link
                        to="/admin"
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <LayoutDashboard size={15} /> Admin Panel
                      </Link>
                    )}
                    <div className="dropdown-divider" />
                    <button className="dropdown-item" onClick={handleLogout} style={{ color: 'var(--danger)' }}>
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <NavLink to="/login" className="btn btn-primary btn-sm">
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
