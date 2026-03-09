import client from './client';

export const reportsAPI = {
  dashboard: () => client.get('/reports/dashboard/'),
  sales: (params) => client.get('/reports/sales/', { params }),
  inventory: () => client.get('/reports/inventory/'),
};
