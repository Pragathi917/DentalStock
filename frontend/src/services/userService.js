import api from './api';

export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const createStaff = async (data) => {
  const response = await api.post('/users', data);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};
