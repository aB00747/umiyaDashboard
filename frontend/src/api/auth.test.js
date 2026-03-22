import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./client', () => ({
  default: { post: vi.fn(), get: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));

import { authAPI, usersAPI, rolesAPI } from './auth';
import client from './client';

describe('authAPI', () => {
  beforeEach(() => vi.clearAllMocks());

  it('login posts to correct endpoint', () => {
    authAPI.login({ username: 'u', password: 'p' });
    expect(client.post).toHaveBeenCalledWith('/auth/login/', { username: 'u', password: 'p' });
  });

  it('register posts to correct endpoint', () => {
    authAPI.register({ username: 'u' });
    expect(client.post).toHaveBeenCalledWith('/auth/register/', { username: 'u' });
  });

  it('logout posts to correct endpoint', () => {
    authAPI.logout('tok');
    expect(client.post).toHaveBeenCalledWith('/auth/logout/', { refresh: 'tok' });
  });

  it('me gets correct endpoint', () => {
    authAPI.me();
    expect(client.get).toHaveBeenCalledWith('/auth/me/');
  });

  it('updateProfile patches correct endpoint', () => {
    authAPI.updateProfile({ first_name: 'A' });
    expect(client.patch).toHaveBeenCalledWith('/auth/profile/', { first_name: 'A' });
  });

  it('deleteProfile deletes correct endpoint', () => {
    authAPI.deleteProfile();
    expect(client.delete).toHaveBeenCalledWith('/auth/profile/delete/');
  });
});

describe('usersAPI', () => {
  beforeEach(() => vi.clearAllMocks());

  it('list passes params', () => {
    usersAPI.list({ search: 'q' });
    expect(client.get).toHaveBeenCalledWith('/auth/users/', { params: { search: 'q' } });
  });

  it('get uses id', () => {
    usersAPI.get(7);
    expect(client.get).toHaveBeenCalledWith('/auth/users/7/');
  });

  it('create posts data', () => {
    usersAPI.create({ username: 'x' });
    expect(client.post).toHaveBeenCalledWith('/auth/users/', { username: 'x' });
  });

  it('update patches by id', () => {
    usersAPI.update(3, { first_name: 'B' });
    expect(client.patch).toHaveBeenCalledWith('/auth/users/3/', { first_name: 'B' });
  });

  it('delete uses id', () => {
    usersAPI.delete(9);
    expect(client.delete).toHaveBeenCalledWith('/auth/users/9/');
  });
});

describe('rolesAPI', () => {
  beforeEach(() => vi.clearAllMocks());

  it('list gets correct endpoint', () => {
    rolesAPI.list();
    expect(client.get).toHaveBeenCalledWith('/auth/roles/');
  });
});
