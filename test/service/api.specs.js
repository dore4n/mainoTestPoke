import { describe, it, expect } from 'vitest';
import api from '@/service/api';

describe('api.js', () => {
  it('creates axios instance with correct base URL', () => {
    expect(api.defaults.baseURL).toBe('https://pokeapi.co/api/v2');
  });

  it('handles network errors', async () => {
    api.get.mockRejectedValue(new Error('Network Error'));
    try {
      await api.get('/pokemon');
      expect(false).toBe(true);
    } catch (error) {
      expect(error.message).toBe('Network Error');
    }
  });
});
