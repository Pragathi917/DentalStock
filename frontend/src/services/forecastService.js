import api from './api';

export const getForecast = async (inventoryId, months = 3) => {
  const response = await api.get(`/forecast/${inventoryId}`, { params: { months } });
  return response.data;
};
