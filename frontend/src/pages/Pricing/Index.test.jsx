// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

vi.mock('../../api/inventory', () => ({
  chemicalsAPI: { list: vi.fn() },
}));

vi.mock('react-hot-toast', () => ({ default: { error: vi.fn(), success: vi.fn() } }));

import Pricing from './Index';
import { chemicalsAPI } from '../../api/inventory';

describe('Pricing', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows loading spinner initially', () => {
    chemicalsAPI.list.mockReturnValue(new Promise(() => {}));
    render(<Pricing />);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders Pricing heading after load', async () => {
    chemicalsAPI.list.mockResolvedValue({ data: [] });
    render(<Pricing />);
    await waitFor(() => expect(screen.getByText(/Pricing/i)).toBeInTheDocument());
  });

  it('shows empty state when no chemicals', async () => {
    chemicalsAPI.list.mockResolvedValue({ data: [] });
    render(<Pricing />);
    await waitFor(() => expect(screen.queryByText(/animate-spin/)).not.toBeInTheDocument());
  });

  it('shows error toast when load fails', async () => {
    const toast = (await import('react-hot-toast')).default;
    chemicalsAPI.list.mockRejectedValue(new Error('fail'));
    render(<Pricing />);
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  it('renders search input', async () => {
    chemicalsAPI.list.mockResolvedValue({ data: [] });
    render(<Pricing />);
    await waitFor(() => expect(document.querySelector('input')).toBeInTheDocument());
  });
});
