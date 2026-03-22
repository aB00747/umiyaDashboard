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

import Register from './Register';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

function render$() {
  return render(<MemoryRouter><Register /></MemoryRouter>);
}

describe('Register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuth.mockReturnValue({ register: vi.fn() });
  });

  it('renders Create an account heading', () => {
    render$();
    expect(screen.getByText('Create an account')).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    render$();
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByText('Confirm Password')).toBeInTheDocument();
  });

  it('renders Register button and Sign in link', () => {
    render$();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('shows error when passwords do not match', async () => {
    render$();
    const inputs = document.querySelectorAll('input[type="password"]');
    fireEvent.change(inputs[0], { target: { value: 'pass1' } });
    fireEvent.change(inputs[1], { target: { value: 'pass2' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Register' }).closest('form'));
    expect(toast.error).toHaveBeenCalledWith('Passwords do not match');
  });

  it('calls register on valid form submit', async () => {
    const register = vi.fn().mockResolvedValue({});
    useAuth.mockReturnValue({ register });
    render$();

    // inputs order: first_name, last_name, username, email, password, confirm_password
    const textInputs = document.querySelectorAll('input[type="text"]');
    const emailInput = document.querySelector('input[type="email"]');
    const pwdInputs = document.querySelectorAll('input[type="password"]');
    fireEvent.change(textInputs[0], { target: { value: 'John' } }); // first_name
    fireEvent.change(textInputs[1], { target: { value: 'Doe' } });  // last_name
    fireEvent.change(textInputs[2], { target: { value: 'johndoe' } }); // username
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
    render$();
    const pwdInputs = document.querySelectorAll('input[type="password"]');
    fireEvent.change(pwdInputs[0], { target: { value: 'pass' } });
    fireEvent.change(pwdInputs[1], { target: { value: 'pass' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Register' }).closest('form'));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('This field is required.'));
  });

  it('shows fallback error on network failure', async () => {
    const register = vi.fn().mockRejectedValue(new Error('network'));
    useAuth.mockReturnValue({ register });
    render$();
    const pwdInputs = document.querySelectorAll('input[type="password"]');
    fireEvent.change(pwdInputs[0], { target: { value: 'same' } });
    fireEvent.change(pwdInputs[1], { target: { value: 'same' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Register' }).closest('form'));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Registration failed'));
  });
});
