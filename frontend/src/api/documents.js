import client from './client';

export const documentsAPI = {
  list: (params) => client.get('/documents/', { params }),
  get: (id) => client.get(`/documents/${id}/`),
  upload: (formData) =>
    client.post('/documents/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id) => client.delete(`/documents/${id}/`),
};
