import client from './client';

export const authAPI = {
  login: (data) => client.post('/auth/login/', data),
  register: (data) => client.post('/auth/register/', data),
  logout: (refresh) => client.post('/auth/logout/', { refresh }),
  me: () => client.get('/auth/me/'),
  updateProfile: (data) => client.patch('/auth/profile/', data),
  deleteProfile: () => client.delete('/auth/profile/delete/'),
};
