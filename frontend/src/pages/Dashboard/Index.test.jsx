// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';


vi.mock('../../api/reports', () => ({
  reportsAPI: { dashboard: vi.fn() },
}));

vi.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({ isDark: false }),
}));

vi.mock('../../contexts/BrandingContext', () => ({
  useBranding: () => ({ systemName: 'Test Dashboard' }),
}));

// Mock recharts to avoid SVG rendering issues in jsdom
vi.mock('recharts', () => ({
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children }) => <div>{children}</div>,
  Cell: () => null,
}));

import Dashboard from './Index';
import { reportsAPI } from '../../api/reports';

const DASHBOARD_DATA = {
  stats: {
    total_revenue: 150000,
    total_orders: 42,
    total_customers: 15,
    low_stock_chemicals: 3,
    pending_orders: 8,
  },
  recent_orders: [
    { id: 1, order_number: 'ORD-001', customer_name: 'Alice', total_amount: 5000, status: 'delivered', created_at: '2024-01-15' },
  ],
  low_stock_items: [
    { id: 1, chemical_name: 'Chemical A', quantity: 2, min_quantity: 10, unit: 'kg' },
  ],
  monthly_data: [
    { month: 'Jan', orders: 10, revenue: 50000 },
    { month: 'Feb', orders: 15, revenue: 75000 },
  ],
};

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading spinner initially', () => {
    reportsAPI.dashboard.mockReturnValue(new Promise(() => {}));
    render(<Dashboard />);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('shows error state when API fails', async () => {
    reportsAPI.dashboard.mockRejectedValue(new Error('fail'));
    render(<Dashboard />);
    await waitFor(() => expect(screen.getByText('Failed to load dashboard data')).toBeInTheDocument());
  });

  it('renders system name from branding context', async () => {
    reportsAPI.dashboard.mockResolvedValue({ data: DASHBOARD_DATA });
    render(<Dashboard />);
    await waitFor(() => expect(screen.getByText('Test Dashboard')).toBeInTheDocument());
  });

  it('renders stat cards after load', async () => {
    reportsAPI.dashboard.mockResolvedValue({ data: DASHBOARD_DATA });
    render(<Dashboard />);
    await waitFor(() => expect(screen.getByText('Total Revenue')).toBeInTheDocument());
    expect(screen.getByText('Total Orders')).toBeInTheDocument();
    expect(screen.getByText('Total Customers')).toBeInTheDocument();
    expect(screen.getByText('Low Stock Items')).toBeInTheDocument();
  });

  it('renders stat values', async () => {
    reportsAPI.dashboard.mockResolvedValue({ data: DASHBOARD_DATA });
    render(<Dashboard />);
    await waitFor(() => expect(screen.getByText('42')).toBeInTheDocument());
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders Monthly Overview chart section', async () => {
    reportsAPI.dashboard.mockResolvedValue({ data: DASHBOARD_DATA });
    render(<Dashboard />);
    await waitFor(() => expect(screen.getByText('Monthly Overview')).toBeInTheDocument());
  });

  it('renders Order Status chart section', async () => {
    reportsAPI.dashboard.mockResolvedValue({ data: DASHBOARD_DATA });
    render(<Dashboard />);
    await waitFor(() => expect(screen.getByText('Order Status')).toBeInTheDocument());
  });

  it('renders Recent Orders section', async () => {
    reportsAPI.dashboard.mockResolvedValue({ data: DASHBOARD_DATA });
    render(<Dashboard />);
    await waitFor(() => expect(screen.getByText('Recent Orders')).toBeInTheDocument());
  });

  it('renders order number in recent orders', async () => {
    reportsAPI.dashboard.mockResolvedValue({ data: DASHBOARD_DATA });
    render(<Dashboard />);
    await waitFor(() => expect(screen.getByText('ORD-001')).toBeInTheDocument());
  });

  it('renders Low Stock Alerts section', async () => {
    reportsAPI.dashboard.mockResolvedValue({ data: DASHBOARD_DATA });
    render(<Dashboard />);
    await waitFor(() => expect(screen.getByText('Low Stock Alerts')).toBeInTheDocument());
    expect(screen.getByText('Chemical A')).toBeInTheDocument();
  });
});
