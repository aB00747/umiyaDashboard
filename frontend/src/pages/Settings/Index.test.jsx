// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';


vi.mock('../../api/core', () => ({
  settingsAPI: { list: vi.fn(), update: vi.fn() },
  brandingAPI: { update: vi.fn() },
}));

vi.mock('../../api/client', () => ({
  default: { post: vi.fn() },
}));

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../contexts/BrandingContext', () => ({
  useBranding: vi.fn(),
}));

vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn(), success: vi.fn() },
}));

import SettingsPage from './Index';
import { settingsAPI, brandingAPI } from '../../api/core';
import client from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';
import { useBranding } from '../../contexts/BrandingContext';
import toast from 'react-hot-toast';

const SETTINGS = [
  { key: 'site_title', value: 'My Site', description: 'The site title' },
  { key: 'items_per_page', value: '25', description: '' },
];

function setup({ roleName = 'super_admin', settings = SETTINGS } = {}) {
  useAuth.mockReturnValue({ user: { role: { name: roleName } } });
  useBranding.mockReturnValue({
    systemName: 'Test System',
    logoUrl: '',
    faviconUrl: '',
    refreshBranding: vi.fn(),
  });
  settingsAPI.list.mockResolvedValue({ data: settings });
}

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading spinner initially', () => {
    setup();
    settingsAPI.list.mockReturnValue(new Promise(() => {}));
    render(<SettingsPage />);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders Settings heading after load', async () => {
    setup();
    render(<SettingsPage />);
    await waitFor(() => expect(screen.getByText('Settings')).toBeInTheDocument());
  });

  it('renders Application Settings section', async () => {
    setup();
    render(<SettingsPage />);
    await waitFor(() => expect(screen.getByText('Application Settings')).toBeInTheDocument());
  });

  it('renders settings rows', async () => {
    setup();
    render(<SettingsPage />);
    await waitFor(() => expect(screen.getByText('site_title')).toBeInTheDocument());
    expect(screen.getByText('items_per_page')).toBeInTheDocument();
  });

  it('renders setting description', async () => {
    setup();
    render(<SettingsPage />);
    await waitFor(() => expect(screen.getByText('The site title')).toBeInTheDocument());
  });

  it('shows empty state when no settings', async () => {
    setup({ settings: [] });
    render(<SettingsPage />);
    await waitFor(() => expect(screen.getByText('No settings configured')).toBeInTheDocument());
  });

  it('shows error toast when settings load fails', async () => {
    setup();
    settingsAPI.list.mockRejectedValue(new Error('fail'));
    render(<SettingsPage />);
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Failed to load settings'));
  });

  it('shows Branding section for super_admin', async () => {
    setup({ roleName: 'super_admin' });
    render(<SettingsPage />);
    await waitFor(() => expect(screen.getByText('Branding')).toBeInTheDocument());
  });

  it('shows Branding section for admin', async () => {
    setup({ roleName: 'admin' });
    render(<SettingsPage />);
    await waitFor(() => expect(screen.getByText('Branding')).toBeInTheDocument());
  });

  it('hides Branding section for non-admin', async () => {
    setup({ roleName: 'member' });
    render(<SettingsPage />);
    await waitFor(() => expect(screen.queryByText('Branding')).not.toBeInTheDocument());
  });

  it('renders System Name input with value from branding context', async () => {
    setup();
    render(<SettingsPage />);
    await waitFor(() => {
      const inputs = document.querySelectorAll('input[type="text"]');
      const systemNameInput = Array.from(inputs).find(i => i.value === 'Test System');
      expect(systemNameInput).toBeInTheDocument();
    });
  });

  it('calls settingsAPI.update on Save click', async () => {
    setup();
    settingsAPI.update.mockResolvedValue({});
    render(<SettingsPage />);
    await waitFor(() => screen.getAllByText('Save'));
    const saveButtons = screen.getAllByText('Save');
    fireEvent.click(saveButtons[0]);
    await waitFor(() => expect(settingsAPI.update).toHaveBeenCalled());
    expect(toast.success).toHaveBeenCalledWith('Setting updated');
  });

  it('shows update error toast when save fails', async () => {
    setup();
    settingsAPI.update.mockRejectedValue(new Error('fail'));
    render(<SettingsPage />);
    await waitFor(() => screen.getAllByText('Save'));
    const saveButtons = screen.getAllByText('Save');
    fireEvent.click(saveButtons[0]);
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Update failed'));
  });

  it('renders Add New Setting section', async () => {
    setup();
    render(<SettingsPage />);
    await waitFor(() => expect(screen.getByText('Add New Setting')).toBeInTheDocument());
    expect(screen.getByText('Add Setting')).toBeInTheDocument();
  });

  it('shows error when Add Setting clicked with empty key', async () => {
    setup();
    render(<SettingsPage />);
    await waitFor(() => screen.getByText('Add Setting'));
    fireEvent.click(screen.getByText('Add Setting'));
    expect(toast.error).toHaveBeenCalledWith('Key is required');
  });

  it('calls client.post when Add Setting has a key', async () => {
    setup();
    client.post.mockResolvedValue({ data: {} });
    render(<SettingsPage />);
    await waitFor(() => screen.getByText('Add Setting'));

    const allInputs = document.querySelectorAll('input[type="text"]');
    const keyInput = Array.from(allInputs).find(i => i.placeholder === 'e.g., company_name');
    fireEvent.change(keyInput, { target: { value: 'new_key' } });
    fireEvent.click(screen.getByText('Add Setting'));

    await waitFor(() => expect(client.post).toHaveBeenCalledWith('/settings/', expect.objectContaining({ key: 'new_key' })));
    expect(toast.success).toHaveBeenCalledWith('Setting added');
  });

  it('renders System Information section', async () => {
    setup();
    render(<SettingsPage />);
    await waitFor(() => expect(screen.getByText('System Information')).toBeInTheDocument());
    expect(screen.getByText('Django REST Framework')).toBeInTheDocument();
    expect(screen.getByText('React + Vite')).toBeInTheDocument();
  });

  it('calls brandingAPI.update on Save Branding click', async () => {
    setup();
    brandingAPI.update.mockResolvedValue({});
    render(<SettingsPage />);
    await waitFor(() => screen.getByText('Save Branding'));
    fireEvent.click(screen.getByText('Save Branding'));
    await waitFor(() => expect(brandingAPI.update).toHaveBeenCalled());
    expect(toast.success).toHaveBeenCalledWith('Branding updated');
  });

  it('shows error toast when branding save fails', async () => {
    setup();
    brandingAPI.update.mockRejectedValue(new Error('fail'));
    render(<SettingsPage />);
    await waitFor(() => screen.getByText('Save Branding'));
    fireEvent.click(screen.getByText('Save Branding'));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Failed to update branding'));
  });
});
