import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./client', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn() },
}));

import { searchAPI, notificationsAPI, countriesAPI, statesAPI, settingsAPI, brandingAPI } from './core';
import client from './client';

describe('searchAPI', () => {
  beforeEach(() => vi.clearAllMocks());
  it('search passes q param', () => {
    searchAPI.search('test');
    expect(client.get).toHaveBeenCalledWith('/search/', { params: { q: 'test' } });
  });
});

describe('notificationsAPI', () => {
  beforeEach(() => vi.clearAllMocks());
  it('list', () => { notificationsAPI.list(); expect(client.get).toHaveBeenCalledWith('/notifications/'); });
  it('markRead', () => { notificationsAPI.markRead(5); expect(client.post).toHaveBeenCalledWith('/notifications/5/read/'); });
  it('markAllRead', () => { notificationsAPI.markAllRead(); expect(client.post).toHaveBeenCalledWith('/notifications/mark-all-read/'); });
});

describe('countriesAPI', () => {
  beforeEach(() => vi.clearAllMocks());
  it('list', () => { countriesAPI.list(); expect(client.get).toHaveBeenCalledWith('/countries/'); });
});

describe('statesAPI', () => {
  beforeEach(() => vi.clearAllMocks());
  it('list passes country_id', () => {
    statesAPI.list(2);
    expect(client.get).toHaveBeenCalledWith('/states/', { params: { country_id: 2 } });
  });
});

describe('settingsAPI', () => {
  beforeEach(() => vi.clearAllMocks());
  it('list', () => { settingsAPI.list(); expect(client.get).toHaveBeenCalledWith('/settings/'); });
  it('update', () => {
    settingsAPI.update('k', { key: 'k', value: 'v' });
    expect(client.put).toHaveBeenCalledWith('/settings/k/', { key: 'k', value: 'v' });
  });
});

describe('brandingAPI', () => {
  beforeEach(() => vi.clearAllMocks());
  it('get', () => { brandingAPI.get(); expect(client.get).toHaveBeenCalledWith('/branding/'); });
  it('update sends multipart header', () => {
    const fd = new FormData();
    brandingAPI.update(fd);
    expect(client.patch).toHaveBeenCalledWith('/branding/', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  });
});
