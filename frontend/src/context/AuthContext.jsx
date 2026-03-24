import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null);
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const { data } = await loginAdmin({ email, password });
      localStorage.setItem('adminToken', data.token);
      setToken(data.token);
      navigate('/admin/overview');
      toast.success('Welcome back!');
    } catch {
      toast.error('Invalid credentials');
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    navigate('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuth: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);