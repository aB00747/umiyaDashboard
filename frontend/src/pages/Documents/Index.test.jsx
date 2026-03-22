// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

vi.mock('../../api/documents', () => ({
  documentsAPI: { list: vi.fn(), upload: vi.fn(), delete: vi.fn(), get: vi.fn() },
}));

vi.mock('react-hot-toast', () => ({ default: { error: vi.fn(), success: vi.fn() } }));

import Documents from './Index';
import { documentsAPI } from '../../api/documents';

const DOCS = [
  { id: 1, title: 'Invoice 001', category: 'invoice', file_url: 'http://file.pdf', uploaded_at: '2024-01-01', file_size: 1024 },
];

describe('Documents', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows loading spinner initially', () => {
    documentsAPI.list.mockReturnValue(new Promise(() => {}));
    render(<Documents />);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders Documents heading after load', async () => {
    documentsAPI.list.mockResolvedValue({ data: [] });
    render(<Documents />);
    await waitFor(() => expect(screen.getByRole('heading', { name: /Documents/i })).toBeInTheDocument());
  });

  it('renders document rows when data loaded', async () => {
    documentsAPI.list.mockResolvedValue({ data: DOCS });
    render(<Documents />);
    await waitFor(() => expect(screen.getByText('Invoice 001')).toBeInTheDocument());
  });

  it('shows empty state when no documents', async () => {
    documentsAPI.list.mockResolvedValue({ data: [] });
    render(<Documents />);
    await waitFor(() => expect(screen.getByText(/No documents/i)).toBeInTheDocument());
  });

  it('shows error toast when load fails', async () => {
    const toast = (await import('react-hot-toast')).default;
    documentsAPI.list.mockRejectedValue(new Error('fail'));
    render(<Documents />);
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });
});
