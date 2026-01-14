import { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = authService.getCurrentUser();
    if (userInfo) {
      setUser(userInfo);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const enhancedUser = { ...userData, role: userData.role || 'user' }; 
    setUser(enhancedUser);

    localStorage.setItem('userInfo', JSON.stringify(enhancedUser));
  };

  const googleLogin = async (credential) => {
    try {
      const data = await authService.googleLogin(credential);
      setUser(data);
      return { success: true };
    } catch (error) {
      console.error("Google Auth Error:", error);
      return { 
        success: false, 
        error: error.response?.data?.message || "Google Login Failed" 
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout,
      googleLogin 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);