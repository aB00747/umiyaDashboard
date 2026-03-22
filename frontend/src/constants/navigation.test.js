import { describe, it, expect } from 'vitest';
import { navigation } from './navigation';

describe('navigation', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(navigation)).toBe(true);
    expect(navigation.length).toBeGreaterThan(0);
  });

  it('each item has name, href, and icon', () => {
    navigation.forEach((item) => {
      expect(typeof item.name).toBe('string');
      expect(typeof item.href).toBe('string');
      expect(item.icon).toBeDefined();
    });
  });

  it('has a home/dashboard link at /', () => {
    expect(navigation.some((item) => item.href === '/')).toBe(true);
  });
});
