import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

import { categoriesAPI, chemicalsAPI, vendorsAPI, stockEntriesAPI } from './inventory';
import { ordersAPI } from './orders';
import { deliveriesAPI } from './deliveries';
import { reportsAPI } from './reports';
import { messagesAPI } from './messaging';
import { documentsAPI } from './documents';
import client from './client';

beforeEach(() => vi.clearAllMocks());

describe('categoriesAPI', () => {
  it('list', () => { categoriesAPI.list(); expect(client.get).toHaveBeenCalledWith('/categories/'); });
  it('create', () => { categoriesAPI.create({ name: 'X' }); expect(client.post).toHaveBeenCalledWith('/categories/', { name: 'X' }); });
  it('update', () => { categoriesAPI.update(1, { name: 'Y' }); expect(client.put).toHaveBeenCalledWith('/categories/1/', { name: 'Y' }); });
  it('delete', () => { categoriesAPI.delete(1); expect(client.delete).toHaveBeenCalledWith('/categories/1/'); });
});

describe('chemicalsAPI', () => {
  it('list with params', () => { chemicalsAPI.list({ q: 'x' }); expect(client.get).toHaveBeenCalledWith('/chemicals/', { params: { q: 'x' } }); });
  it('get', () => { chemicalsAPI.get(2); expect(client.get).toHaveBeenCalledWith('/chemicals/2/'); });
  it('create', () => { chemicalsAPI.create({ name: 'A' }); expect(client.post).toHaveBeenCalledWith('/chemicals/', { name: 'A' }); });
  it('update', () => { chemicalsAPI.update(2, { name: 'B' }); expect(client.put).toHaveBeenCalledWith('/chemicals/2/', { name: 'B' }); });
  it('delete', () => { chemicalsAPI.delete(2); expect(client.delete).toHaveBeenCalledWith('/chemicals/2/'); });
});

describe('vendorsAPI', () => {
  it('list', () => { vendorsAPI.list(); expect(client.get).toHaveBeenCalledWith('/vendors/', { params: undefined }); });
  it('get', () => { vendorsAPI.get(3); expect(client.get).toHaveBeenCalledWith('/vendors/3/'); });
  it('create', () => { vendorsAPI.create({ name: 'V' }); expect(client.post).toHaveBeenCalledWith('/vendors/', { name: 'V' }); });
  it('update', () => { vendorsAPI.update(3, { name: 'W' }); expect(client.put).toHaveBeenCalledWith('/vendors/3/', { name: 'W' }); });
  it('delete', () => { vendorsAPI.delete(3); expect(client.delete).toHaveBeenCalledWith('/vendors/3/'); });
});

describe('stockEntriesAPI', () => {
  it('list', () => { stockEntriesAPI.list({ chemical: 1 }); expect(client.get).toHaveBeenCalledWith('/stock-entries/', { params: { chemical: 1 } }); });
  it('create', () => { stockEntriesAPI.create({ qty: 10 }); expect(client.post).toHaveBeenCalledWith('/stock-entries/', { qty: 10 }); });
  it('update', () => { stockEntriesAPI.update(4, { qty: 5 }); expect(client.put).toHaveBeenCalledWith('/stock-entries/4/', { qty: 5 }); });
  it('delete', () => { stockEntriesAPI.delete(4); expect(client.delete).toHaveBeenCalledWith('/stock-entries/4/'); });
});

describe('ordersAPI', () => {
  it('list', () => { ordersAPI.list({ page: 1 }); expect(client.get).toHaveBeenCalledWith('/orders/', { params: { page: 1 } }); });
  it('get', () => { ordersAPI.get(5); expect(client.get).toHaveBeenCalledWith('/orders/5/'); });
  it('create', () => { ordersAPI.create({ customer: 1 }); expect(client.post).toHaveBeenCalledWith('/orders/', { customer: 1 }); });
  it('update', () => { ordersAPI.update(5, { customer: 2 }); expect(client.put).toHaveBeenCalledWith('/orders/5/', { customer: 2 }); });
  it('delete', () => { ordersAPI.delete(5); expect(client.delete).toHaveBeenCalledWith('/orders/5/'); });
  it('updateStatus', () => { ordersAPI.updateStatus(5, 'delivered'); expect(client.patch).toHaveBeenCalledWith('/orders/5/status/', { status: 'delivered' }); });
});

describe('deliveriesAPI', () => {
  it('list', () => { deliveriesAPI.list({ status: 'pending' }); expect(client.get).toHaveBeenCalledWith('/deliveries/', { params: { status: 'pending' } }); });
  it('get', () => { deliveriesAPI.get(6); expect(client.get).toHaveBeenCalledWith('/deliveries/6/'); });
  it('create', () => { deliveriesAPI.create({ order: 1 }); expect(client.post).toHaveBeenCalledWith('/deliveries/', { order: 1 }); });
  it('update', () => { deliveriesAPI.update(6, { status: 'delivered' }); expect(client.put).toHaveBeenCalledWith('/deliveries/6/', { status: 'delivered' }); });
  it('delete', () => { deliveriesAPI.delete(6); expect(client.delete).toHaveBeenCalledWith('/deliveries/6/'); });
});

describe('reportsAPI', () => {
  it('dashboard', () => { reportsAPI.dashboard(); expect(client.get).toHaveBeenCalledWith('/reports/dashboard/'); });
  it('sales with params', () => { reportsAPI.sales({ month: 1 }); expect(client.get).toHaveBeenCalledWith('/reports/sales/', { params: { month: 1 } }); });
  it('inventory', () => { reportsAPI.inventory(); expect(client.get).toHaveBeenCalledWith('/reports/inventory/'); });
});

describe('messagesAPI', () => {
  it('list', () => { messagesAPI.list({ unread: true }); expect(client.get).toHaveBeenCalledWith('/messages/', { params: { unread: true } }); });
  it('get', () => { messagesAPI.get(7); expect(client.get).toHaveBeenCalledWith('/messages/7/'); });
  it('create', () => { messagesAPI.create({ body: 'hi' }); expect(client.post).toHaveBeenCalledWith('/messages/', { body: 'hi' }); });
  it('markRead', () => { messagesAPI.markRead(7); expect(client.post).toHaveBeenCalledWith('/messages/7/read/'); });
});

describe('documentsAPI', () => {
  it('list', () => { documentsAPI.list(); expect(client.get).toHaveBeenCalledWith('/documents/', { params: undefined }); });
  it('get', () => { documentsAPI.get(8); expect(client.get).toHaveBeenCalledWith('/documents/8/'); });
  it('upload sends multipart', () => {
    const fd = new FormData();
    documentsAPI.upload(fd);
    expect(client.post).toHaveBeenCalledWith('/documents/', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  });
  it('delete', () => { documentsAPI.delete(8); expect(client.delete).toHaveBeenCalledWith('/documents/8/'); });
});
