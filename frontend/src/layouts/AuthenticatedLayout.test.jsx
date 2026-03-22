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

const DEFAULT_USER = { id: 1, username: 'admin', first_name: 'Admin', role: { name: 'admin' } };

function setup({ user = DEFAULT_USER, loading = false, isDark = false, notifications = [] } = {}) {
  useAuth.mockReturnValue({ user, loading, logout: vi.fn() });
  useTheme.mockReturnValue({ isDark, toggleTheme: vi.fn() });
  useBranding.mockReturnValue({ systemName: 'Umiya', logoUrl: null });
  notificationsAPI.list.mockResolvedValue({ data: { results: notifications } });
}

function renderLayout() {
  return render(<MemoryRouter><AuthenticatedLayout /></MemoryRouter>);
}

describe('AuthenticatedLayout', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows loading spinner when auth is loading', () => {
    setup({ user: null, loading: true });
    renderLayout();
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('redirects to /login when not authenticated', () => {
    setup({ user: null });
    render(<MemoryRouter initialEntries={['/']}><AuthenticatedLayout /></MemoryRouter>);
    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
  });

  it('shows dark mode sun icon when isDark is true', async () => {
    setup({ isDark: true });
    renderLayout();
    await waitFor(() => expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument());
  });

  describe('when authenticated', () => {
    beforeEach(async () => {
      setup();
      renderLayout();
      await waitFor(() => screen.getByTestId('sidebar'));
    });

    it('renders sidebar, search input, and mobile sidebar button', () => {
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Search/i)).toBeInTheDocument();
      expect(screen.getByLabelText('Open sidebar')).toBeInTheDocument();
    });

    it('renders theme toggle and user menu buttons', () => {
      expect(screen.getByLabelText(/Switch to/i)).toBeInTheDocument();
      expect(screen.getByLabelText('User menu')).toBeInTheDocument();
    });

    it('clicking Open sidebar shows Close sidebar button', () => {
      fireEvent.click(screen.getByLabelText('Open sidebar'));
      expect(screen.getByLabelText('Close sidebar')).toBeInTheDocument();
    });

    it('clicking theme toggle calls toggleTheme', () => {
      const toggleTheme = useTheme().toggleTheme;
      fireEvent.click(screen.getByLabelText(/Switch to/i));
      expect(toggleTheme).toHaveBeenCalled();
    });

    it('shows notifications panel with empty state on bell click', () => {
      fireEvent.click(screen.getByLabelText(/Notifications/i));
      expect(screen.getByText('No notifications')).toBeInTheDocument();
    });

    it('shows user menu with Profile and Logout on click', () => {
      fireEvent.click(screen.getByLabelText('User menu'));
      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('calls logout when Logout is clicked', () => {
      const logout = useAuth().logout;
      fireEvent.click(screen.getByLabelText('User menu'));
      fireEvent.click(screen.getByText('Logout'));
      expect(logout).toHaveBeenCalled();
    });

    it('closes panels on Escape key', () => {
      fireEvent.click(screen.getByLabelText(/Notifications/i));
      expect(screen.getByText('No notifications')).toBeInTheDocument();
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByText('No notifications')).not.toBeInTheDocument();
    });

    it('does not call search API for short query', () => {
      fireEvent.change(screen.getByPlaceholderText(/Search/i), { target: { value: 'a' } });
      expect(searchAPI.search).not.toHaveBeenCalled();
    });

    it('shows search results when typing 3+ chars', async () => {
      searchAPI.search.mockResolvedValue({ data: { results: [{ id: 1, type: 'customer', title: 'Alice', subtitle: 'alice@ex.com' }] } });
      fireEvent.change(screen.getByPlaceholderText(/Search/i), { target: { value: 'ali' } });
      await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());
    });
  });

  describe('with unread notifications', () => {
    const NOTIFS = [{ id: 1, title: 'Test Notif', message: 'msg text', is_read: false }];

    beforeEach(async () => {
      setup({ notifications: NOTIFS });
      renderLayout();
      await waitFor(() => screen.getByLabelText(/Notifications/i));
    });

    it('shows unread count badge', () => {
      expect(screen.getByLabelText(/Notifications \(1 unread\)/i)).toBeInTheDocument();
    });

    it('shows notification items and Mark all read button in panel', async () => {
      notificationsAPI.markAllRead.mockResolvedValue({});
      fireEvent.click(screen.getByLabelText(/Notifications/i));
      expect(screen.getByText('Test Notif')).toBeInTheDocument();
      await waitFor(() => screen.getByText('Mark all read'));
      fireEvent.click(screen.getByText('Mark all read'));
      expect(notificationsAPI.markAllRead).toHaveBeenCalled();
    });
  });
});
