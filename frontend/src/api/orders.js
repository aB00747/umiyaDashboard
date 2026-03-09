import client from './client';

export const ordersAPI = {
  list: (params) => client.get('/orders/', { params }),
  get: (id) => client.get(`/orders/${id}/`),
  create: (data) => client.post('/orders/', data),
  update: (id, data) => client.put(`/orders/${id}/`, data),
  delete: (id) => client.delete(`/orders/${id}/`),
  updateStatus: (id, status) => client.patch(`/orders/${id}/status/`, { status }),
};
