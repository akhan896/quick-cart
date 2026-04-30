import { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, userInfo: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, userInfo: null, isAuthenticated: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const stored = localStorage.getItem('userInfo');
  const [state, dispatch] = useReducer(authReducer, {
    userInfo: stored ? JSON.parse(stored) : null,
    isAuthenticated: !!stored,
  });

  const login = (userData) => {
    localStorage.setItem('userInfo', JSON.stringify(userData));
    dispatch({ type: 'LOGIN', payload: userData });
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
