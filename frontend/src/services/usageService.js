import api from './api';

export const recordUsage = async (data) => {
  const response = await api.post('/usage', data);
  return response.data;
};

export const getUsageHistory = async (params) => {
  const response = await api.get('/usage', { params });
  return response.data;
};

export const getUsageHistoryByInventory = async (inventoryId) => {
  const response = await api.get(`/usage/${inventoryId}`);
  return response.data;
};
