// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

vi.mock('../../api/inventory', () => ({
  chemicalsAPI: { list: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
  categoriesAPI: { list: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
  vendorsAPI: { list: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
  stockEntriesAPI: { list: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
}));
vi.mock('react-hot-toast', () => ({ default: { error: vi.fn(), success: vi.fn() } }));

import Inventory from './Index';
import { chemicalsAPI, categoriesAPI, vendorsAPI, stockEntriesAPI } from '../../api/inventory';

const CHEMICALS = [
  { id: 1, chemical_name: 'Chemical X', chemical_code: 'CX01', category_name: 'Cat A', quantity: 50, unit: 'KG', min_quantity: 10, selling_price: 100, is_low_stock: false },
];

function setup() {
  chemicalsAPI.list.mockResolvedValue({ data: CHEMICALS });
  categoriesAPI.list.mockResolvedValue({ data: [] });
  vendorsAPI.list.mockResolvedValue({ data: [] });
  stockEntriesAPI.list.mockResolvedValue({ data: [] });
}

describe('Inventory', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows loading spinner initially', () => {
    chemicalsAPI.list.mockReturnValue(new Promise(() => {}));
    categoriesAPI.list.mockResolvedValue({ data: [] });
    vendorsAPI.list.mockResolvedValue({ data: [] });
    stockEntriesAPI.list.mockResolvedValue({ data: [] });
    render(<Inventory />);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders Inventory heading after load', async () => {
    setup();
    render(<Inventory />);
    await waitFor(() => expect(screen.getByText('Inventory')).toBeInTheDocument());
  });

  it('renders chemical rows when data loaded', async () => {
    setup();
    render(<Inventory />);
    await waitFor(() => expect(screen.getByText('Chemical X')).toBeInTheDocument());
  });

  it('shows empty state when no chemicals', async () => {
    chemicalsAPI.list.mockResolvedValue({ data: [] });
    categoriesAPI.list.mockResolvedValue({ data: [] });
    vendorsAPI.list.mockResolvedValue({ data: [] });
    stockEntriesAPI.list.mockResolvedValue({ data: [] });
    render(<Inventory />);
    await waitFor(() => expect(screen.getByText(/No chemicals/i)).toBeInTheDocument());
  });

  it('shows error toast when chemicals load fails', async () => {
    const toast = (await import('react-hot-toast')).default;
    chemicalsAPI.list.mockRejectedValue(new Error('fail'));
    categoriesAPI.list.mockResolvedValue({ data: [] });
    vendorsAPI.list.mockResolvedValue({ data: [] });
    stockEntriesAPI.list.mockResolvedValue({ data: [] });
    render(<Inventory />);
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  it('renders tab navigation', async () => {
    setup();
    render(<Inventory />);
    await waitFor(() => expect(screen.getByText('Chemicals')).toBeInTheDocument());
  });

  it('switches to Categories tab', async () => {
    chemicalsAPI.list.mockResolvedValue({ data: CHEMICALS });
    categoriesAPI.list.mockResolvedValue({ data: [{ id: 1, name: 'Cat A', description: 'desc' }] });
    vendorsAPI.list.mockResolvedValue({ data: [] });
    stockEntriesAPI.list.mockResolvedValue({ data: [] });
    render(<Inventory />);
    await waitFor(() => screen.getByText('Categories'));
    fireEvent.click(screen.getByText('Categories'));
    await waitFor(() => expect(screen.getByText('Cat A')).toBeInTheDocument());
  });

  it('shows empty state in Categories tab', async () => {
    setup();
    render(<Inventory />);
    await waitFor(() => screen.getByText('Categories'));
    fireEvent.click(screen.getByText('Categories'));
    await waitFor(() => expect(screen.getByText(/No categories/i)).toBeInTheDocument());
  });

  it('switches to Vendors tab', async () => {
    chemicalsAPI.list.mockResolvedValue({ data: CHEMICALS });
    categoriesAPI.list.mockResolvedValue({ data: [] });
    vendorsAPI.list.mockResolvedValue({ data: [{ id: 1, vendor_name: 'Vendor X', contact_person: 'John', phone: '1234', gstin: 'GS01' }] });
    stockEntriesAPI.list.mockResolvedValue({ data: [] });
    render(<Inventory />);
    await waitFor(() => screen.getByText('Vendors'));
    fireEvent.click(screen.getByText('Vendors'));
    await waitFor(() => expect(screen.getByText('Vendor X')).toBeInTheDocument());
  });

  it('shows empty state in Vendors tab', async () => {
    setup();
    render(<Inventory />);
    await waitFor(() => screen.getByText('Vendors'));
    fireEvent.click(screen.getByText('Vendors'));
    await waitFor(() => expect(screen.getByText(/No vendors/i)).toBeInTheDocument());
  });

  it('switches to Stock Entries tab', async () => {
    chemicalsAPI.list.mockResolvedValue({ data: CHEMICALS });
    categoriesAPI.list.mockResolvedValue({ data: [] });
    vendorsAPI.list.mockResolvedValue({ data: [] });
    stockEntriesAPI.list.mockResolvedValue({ data: [{ id: 1, chemical_name: 'Chemical X', entry_type: 'purchase', quantity: 10, unit: 'KG', rate: 100, total_value: 1000, created_at: '2024-01-01', vendor_name: 'V1', reference_note: '' }] });
    render(<Inventory />);
    await waitFor(() => screen.getByText('Stock Entries'));
    fireEvent.click(screen.getByText('Stock Entries'));
    await waitFor(() => expect(screen.getByText(/Chemical X/)).toBeInTheDocument());
  });

  it('shows empty state in Stock Entries tab', async () => {
    setup();
    render(<Inventory />);
    await waitFor(() => screen.getByText('Stock Entries'));
    fireEvent.click(screen.getByText('Stock Entries'));
    await waitFor(() => expect(screen.getByText(/No stock entries/i)).toBeInTheDocument());
  });

  it('opens Add Chemical dialog', async () => {
    setup();
    render(<Inventory />);
    await waitFor(() => screen.getByText('Chemicals'));
    const addBtn = screen.getByText(/Add chemical/i);
    fireEvent.click(addBtn);
    await waitFor(() => expect(screen.getAllByText(/Add chemical/i).length).toBeGreaterThan(1));
  });
});
