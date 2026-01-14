import api from './api';

const signup = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  if (response.data) {
    localStorage.setItem('userInfo', JSON.stringify(response.data));
  }
  return response.data;
};

const login = async (userData) => {
  const response = await api.post('/auth/login', userData);
  if (response.data) {
    localStorage.setItem('userInfo', JSON.stringify(response.data));
  }
  return response.data;
};

const googleLogin = async (credential) => {
  const response = await api.post('/auth/google', { token: credential });
  
  if (response.data) {
    localStorage.setItem('userInfo', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('userInfo');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('userInfo'));
};

const updateProfile = async (data) => {
  const response = await api.put('/auth/profile', data);
  if (response.data) {
    const current = getCurrentUser();
    localStorage.setItem('userInfo', JSON.stringify({ ...current, ...response.data }));
  }
  return response.data;
};
const verifyEmail = async (token) => {
  const response = await api.post('/auth/verify-email', { token });
  if (response.data) {
    localStorage.setItem('userInfo', JSON.stringify(response.data));
  }
  return response.data;
};
const contactSupport = async (data) => {
  const response = await api.post('/auth/contact', data);
  return response.data;
};

export default {
  signup,
  login,
  googleLogin,
  logout,
  getCurrentUser,
  updateProfile,
  verifyEmail,
  contactSupport,
};