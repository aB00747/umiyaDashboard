import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./client', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import { customersAPI, customerTypesAPI } from './customers';
import client from './client';

describe('customersAPI', () => {
  beforeEach(() => vi.clearAllMocks());

  it('list passes params', () => {
    customersAPI.list({ page: 1 });
    expect(client.get).toHaveBeenCalledWith('/customers/', { params: { page: 1 } });
  });
  it('get uses id', () => {
    customersAPI.get(3);
    expect(client.get).toHaveBeenCalledWith('/customers/3/');
  });
  it('create posts data', () => {
    customersAPI.create({ first_name: 'A' });
    expect(client.post).toHaveBeenCalledWith('/customers/', { first_name: 'A' });
  });
  it('update puts by id', () => {
    customersAPI.update(2, { first_name: 'B' });
    expect(client.put).toHaveBeenCalledWith('/customers/2/', { first_name: 'B' });
  });
  it('delete uses id', () => {
    customersAPI.delete(4);
    expect(client.delete).toHaveBeenCalledWith('/customers/4/');
  });
  it('search passes params', () => {
    customersAPI.search({ q: 'x' });
    expect(client.get).toHaveBeenCalledWith('/customers/search/', { params: { q: 'x' } });
  });
  it('import builds FormData', () => {
    const file = new File(['data'], 'test.csv');
    customersAPI.import(file);
    const [url, body] = client.post.mock.calls[0];
    expect(url).toBe('/customers/import/');
    expect(body).toBeInstanceOf(FormData);
  });
  it('exportTemplate defaults to xlsx', () => {
    customersAPI.exportTemplate();
    expect(client.get).toHaveBeenCalledWith('/customers/export/template/',
      expect.objectContaining({ params: { format: 'xlsx' } })
    );
  });
  it('export passes params as blob', () => {
    customersAPI.export({ is_active: true });
    expect(client.get).toHaveBeenCalledWith('/customers/export/',
      expect.objectContaining({ params: { is_active: true }, responseType: 'blob' })
    );
  });
});

describe('customerTypesAPI', () => {
  beforeEach(() => vi.clearAllMocks());
  it('list', () => { customerTypesAPI.list(); expect(client.get).toHaveBeenCalledWith('/customers/types/'); });
});
