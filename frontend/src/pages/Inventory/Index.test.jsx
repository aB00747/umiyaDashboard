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

function setupAll({ chemicals = CHEMICALS, categories = [], vendors = [], stock = [] } = {}) {
  chemicalsAPI.list.mockResolvedValue({ data: chemicals });
  categoriesAPI.list.mockResolvedValue({ data: categories });
  vendorsAPI.list.mockResolvedValue({ data: vendors });
  stockEntriesAPI.list.mockResolvedValue({ data: stock });
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

  it('shows empty chemicals state', async () => {
    setupAll({ chemicals: [] });
    render(<Inventory />);
    await waitFor(() => expect(screen.getByText(/No chemicals/i)).toBeInTheDocument());
  });

  it('shows error toast when load fails', async () => {
    const toast = (await import('react-hot-toast')).default;
    chemicalsAPI.list.mockRejectedValue(new Error('fail'));
    categoriesAPI.list.mockResolvedValue({ data: [] });
    vendorsAPI.list.mockResolvedValue({ data: [] });
    stockEntriesAPI.list.mockResolvedValue({ data: [] });
    render(<Inventory />);
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  describe('with loaded data', () => {
    beforeEach(async () => {
      setupAll();
      render(<Inventory />);
      await waitFor(() => screen.getByText('Inventory'));
    });

    it('renders heading, chemical rows and tab navigation', () => {
      expect(screen.getByText('Inventory')).toBeInTheDocument();
      expect(screen.getByText('Chemical X')).toBeInTheDocument();
      expect(screen.getByText('Chemicals')).toBeInTheDocument();
    });

    it('opens Add Chemical dialog', async () => {
      fireEvent.click(screen.getByText(/Add chemical/i));
      await waitFor(() => expect(screen.getAllByText(/Add chemical/i).length).toBeGreaterThan(1));
    });

    describe('Categories tab', () => {
      beforeEach(() => fireEvent.click(screen.getByText('Categories')));

      it('shows empty state', async () => {
        await waitFor(() => expect(screen.getByText(/No categories/i)).toBeInTheDocument());
      });
    });

    describe('Vendors tab', () => {
      beforeEach(() => fireEvent.click(screen.getByText('Vendors')));

      it('shows empty state', async () => {
        await waitFor(() => expect(screen.getByText(/No vendors/i)).toBeInTheDocument());
      });
    });

    describe('Stock Entries tab', () => {
      beforeEach(() => fireEvent.click(screen.getByText('Stock Entries')));

      it('shows empty state', async () => {
        await waitFor(() => expect(screen.getByText(/No stock entries/i)).toBeInTheDocument());
      });
    });
  });

  it('shows category data in Categories tab', async () => {
    setupAll({ categories: [{ id: 1, name: 'Cat A', description: 'desc' }] });
    render(<Inventory />);
    await waitFor(() => screen.getByText('Categories'));
    fireEvent.click(screen.getByText('Categories'));
    await waitFor(() => expect(screen.getByText('Cat A')).toBeInTheDocument());
  });

  it('shows vendor data in Vendors tab', async () => {
    setupAll({ vendors: [{ id: 1, vendor_name: 'Vendor X', contact_person: 'John', phone: '1234', gstin: 'GS01' }] });
    render(<Inventory />);
    await waitFor(() => screen.getByText('Vendors'));
    fireEvent.click(screen.getByText('Vendors'));
    await waitFor(() => expect(screen.getByText('Vendor X')).toBeInTheDocument());
  });

  it('shows stock entry data in Stock Entries tab', async () => {
    setupAll({ stock: [{ id: 1, chemical_name: 'Chemical X', entry_type: 'purchase', quantity: 10, unit: 'KG', rate: 100, total_value: 1000, created_at: '2024-01-01', vendor_name: 'V1', reference_note: '' }] });
    render(<Inventory />);
    await waitFor(() => screen.getByText('Stock Entries'));
    fireEvent.click(screen.getByText('Stock Entries'));
    await waitFor(() => expect(screen.getByText(/Chemical X/)).toBeInTheDocument());
  });
});
