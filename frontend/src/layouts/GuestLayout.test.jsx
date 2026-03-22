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

function render$({ authState = { user: null, loading: false }, systemName = 'Test App', logoUrl = '' } = {}) {
  useAuth.mockReturnValue(authState);
  useBranding.mockReturnValue({ systemName, logoUrl });
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
    render$({ authState: { user: null, loading: true } });
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
    render$({ authState: { user: { id: 1 }, loading: false } });
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('renders logo image when logoUrl is provided', () => {
    render$({ systemName: 'App', logoUrl: 'https://example.com/logo.png' });
    expect(screen.getByAltText('App')).toBeInTheDocument();
  });

  it('uses fallback text when no system name', () => {
    render$({ systemName: '' });
    expect(screen.getByText('Umiya Acid & Chemical')).toBeInTheDocument();
  });
});
