// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';


vi.mock('../../public/UAC.svg', () => ({ default: 'mock-logo.svg' }));
vi.mock('../api/core', () => ({
  brandingAPI: { get: vi.fn() },
}));

import { BrandingProvider, useBranding } from './BrandingContext';
import { brandingAPI } from '../api/core';

function Consumer() {
  const { systemName, logoUrl, faviconUrl } = useBranding();
  return (
    <>
      <span data-testid="name">{systemName}</span>
      <span data-testid="logo">{logoUrl}</span>
      <span data-testid="fav">{faviconUrl}</span>
    </>
  );
}

describe('BrandingProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    brandingAPI.get.mockResolvedValue({ data: { system_name: '', logo_url: '', favicon_url: '' } });
  });

  afterEach(() => localStorage.clear());

  it('renders children with default values when no token', () => {
    render(<BrandingProvider><Consumer /></BrandingProvider>);
    expect(screen.getByTestId('name').textContent).toBe('Umiya Chemical Dashboard');
  });

  it('loads branding from API when access token is present', async () => {
    brandingAPI.get.mockResolvedValue({
      data: { system_name: 'Custom Co', logo_url: 'https://example.com/logo.png', favicon_url: '' },
    });
    localStorage.setItem('access_token', 'tok');
    render(<BrandingProvider><Consumer /></BrandingProvider>);
    await waitFor(() => expect(screen.getByTestId('name').textContent).toBe('Custom Co'));
    expect(screen.getByTestId('logo').textContent).toBe('https://example.com/logo.png');
  });

  it('falls back to defaults when API fails', async () => {
    brandingAPI.get.mockRejectedValue(new Error('fail'));
    localStorage.setItem('access_token', 'tok');
    render(<BrandingProvider><Consumer /></BrandingProvider>);
    await waitFor(() => expect(brandingAPI.get).toHaveBeenCalled());
    expect(screen.getByTestId('name').textContent).toBe('Umiya Chemical Dashboard');
  });

  it('updates document.title from API response', async () => {
    brandingAPI.get.mockResolvedValue({
      data: { system_name: 'My Platform', logo_url: '', favicon_url: '' },
    });
    localStorage.setItem('access_token', 'tok');
    render(<BrandingProvider><Consumer /></BrandingProvider>);
    await waitFor(() => expect(document.title).toBe('My Platform'));
  });

  it('injects favicon link tag when favicon URL is present', async () => {
    brandingAPI.get.mockResolvedValue({
      data: { system_name: 'App', logo_url: '', favicon_url: 'https://example.com/fav.ico' },
    });
    localStorage.setItem('access_token', 'tok');
    render(<BrandingProvider><Consumer /></BrandingProvider>);
    await waitFor(() => {
      const link = document.querySelector("link[rel~='icon']");
      expect(link).not.toBeNull();
      expect(link.href).toContain('fav.ico');
    });
  });
});

describe('useBranding outside provider', () => {
  it('throws a descriptive error', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Consumer />)).toThrow('useBranding must be used within BrandingProvider');
    spy.mockRestore();
  });
});
