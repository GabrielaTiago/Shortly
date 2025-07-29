import { jest } from '@jest/globals';

jest.mock('pg', () => {
  const mPool = {
    connect: jest.fn().mockResolvedValue({ query: jest.fn(), release: jest.fn() }),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});
