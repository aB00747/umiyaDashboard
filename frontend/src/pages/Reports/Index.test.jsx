// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

vi.mock('../../api/reports', () => ({
  reportsAPI: { sales: vi.fn(), inventory: vi.fn() },
}));

vi.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({ isDark: false }),
}));

vi.mock('react-hot-toast', () => ({ default: { error: vi.fn(), success: vi.fn() } }));

vi.mock('recharts', () => ({
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  PieChart: ({ children }) => <div>{children}</div>,
  Pie: () => null,
  Cell: () => null,
}));

import Reports from './Index';
import { reportsAPI } from '../../api/reports';

const SALES_DATA = {
  summary: { total_revenue: 500000, total_orders: 100, avg_order_value: 5000 },
  monthly: [{ month: 'Jan 2024', revenue: 50000, orders: 10 }],
  by_customer: [],
};
const INVENTORY_DATA = {
  summary: { total_chemicals: 20, low_stock_count: 3, total_value: 100000 },
  by_category: [],
  low_stock: [],
};

describe('Reports', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows loading spinner initially', () => {
    reportsAPI.sales.mockReturnValue(new Promise(() => {}));
    reportsAPI.inventory.mockReturnValue(new Promise(() => {}));
    render(<Reports />);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders Reports heading after load', async () => {
    reportsAPI.sales.mockResolvedValue({ data: SALES_DATA });
    reportsAPI.inventory.mockResolvedValue({ data: INVENTORY_DATA });
    render(<Reports />);
    await waitFor(() => expect(screen.getByText('Reports & Analytics')).toBeInTheDocument());
  });

  it('renders sales tab by default', async () => {
    reportsAPI.sales.mockResolvedValue({ data: SALES_DATA });
    reportsAPI.inventory.mockResolvedValue({ data: INVENTORY_DATA });
    render(<Reports />);
    await waitFor(() => expect(screen.getByText('sales')).toBeInTheDocument());
  });

  it('renders inventory tab button', async () => {
    reportsAPI.sales.mockResolvedValue({ data: SALES_DATA });
    reportsAPI.inventory.mockResolvedValue({ data: INVENTORY_DATA });
    render(<Reports />);
    await waitFor(() => expect(screen.getByText('inventory')).toBeInTheDocument());
  });

  it('shows error toast when load fails', async () => {
    const toast = (await import('react-hot-toast')).default;
    reportsAPI.sales.mockRejectedValue(new Error('fail'));
    reportsAPI.inventory.mockRejectedValue(new Error('fail'));
    render(<Reports />);
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
