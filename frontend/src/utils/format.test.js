import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatDateTime, classNames } from './format';

describe('classNames', () => {
  it('joins truthy classes', () => {
    expect(classNames('a', 'b', 'c')).toBe('a b c');
  });

  it('filters out falsy values', () => {
    expect(classNames('a', false, null, undefined, '', 'b')).toBe('a b');
  });

  it('returns empty string when all falsy', () => {
    expect(classNames(false, null, undefined)).toBe('');
  });
});

describe('formatCurrency', () => {
  it('formats a number as INR currency', () => {
    const result = formatCurrency(1000);
    expect(result).toContain('1,000');
  });

  it('handles zero', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0');
  });

  it('handles null/undefined gracefully', () => {
    const result = formatCurrency(null);
    expect(result).toContain('0');
  });

  it('handles string numbers', () => {
    const result = formatCurrency('500');
    expect(result).toContain('500');
  });
});

describe('formatDate', () => {
  it('returns dash for empty input', () => {
    expect(formatDate('')).toBe('-');
    expect(formatDate(null)).toBe('-');
    expect(formatDate(undefined)).toBe('-');
  });

  it('formats a valid date string', () => {
    const result = formatDate('2024-01-15');
    expect(result).toContain('2024');
    expect(result).toContain('15');
  });
});

describe('formatDateTime', () => {
  it('returns dash for empty input', () => {
    expect(formatDateTime('')).toBe('-');
    expect(formatDateTime(null)).toBe('-');
    expect(formatDateTime(undefined)).toBe('-');
  });

  it('formats a valid datetime string', () => {
    const result = formatDateTime('2024-01-15T10:30:00');
    expect(result).toContain('2024');
  });
});
