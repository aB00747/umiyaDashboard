// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

vi.mock('../../api/messaging', () => ({
  messagesAPI: { list: vi.fn(), get: vi.fn(), create: vi.fn(), markRead: vi.fn() },
}));

vi.mock('../../api/client', () => ({ default: { get: vi.fn() } }));

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('react-hot-toast', () => ({ default: { error: vi.fn(), success: vi.fn() } }));

import Messaging from './Index';
import { messagesAPI } from '../../api/messaging';
import { useAuth } from '../../contexts/AuthContext';
import client from '../../api/client';

const MESSAGES = [
  { id: 1, subject: 'Test Message', sender_name: 'Alice', is_read: false, created_at: '2024-01-01' },
];

describe('Messaging', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ user: { id: 1, username: 'testuser' } });
  });

  it('shows loading spinner initially', () => {
    messagesAPI.list.mockReturnValue(new Promise(() => {}));
    render(<Messaging />);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders Messages/Inbox heading after load', async () => {
    messagesAPI.list.mockResolvedValue({ data: [] });
    render(<Messaging />);
    await waitFor(() => expect(document.querySelector('h1')).toBeInTheDocument());
  });

  it('renders message list when data loaded', async () => {
    messagesAPI.list.mockResolvedValue({ data: MESSAGES });
    render(<Messaging />);
    await waitFor(() => expect(screen.getByText('Test Message')).toBeInTheDocument());
  });

  it('shows empty state when no messages', async () => {
    messagesAPI.list.mockResolvedValue({ data: [] });
    render(<Messaging />);
    await waitFor(() => expect(screen.getByText(/No messages/i)).toBeInTheDocument());
  });

  it('shows error toast when load fails', async () => {
    const toast = (await import('react-hot-toast')).default;
    messagesAPI.list.mockRejectedValue(new Error('fail'));
    render(<Messaging />);
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  it('renders Select a message placeholder in detail panel', async () => {
    messagesAPI.list.mockResolvedValue({ data: [] });
    render(<Messaging />);
    await waitFor(() => expect(screen.getByText('Select a message to read')).toBeInTheDocument());
  });

  it('renders Compose button', async () => {
    messagesAPI.list.mockResolvedValue({ data: [] });
    render(<Messaging />);
    await waitFor(() => expect(screen.getByText('Compose')).toBeInTheDocument());
  });

  it('opens compose dialog on Compose click', async () => {
    messagesAPI.list.mockResolvedValue({ data: [] });
    client.get.mockResolvedValue({ data: [] });
    render(<Messaging />);
    await waitFor(() => screen.getByText('Compose'));
    fireEvent.click(screen.getByText('Compose'));
    await waitFor(() => expect(screen.getByText('New Message')).toBeInTheDocument());
  });

  it('shows message detail on message click', async () => {
    messagesAPI.list.mockResolvedValue({ data: MESSAGES });
    messagesAPI.get.mockResolvedValue({ data: { id: 1, subject: 'Test Message', sender_name: 'Alice', body: 'Hello world', recipient_name: 'Bob', created_at: '2024-01-01', replies: [] } });
    render(<Messaging />);
    await waitFor(() => screen.getByText('Test Message'));
    fireEvent.click(screen.getByText('Test Message'));
    await waitFor(() => expect(screen.getByText('Hello world')).toBeInTheDocument());
  });
});
