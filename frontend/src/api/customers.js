import client from './client';

export const customersAPI = {
  list: (params) => client.get('/customers/', { params }),
  get: (id) => client.get(`/customers/${id}/`),
  create: (data) => client.post('/customers/', data),
  update: (id, data) => client.put(`/customers/${id}/`, data),
  delete: (id) => client.delete(`/customers/${id}/`),
  search: (params) => client.get('/customers/search/', { params }),
  import: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return client.post('/customers/import/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000,
    });
  },
  exportTemplate: (format = 'xlsx') =>
    client.get('/customers/export/template/', {
      params: { format },
      responseType: 'blob',
    }),
  export: (params) =>
    client.get('/customers/export/', { params, responseType: 'blob' }),
};
