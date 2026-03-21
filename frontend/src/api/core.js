import client from './client';

export const searchAPI = {
  search: (q) => client.get('/search/', { params: { q } }),
};

export const notificationsAPI = {
  list: () => client.get('/notifications/'),
  markRead: (id) => client.post(`/notifications/${id}/read/`),
  markAllRead: () => client.post('/notifications/mark-all-read/'),
};

export const countriesAPI = {
  list: () => client.get('/countries/'),
};

export const statesAPI = {
  list: (countryId) => client.get('/states/', { params: { country_id: countryId } }),
};

export const settingsAPI = {
  list: () => client.get('/settings/'),
  update: (key, data) => client.put(`/settings/${key}/`, data),
};

export const brandingAPI = {
  get: () => client.get('/branding/'),
  update: (formData) => client.patch('/branding/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};
