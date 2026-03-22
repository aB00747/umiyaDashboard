// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));
vi.mock('../contexts/ThemeContext', () => ({
  useTheme: vi.fn(),
}));
vi.mock('../contexts/BrandingContext', () => ({
  useBranding: vi.fn(),
}));
vi.mock('../api/core', () => ({
  searchAPI: { search: vi.fn() },
  notificationsAPI: { list: vi.fn(), markAllRead: vi.fn() },
}));
vi.mock('../components/SidebarContent', () => ({
  SidebarContent: ({ systemName }) => <div data-testid="sidebar">{systemName}</div>,
}));

import AuthenticatedLayout from './AuthenticatedLayout';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useBranding } from '../contexts/BrandingContext';
import { notificationsAPI, searchAPI } from '../api/core';

function setup(overrides = {}) {
  useAuth.mockReturnValue({ user: { id: 1, username: 'admin', first_name: 'Admin', role: { name: 'admin' } }, loading: false, logout: vi.fn(), ...overrides.auth });
  useTheme.mockReturnValue({ isDark: false, toggleTheme: vi.fn(), ...overrides.theme });
  useBranding.mockReturnValue({ systemName: 'Umiya', logoUrl: null, ...overrides.branding });
  notificationsAPI.list.mockResolvedValue({ data: { results: [] } });
}

