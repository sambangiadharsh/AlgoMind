import axios from 'axios';

const API_URL = '/api/users';

const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  localStorage.setItem('userInfo', JSON.stringify(response.data));
  return response.data;
};

const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  localStorage.setItem('userInfo', JSON.stringify(response.data));
  return response.data;
};

const logout = () => {
  localStorage.removeItem('userInfo');
};

const updateUser = async (userData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(`${API_URL}/profile`, userData, config);
  localStorage.setItem('userInfo', JSON.stringify(response.data));
  return response.data;
};

const changePassword = async (passwordData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(
    `${API_URL}/change-password`,
    passwordData,
    config
  );
  return response.data;
};

const deleteUser = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.delete(`${API_URL}/delete-account`, config);
  localStorage.removeItem('userInfo');
  return response.data;
};

export default {
  register,
  login,
  logout,
  updateUser,
  changePassword,
  deleteUser,
};
