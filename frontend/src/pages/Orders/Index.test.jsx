// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

vi.mock('../../api/orders', () => ({
  ordersAPI: { list: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn(), updateStatus: vi.fn(), get: vi.fn() },
}));
vi.mock('../../api/customers', () => ({
  customersAPI: { list: vi.fn() },
}));
vi.mock('../../api/inventory', () => ({
  chemicalsAPI: { list: vi.fn() },
}));
vi.mock('react-hot-toast', () => ({ default: { error: vi.fn(), success: vi.fn() } }));

import Orders from './Index';
import { ordersAPI } from '../../api/orders';
import { customersAPI } from '../../api/customers';
import { chemicalsAPI } from '../../api/inventory';

const ORDERS = [
  { id: 1, order_number: 'ORD-001', customer_name: 'Alice', total_amount: 5000, status: 'pending', created_at: '2024-01-01' },
];

function setup() {
  ordersAPI.list.mockResolvedValue({ data: { results: ORDERS, count: 1 } });
  customersAPI.list.mockResolvedValue({ data: [] });
  chemicalsAPI.list.mockResolvedValue({ data: [] });
}

describe('Orders', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows loading spinner initially', () => {
    ordersAPI.list.mockReturnValue(new Promise(() => {}));
    customersAPI.list.mockResolvedValue({ data: [] });
    chemicalsAPI.list.mockResolvedValue({ data: [] });
    render(<Orders />);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders Orders heading after load', async () => {
    setup();
    render(<Orders />);
    await waitFor(() => expect(screen.getByText('Orders')).toBeInTheDocument());
  });

  it('renders order rows when data loaded', async () => {
    setup();
    render(<Orders />);
    await waitFor(() => expect(screen.getByText('ORD-001')).toBeInTheDocument());
  });

  it('shows empty state when no orders', async () => {
    ordersAPI.list.mockResolvedValue({ data: { results: [], count: 0 } });
    customersAPI.list.mockResolvedValue({ data: [] });
    chemicalsAPI.list.mockResolvedValue({ data: [] });
    render(<Orders />);
    await waitFor(() => expect(screen.getByText(/No orders/i)).toBeInTheDocument());
  });

  it('shows error toast when load fails', async () => {
    const toast = (await import('react-hot-toast')).default;
    ordersAPI.list.mockRejectedValue(new Error('fail'));
    customersAPI.list.mockResolvedValue({ data: [] });
    chemicalsAPI.list.mockResolvedValue({ data: [] });
    render(<Orders />);
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  it('renders Create Order button', async () => {
    setup();
    render(<Orders />);
    await waitFor(() => expect(screen.getAllByText('Create Order').length).toBeGreaterThan(0));
  });

  it('opens Create Order dialog on button click', async () => {
    setup();
    render(<Orders />);
    await waitFor(() => screen.getAllByText('Create Order'));
    fireEvent.click(screen.getAllByText('Create Order')[0]);
    await waitFor(() => expect(screen.getByText('Select Customer')).toBeInTheDocument());
  });

  it('renders status filter dropdown', async () => {
    setup();
    render(<Orders />);
    await waitFor(() => expect(screen.getByText('All Status')).toBeInTheDocument());
  });

  it('renders payment filter dropdown', async () => {
    setup();
    render(<Orders />);
    await waitFor(() => expect(screen.getByText('All Payment')).toBeInTheDocument());
  });

  it('renders pagination controls', async () => {
    setup();
    render(<Orders />);
    await waitFor(() => expect(screen.getByText(/Page 1/)).toBeInTheDocument());
  });

  it('renders order status badge', async () => {
    setup();
    render(<Orders />);
    await waitFor(() => expect(screen.getByText('pending')).toBeInTheDocument());
  });
});
