// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

vi.mock('../../api/deliveries', () => ({
  deliveriesAPI: { list: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
}));
vi.mock('../../api/orders', () => ({
  ordersAPI: { list: vi.fn() },
}));
vi.mock('react-hot-toast', () => ({ default: { error: vi.fn(), success: vi.fn() } }));

import Deliveries from './Index';
import { deliveriesAPI } from '../../api/deliveries';
import { ordersAPI } from '../../api/orders';

const DELIVERIES = [
  { id: 1, order_number: 'ORD-001', delivery_date: '2024-01-15', driver_name: 'Bob', status: 'pending', tracking_number: 'TRK001' },
];

describe('Deliveries', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows loading spinner initially', () => {
    deliveriesAPI.list.mockReturnValue(new Promise(() => {}));
    ordersAPI.list.mockResolvedValue({ data: [] });
    render(<Deliveries />);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders Deliveries heading after load', async () => {
    deliveriesAPI.list.mockResolvedValue({ data: [] });
    ordersAPI.list.mockResolvedValue({ data: [] });
    render(<Deliveries />);
    await waitFor(() => expect(screen.getByText('Deliveries')).toBeInTheDocument());
  });

  it('renders delivery rows when data loaded', async () => {
    deliveriesAPI.list.mockResolvedValue({ data: DELIVERIES });
    ordersAPI.list.mockResolvedValue({ data: [] });
    render(<Deliveries />);
    await waitFor(() => expect(screen.getByText('TRK001')).toBeInTheDocument());
  });

  it('shows empty state when no deliveries', async () => {
    deliveriesAPI.list.mockResolvedValue({ data: [] });
    ordersAPI.list.mockResolvedValue({ data: [] });
    render(<Deliveries />);
    await waitFor(() => expect(screen.getByText(/No deliveries/i)).toBeInTheDocument());
  });

  it('shows error toast when load fails', async () => {
    const toast = (await import('react-hot-toast')).default;
    deliveriesAPI.list.mockRejectedValue(new Error('fail'));
    ordersAPI.list.mockResolvedValue({ data: [] });
    render(<Deliveries />);
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  it('renders status filter dropdown', async () => {
    deliveriesAPI.list.mockResolvedValue({ data: [] });
    ordersAPI.list.mockResolvedValue({ data: [] });
    render(<Deliveries />);
    await waitFor(() => expect(screen.getByText('All Status')).toBeInTheDocument());
  });

  it('renders Add Delivery button', async () => {
    deliveriesAPI.list.mockResolvedValue({ data: [] });
    ordersAPI.list.mockResolvedValue({ data: [] });
    render(<Deliveries />);
    await waitFor(() => expect(screen.getByText('Add Delivery')).toBeInTheDocument());
  });

  it('opens Add Delivery dialog on button click', async () => {
    deliveriesAPI.list.mockResolvedValue({ data: [] });
    ordersAPI.list.mockResolvedValue({ data: { results: [] } });
    render(<Deliveries />);
    await waitFor(() => screen.getByText('Add Delivery'));
    fireEvent.click(screen.getByText('Add Delivery'));
    await waitFor(() => expect(screen.getByText('Add Delivery', { selector: 'h3' })).toBeInTheDocument());
  });

  it('renders delivery status badge', async () => {
    deliveriesAPI.list.mockResolvedValue({ data: DELIVERIES });
    ordersAPI.list.mockResolvedValue({ data: [] });
    render(<Deliveries />);
    await waitFor(() => expect(screen.getByText('pending')).toBeInTheDocument());
  });
});
