import api from './api';

export const getInventory = async (params) => {
  const response = await api.get('/inventory', { params });
  return response.data;
};

export const getInventoryById = async (id) => {
  const response = await api.get(`/inventory/${id}`);
  return response.data;
};

export const createInventory = async (data) => {
  const response = await api.post('/inventory', data);
  return response.data;
};

export const updateInventory = async (id, data) => {
  const response = await api.put(`/inventory/${id}`, data);
  return response.data;
};

export const deleteInventory = async (id) => {
  const response = await api.delete(`/inventory/${id}`);
  return response.data;
};
