import { describe, expect, it } from '@jest/globals';

import generateShortUrl from '../../../src/services/shortUrlGenerator.js';

describe('generateShortUrl', () => {
  it('should generate a string with length 10', () => {
    const shortUrl = generateShortUrl();
    expect(shortUrl).toHaveLength(10);
  });

  it('should generate a different short URL each time', () => {
    const shortUrl1 = generateShortUrl();
    const shortUrl2 = generateShortUrl();
    expect(shortUrl1).not.toEqual(shortUrl2);
  });

  it('should generate a short URL that contains only hexadecimal characters', () => {
    const shortUrl = generateShortUrl();
    const hexRegex = /^[a-fA-F0-9]+$/;
    expect(shortUrl).toMatch(hexRegex);
  });
});
