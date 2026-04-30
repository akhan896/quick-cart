import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, userInfo } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!userInfo?.isAdmin) return <Navigate to="/" replace />;
  return children;
};
