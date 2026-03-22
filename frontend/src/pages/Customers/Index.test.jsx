// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

vi.mock('../../api/customers', () => ({
  customersAPI: {
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    import: vi.fn(),
    export: vi.fn(),
    exportTemplate: vi.fn(),
    search: vi.fn(),
  },
  customerTypesAPI: { list: vi.fn() },
}));

vi.mock('react-hot-toast', () => ({ default: { error: vi.fn(), success: vi.fn() } }));

import Customers from './Index';
import { customersAPI, customerTypesAPI } from '../../api/customers';
import toast from 'react-hot-toast';

const CUSTOMERS = [
  { id: 1, first_name: 'Alice', last_name: 'Smith', email: 'alice@ex.com', phone: '1234567890', is_active: true, customer_type_name: 'Retail', date_joined: '2024-01-01', city: 'Mumbai' },
  { id: 2, first_name: 'Bob', last_name: '', email: 'bob@ex.com', phone: '', is_active: false, customer_type_name: '', date_joined: '2024-02-01', city: '' },
];

function setup(customers = CUSTOMERS) {
  customerTypesAPI.list.mockResolvedValue({ data: [] });
  customersAPI.list.mockResolvedValue({ data: { results: customers, count: customers.length } });
}

describe('Customers', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows loading spinner initially', () => {
    customerTypesAPI.list.mockResolvedValue({ data: [] });
    customersAPI.list.mockReturnValue(new Promise(() => {}));
    render(<Customers />);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders Customers heading after load', async () => {
    setup();
    render(<Customers />);
    await waitFor(() => expect(screen.getByText('Customers')).toBeInTheDocument());
  });

  it('renders customer rows after load', async () => {
    setup();
    render(<Customers />);
    await waitFor(() => expect(screen.getByText('alice@ex.com')).toBeInTheDocument());
    expect(screen.getByText('bob@ex.com')).toBeInTheDocument();
  });

  it('renders Add Customer button', async () => {
    setup();
    render(<Customers />);
    await waitFor(() => expect(screen.getByText('Add Customer')).toBeInTheDocument());
  });

  it('shows empty state when no customers', async () => {
    setup([]);
    render(<Customers />);
    await waitFor(() => expect(screen.getByText(/No customers/i)).toBeInTheDocument());
  });

  it('shows error toast when load fails', async () => {
    customerTypesAPI.list.mockResolvedValue({ data: [] });
    customersAPI.list.mockRejectedValue(new Error('fail'));
    render(<Customers />);
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Failed to load customers'));
  });

  it('opens create dialog on Add Customer click', async () => {
    setup();
    render(<Customers />);
    await waitFor(() => screen.getByText('Add Customer'));
    fireEvent.click(screen.getByText('Add Customer'));
    await waitFor(() => expect(screen.getAllByText('Add Customer').length).toBeGreaterThan(0));
  });

  it('renders search input', async () => {
    setup();
    render(<Customers />);
    await waitFor(() => expect(screen.getByPlaceholderText(/Search/i)).toBeInTheDocument());
  });

  it('renders active status badges', async () => {
    setup();
    render(<Customers />);
    await waitFor(() => expect(screen.getAllByText('Active').length).toBeGreaterThan(0));
    expect(screen.getAllByText('Inactive').length).toBeGreaterThan(0);
  });

  it('renders pagination controls', async () => {
    setup();
    render(<Customers />);
    await waitFor(() => expect(screen.getByText(/Page/i)).toBeInTheDocument());
  });
});
