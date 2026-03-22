import client from './client';

export const authAPI = {
  login: (data) => client.post('/auth/login/', data),
  register: (data) => client.post('/auth/register/', data),
  logout: (refresh) => client.post('/auth/logout/', { refresh }),
  me: () => client.get('/auth/me/'),
  updateProfile: (data) => client.patch('/auth/profile/', data),
  deleteProfile: () => client.delete('/auth/profile/delete/'),
};

export const usersAPI = {
  list: (params) => client.get('/auth/users/', { params }),
  get: (id) => client.get(`/auth/users/${id}/`),
  create: (data) => client.post('/auth/users/', data),
  update: (id, data) => client.patch(`/auth/users/${id}/`, data),
  delete: (id) => client.delete(`/auth/users/${id}/`),
};

export const rolesAPI = {
  list: () => client.get('/auth/roles/'),
};
