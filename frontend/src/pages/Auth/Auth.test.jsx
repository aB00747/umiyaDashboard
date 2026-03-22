// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../contexts/AuthContext', () => ({ useAuth: vi.fn() }));
vi.mock('react-hot-toast', () => ({ default: { error: vi.fn(), success: vi.fn() } }));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const real = await importOriginal();
  return { ...real, useNavigate: () => mockNavigate };
});

import Login from './Login';
import Register from './Register';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

// ─── Login ───────────────────────────────────────────────────────────────────

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ login: vi.fn() });
  });

  function renderLogin() {
    return render(<MemoryRouter><Login /></MemoryRouter>);
  }

  it('renders heading, inputs and navigation elements', () => {
    renderLogin();
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Register' })).toBeInTheDocument();
  });

  it('updates input fields on change', () => {
    renderLogin();
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
    renderLogin();
    fireEvent.change(document.querySelector('input[type="text"]'), { target: { value: 'user' } });
    fireEvent.change(document.querySelector('input[type="password"]'), { target: { value: 'pass' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Sign in' }).closest('form'));
    await waitFor(() => expect(login).toHaveBeenCalledWith({ username: 'user', password: 'pass' }));
    expect(toast.success).toHaveBeenCalledWith('Logged in successfully');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('shows API error on login failure', async () => {
    const login = vi.fn().mockRejectedValue({ response: { data: { error: 'Invalid credentials' } } });
    useAuth.mockReturnValue({ login });
    renderLogin();
    fireEvent.submit(screen.getByRole('button', { name: 'Sign in' }).closest('form'));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Invalid credentials'));
  });

  it('shows fallback error on network failure', async () => {
    const login = vi.fn().mockRejectedValue(new Error('network'));
    useAuth.mockReturnValue({ login });
    renderLogin();
    fireEvent.submit(screen.getByRole('button', { name: 'Sign in' }).closest('form'));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Login failed'));
  });
});

// ─── Register ────────────────────────────────────────────────────────────────

describe('Register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ register: vi.fn() });
  });

  function renderRegister() {
    return render(<MemoryRouter><Register /></MemoryRouter>);
  }

  it('renders heading, all form fields and navigation elements', () => {
    renderRegister();
    expect(screen.getByText('Create an account')).toBeInTheDocument();
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('shows error when passwords do not match', async () => {
    renderRegister();
    const inputs = document.querySelectorAll('input[type="password"]');
    fireEvent.change(inputs[0], { target: { value: 'pass1' } });
    fireEvent.change(inputs[1], { target: { value: 'pass2' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Register' }).closest('form'));
    expect(toast.error).toHaveBeenCalledWith('Passwords do not match');
  });

  it('calls register on valid form submit', async () => {
    const register = vi.fn().mockResolvedValue({});
    useAuth.mockReturnValue({ register });
    renderRegister();
    const textInputs = document.querySelectorAll('input[type="text"]');
    const emailInput = document.querySelector('input[type="email"]');
    const pwdInputs = document.querySelectorAll('input[type="password"]');
    fireEvent.change(textInputs[0], { target: { value: 'John' } });
    fireEvent.change(textInputs[1], { target: { value: 'Doe' } });
    fireEvent.change(textInputs[2], { target: { value: 'johndoe' } });
    if (emailInput) fireEvent.change(emailInput, { target: { value: 'john@ex.com' } });
    fireEvent.change(pwdInputs[0], { target: { value: 'secret123' } });
    fireEvent.change(pwdInputs[1], { target: { value: 'secret123' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Register' }).closest('form'));
    await waitFor(() => expect(register).toHaveBeenCalled());
    expect(toast.success).toHaveBeenCalledWith('Account created successfully');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('shows API error on registration failure', async () => {
    const register = vi.fn().mockRejectedValue({
      response: { data: { username: ['This field is required.'] } },
    });
    useAuth.mockReturnValue({ register });
    renderRegister();
    const pwdInputs = document.querySelectorAll('input[type="password"]');
    fireEvent.change(pwdInputs[0], { target: { value: 'pass' } });
    fireEvent.change(pwdInputs[1], { target: { value: 'pass' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Register' }).closest('form'));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('This field is required.'));
  });

  it('shows fallback error on network failure', async () => {
    const register = vi.fn().mockRejectedValue(new Error('network'));
    useAuth.mockReturnValue({ register });
    renderRegister();
    const pwdInputs = document.querySelectorAll('input[type="password"]');
    fireEvent.change(pwdInputs[0], { target: { value: 'same' } });
    fireEvent.change(pwdInputs[1], { target: { value: 'same' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Register' }).closest('form'));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Registration failed'));
  });
});
