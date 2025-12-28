import api from './api'; // [FIX] Changed from '../api' to './api'

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

const updateProfile = async (data) => {
  const response = await api.put('/auth/profile', data);
  if (response.data) {
    const current = JSON.parse(localStorage.getItem('userInfo'));
    localStorage.setItem('userInfo', JSON.stringify({ ...current, ...response.data }));
  }
  return response.data;
};

export default { signup, login, updateProfile };