describe('AuthenticatedLayout', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows loading spinner when auth is loading', () => {
    useAuth.mockReturnValue({ user: null, loading: true, logout: vi.fn() });
    useTheme.mockReturnValue({ isDark: false, toggleTheme: vi.fn() });
    useBranding.mockReturnValue({ systemName: 'Umiya', logoUrl: null });
    notificationsAPI.list.mockResolvedValue({ data: { results: [] } });
    render(<MemoryRouter><AuthenticatedLayout /></MemoryRouter>);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('redirects to /login when not authenticated', () => {
    useAuth.mockReturnValue({ user: null, loading: false, logout: vi.fn() });
    useTheme.mockReturnValue({ isDark: false, toggleTheme: vi.fn() });
    useBranding.mockReturnValue({ systemName: 'Umiya', logoUrl: null });
    notificationsAPI.list.mockResolvedValue({ data: { results: [] } });
    render(<MemoryRouter initialEntries={['/']}><AuthenticatedLayout /></MemoryRouter>);
    // Navigate replaces content; sidebar should not be present
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
  });

  it('renders sidebar when authenticated', async () => {
    setup();
    render(<MemoryRouter><AuthenticatedLayout /></MemoryRouter>);
    await waitFor(() => expect(screen.getByTestId('sidebar')).toBeInTheDocument());
  });

  it('renders search input', async () => {
    setup();
    render(<MemoryRouter><AuthenticatedLayout /></MemoryRouter>);
    await waitFor(() => expect(screen.getByPlaceholderText(/Search/i)).toBeInTheDocument());
  });

  it('renders Open sidebar button (mobile)', async () => {
    setup();
    render(<MemoryRouter><AuthenticatedLayout /></MemoryRouter>);
    await waitFor(() => expect(screen.getByLabelText('Open sidebar')).toBeInTheDocument());
  });

  it('clicking Open sidebar opens mobile sidebar', async () => {
    setup();
    render(<MemoryRouter><AuthenticatedLayout /></MemoryRouter>);
    await waitFor(() => screen.getByLabelText('Open sidebar'));
    fireEvent.click(screen.getByLabelText('Open sidebar'));
    expect(screen.getByLabelText('Close sidebar')).toBeInTheDocument();
  });

  it('renders theme toggle button', async () => {
    setup();
    render(<MemoryRouter><AuthenticatedLayout /></MemoryRouter>);
    await waitFor(() => expect(screen.getByLabelText(/Switch to/i)).toBeInTheDocument());
  });

  it('calls toggleTheme on theme button click', async () => {
    const toggleTheme = vi.fn();
    setup({ theme: { isDark: false, toggleTheme } });
    render(<MemoryRouter><AuthenticatedLayout /></MemoryRouter>);
    await waitFor(() => screen.getByLabelText(/Switch to/i));
    fireEvent.click(screen.getByLabelText(/Switch to/i));
    expect(toggleTheme).toHaveBeenCalled();
  });

  it('renders Notifications button', async () => {
    setup();
    render(<MemoryRouter><AuthenticatedLayout /></MemoryRouter>);
    await waitFor(() => expect(screen.getByLabelText(/Notifications/i)).toBeInTheDocument());
  });

  it('shows notifications panel on bell click', async () => {
    setup();
    render(<MemoryRouter><AuthenticatedLayout /></MemoryRouter>);
    await waitFor(() => screen.getByLabelText(/Notifications/i));
    fireEvent.click(screen.getByLabelText(/Notifications/i));
    expect(screen.getByText('No notifications')).toBeInTheDocument();
  });

  it('shows unread count badge when notifications unread', async () => {
    useAuth.mockReturnValue({ user: { id: 1, username: 'admin', first_name: 'Admin', role: { name: 'admin' } }, loading: false, logout: vi.fn() });
    useTheme.mockReturnValue({ isDark: false, toggleTheme: vi.fn() });
    useBranding.mockReturnValue({ systemName: 'Umiya', logoUrl: null });
    notificationsAPI.list.mockResolvedValue({ data: { results: [
      { id: 1, title: 'Test Notif', message: 'msg', is_read: false },
    ]}});
    render(<MemoryRouter><AuthenticatedLayout /></MemoryRouter>);
    await waitFor(() => expect(screen.getByLabelText(/Notifications \(1 unread\)/i)).toBeInTheDocument());
  });

  it('shows notification items in panel', async () => {
    useAuth.mockReturnValue({ user: { id: 1, username: 'admin', first_name: 'Admin', role: { name: 'admin' } }, loading: false, logout: vi.fn() });
    useTheme.mockReturnValue({ isDark: false, toggleTheme: vi.fn() });
    useBranding.mockReturnValue({ systemName: 'Umiya', logoUrl: null });
    notificationsAPI.list.mockResolvedValue({ data: { results: [
      { id: 1, title: 'Test Notif', message: 'msg text', is_read: false },
    ]}});
    render(<MemoryRouter><AuthenticatedLayout /></MemoryRouter>);
    await waitFor(() => screen.getByLabelText(/Notifications/i));
    fireEvent.click(screen.getByLabelText(/Notifications/i));
    expect(screen.getByText('Test Notif')).toBeInTheDocument();
  });

  it('renders Mark all read button when unread notifications', async () => {
    useAuth.mockReturnValue({ user: { id: 1, username: 'admin', first_name: 'Admin', role: { name: 'admin' } }, loading: false, logout: vi.fn() });
    useTheme.mockReturnValue({ isDark: false, toggleTheme: vi.fn() });
    useBranding.mockReturnValue({ systemName: 'Umiya', logoUrl: null });
    notificationsAPI.list.mockResolvedValue({ data: { results: [
      { id: 1, title: 'Notif', message: 'm', is_read: false },
    ]}});
    notificationsAPI.markAllRead.mockResolvedValue({});
    render(<MemoryRouter><AuthenticatedLayout /></MemoryRouter>);
    await waitFor(() => screen.getByLabelText(/Notifications/i));
    fireEvent.click(screen.getByLabelText(/Notifications/i));
    await waitFor(() => expect(screen.getByText('Mark all read')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Mark all read'));
    expect(notificationsAPI.markAllRead).toHaveBeenCalled();
  });

  it('renders user menu button', async () => {
    setup();
    render(<MemoryRouter><AuthenticatedLayout /></MemoryRouter>);
    await waitFor(() => expect(screen.getByLabelText('User menu')).toBeInTheDocument());
  });

  it('shows user menu dropdown on click', async () => {
    setup();
    render(<MemoryRouter><AuthenticatedLayout /></MemoryRouter>);
    await waitFor(() => screen.getByLabelText('User menu'));
    fireEvent.click(screen.getByLabelText('User menu'));
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('calls logout when Logout clicked', async () => {
    const logout = vi.fn();
    setup({ auth: { user: { id: 1, username: 'admin', first_name: 'Admin', role: { name: 'admin' } }, loading: false, logout } });
    render(<MemoryRouter><AuthenticatedLayout /></MemoryRouter>);
    await waitFor(() => screen.getByLabelText('User menu'));
    fireEvent.click(screen.getByLabelText('User menu'));
    fireEvent.click(screen.getByText('Logout'));
    expect(logout).toHaveBeenCalled();
  });

  it('shows search results when typing', async () => {
    setup();
    searchAPI.search.mockResolvedValue({ data: { results: [{ id: 1, type: 'customer', title: 'Alice', subtitle: 'alice@ex.com' }] } });
    render(<MemoryRouter><AuthenticatedLayout /></MemoryRouter>);
    await waitFor(() => screen.getByPlaceholderText(/Search/i));
    fireEvent.change(screen.getByPlaceholderText(/Search/i), { target: { value: 'ali' } });
    await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());
  });

  it('clears search results for short query', async () => {
    setup();
    render(<MemoryRouter><AuthenticatedLayout /></MemoryRouter>);
    await waitFor(() => screen.getByPlaceholderText(/Search/i));
    fireEvent.change(screen.getByPlaceholderText(/Search/i), { target: { value: 'a' } });
    expect(searchAPI.search).not.toHaveBeenCalled();
  });

  it('closes panels on Escape key', async () => {
    setup();
    render(<MemoryRouter><AuthenticatedLayout /></MemoryRouter>);
    await waitFor(() => screen.getByLabelText(/Notifications/i));
    fireEvent.click(screen.getByLabelText(/Notifications/i));
    expect(screen.getByText('No notifications')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByText('No notifications')).not.toBeInTheDocument();
  });

  it('shows dark mode sun icon when isDark is true', async () => {
    setup({ theme: { isDark: true, toggleTheme: vi.fn() } });
    render(<MemoryRouter><AuthenticatedLayout /></MemoryRouter>);
    await waitFor(() => expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument());
  });
});
