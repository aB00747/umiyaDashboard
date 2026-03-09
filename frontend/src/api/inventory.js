import client from './client';

export const categoriesAPI = {
  list: () => client.get('/categories/'),
  create: (data) => client.post('/categories/', data),
  update: (id, data) => client.put(`/categories/${id}/`, data),
  delete: (id) => client.delete(`/categories/${id}/`),
};

export const chemicalsAPI = {
  list: (params) => client.get('/chemicals/', { params }),
  get: (id) => client.get(`/chemicals/${id}/`),
  create: (data) => client.post('/chemicals/', data),
  update: (id, data) => client.put(`/chemicals/${id}/`, data),
  delete: (id) => client.delete(`/chemicals/${id}/`),
};

export const vendorsAPI = {
  list: (params) => client.get('/vendors/', { params }),
  get: (id) => client.get(`/vendors/${id}/`),
  create: (data) => client.post('/vendors/', data),
  update: (id, data) => client.put(`/vendors/${id}/`, data),
  delete: (id) => client.delete(`/vendors/${id}/`),
};

export const stockEntriesAPI = {
  list: (params) => client.get('/stock-entries/', { params }),
  create: (data) => client.post('/stock-entries/', data),
  update: (id, data) => client.put(`/stock-entries/${id}/`, data),
  delete: (id) => client.delete(`/stock-entries/${id}/`),
};
