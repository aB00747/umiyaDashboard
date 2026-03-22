// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import { MemoryRouter, Routes, Route } from 'react-router-dom';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../contexts/BrandingContext', () => ({
  useBranding: vi.fn(),
}));

import GuestLayout from './GuestLayout';
import { useAuth } from '../contexts/AuthContext';
import { useBranding } from '../contexts/BrandingContext';

function render$(authState = { user: null, loading: false }) {
  useAuth.mockReturnValue(authState);
  useBranding.mockReturnValue({ systemName: 'Test App', logoUrl: '' });
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route element={<GuestLayout />}>
          <Route path="/login" element={<div>Login Page</div>} />
        </Route>
        <Route path="/" element={<div>Home Page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('GuestLayout', () => {
  it('shows loading spinner when auth is loading', () => {
    render$({ user: null, loading: true });
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders system name when no user', () => {
    render$();
    expect(screen.getByText('Test App')).toBeInTheDocument();
  });

  it('renders outlet children when not logged in', () => {
    render$();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('redirects to / when user is authenticated', () => {
    render$({ user: { id: 1 }, loading: false });
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('renders logo image when logoUrl is provided', () => {
    useAuth.mockReturnValue({ user: null, loading: false });
    useBranding.mockReturnValue({ systemName: 'App', logoUrl: 'http://logo.png' });
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<GuestLayout />}>
            <Route path="/login" element={<div>Login</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByAltText('App')).toBeInTheDocument();
  });

  it('uses fallback text when no system name', () => {
    useAuth.mockReturnValue({ user: null, loading: false });
    useBranding.mockReturnValue({ systemName: '', logoUrl: '' });
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<GuestLayout />}>
            <Route path="/login" element={<div>Login</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Umiya Acid & Chemical')).toBeInTheDocument();
  });
});
