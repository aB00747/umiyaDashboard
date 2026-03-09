import client from './client';

export const messagesAPI = {
  list: (params) => client.get('/messages/', { params }),
  get: (id) => client.get(`/messages/${id}/`),
  create: (data) => client.post('/messages/', data),
  markRead: (id) => client.post(`/messages/${id}/read/`),
};
