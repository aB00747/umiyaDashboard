// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom';

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn(), success: vi.fn() },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const real = await importOriginal();
  return { ...real, useNavigate: () => mockNavigate };
});

import Login from './Login';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

function render$() {
  return render(<MemoryRouter><Login /></MemoryRouter>);
}

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ login: vi.fn() });
  });

  it('renders sign in heading', () => {
    render$();
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
  });

  it('renders username and password inputs', () => {
    render$();
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
  });

  it('renders Sign in button', () => {
    render$();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('renders Register link', () => {
    render$();
    expect(screen.getByRole('link', { name: 'Register' })).toBeInTheDocument();
  });

  it('updates username and password fields', () => {
    render$();
    const usernameInput = document.querySelector('input[type="text"]');
    const passwordInput = document.querySelector('input[type="password"]');
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'secret' } });
    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('secret');
  });

  it('calls login and navigates on success', async () => {
    const login = vi.fn().mockResolvedValue({});
    useAuth.mockReturnValue({ login });
    render$();
    fireEvent.change(document.querySelector('input[type="text"]'), { target: { value: 'user' } });
    fireEvent.change(document.querySelector('input[type="password"]'), { target: { value: 'pass' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Sign in' }).closest('form'));
    await waitFor(() => expect(login).toHaveBeenCalledWith({ username: 'user', password: 'pass' }));
    expect(toast.success).toHaveBeenCalledWith('Logged in successfully');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('shows error on login failure', async () => {
    const login = vi.fn().mockRejectedValue({ response: { data: { error: 'Invalid credentials' } } });
    useAuth.mockReturnValue({ login });
    render$();
    fireEvent.submit(screen.getByRole('button', { name: 'Sign in' }).closest('form'));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Invalid credentials'));
  });

  it('shows fallback error when no response data', async () => {
    const login = vi.fn().mockRejectedValue(new Error('network'));
    useAuth.mockReturnValue({ login });
    render$();
    fireEvent.submit(screen.getByRole('button', { name: 'Sign in' }).closest('form'));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Login failed'));
  });
});
