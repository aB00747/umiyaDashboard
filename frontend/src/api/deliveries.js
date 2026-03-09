import client from './client';

export const deliveriesAPI = {
  list: (params) => client.get('/deliveries/', { params }),
  get: (id) => client.get(`/deliveries/${id}/`),
  create: (data) => client.post('/deliveries/', data),
  update: (id, data) => client.put(`/deliveries/${id}/`, data),
  delete: (id) => client.delete(`/deliveries/${id}/`),
};
