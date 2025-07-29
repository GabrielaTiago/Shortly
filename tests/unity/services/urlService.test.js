import { afterEach, describe, expect, it, jest } from '@jest/globals';

import generateShortUrl from '../../../src/services/shortUrlGenerator.js';
import urlRepository from '../../../src/repositories/urlRepository.js';
import urlService from '../../../src/services/urlService.js';
import userService from '../../../src/services/userService.js';

jest.mock('../../../src/repositories/urlRepository.js');
jest.mock('../../../src/services/shortUrlGenerator.js');
jest.mock('../../../src/services/userService.js');

const NOT_FOUND_ERROR = { type: 'not_found', message: 'URL not found' };
const UNAUTHORIZED_ERROR = { type: 'unauthorized', message: 'User not authorized to delete this URL' };

describe('urlService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createShortUrl', () => {
    it('should create a short URL for a valid URL and user ID', async () => {
      const url = 'https://example.com';
      const userId = 1;
      const mockedShortUrl = '12345abcde';

      generateShortUrl.mockReturnValue(mockedShortUrl);
      userService.checkUserExists.mockResolvedValue();
      urlRepository.createShortUrl.mockResolvedValue();

      const result = await urlService.createShortUrl(url, userId);

      expect(result).toEqual({ shortUrl: mockedShortUrl });
      expect(generateShortUrl).toHaveBeenCalled();
      expect(userService.checkUserExists).toHaveBeenCalledWith(userId);
      expect(urlRepository.createShortUrl).toHaveBeenCalledWith(mockedShortUrl, url, userId);
    });

    it('should throw an error if the user does not exist', async () => {
      const url = 'https://example.com';
      const userId = 1;

      userService.checkUserExists.mockRejectedValue(NOT_FOUND_ERROR);

      await expect(urlService.createShortUrl(url, userId)).rejects.toEqual(NOT_FOUND_ERROR);
      expect(userService.checkUserExists).toHaveBeenCalledWith(userId);
      expect(urlRepository.createShortUrl).not.toHaveBeenCalled();
    });
  });

  describe('getUrlById', () => {
    it('should return the URL for a valid URL ID', async () => {
      const urlId = 1;
      const mockedUrl = { id: urlId, url: 'https://example.com', userId: 1 };

      urlRepository.getUrlById.mockResolvedValue({ rows: [mockedUrl], rowCount: 1 });

      const result = await urlService.getUrlById(urlId);

      expect(result).toEqual(mockedUrl);
      expect(urlRepository.getUrlById).toHaveBeenCalledWith(urlId);
    });

    it('should throw an error if the URL does not exist', async () => {
      const urlId = 1;

      urlRepository.getUrlById.mockResolvedValue({ rows: [], rowCount: 0 });

      await expect(urlService.getUrlById(urlId)).rejects.toEqual(NOT_FOUND_ERROR);
      expect(urlRepository.getUrlById).toHaveBeenCalledWith(urlId);
    });
  });

  describe('redirectToShortUrl', () => {
    it('should return the original URL for a valid short URL', async () => {
      const shortUrl = '12345abcde';
      const mockedUrl = { url: 'https://example.com', visitCount: 0 };
      const expectedVisitCount = mockedUrl.visitCount + 1;

      urlRepository.getUrlByShortUrl.mockResolvedValue({ rows: [mockedUrl], rowCount: 1 });
      urlRepository.updateVisitCount = jest.fn().mockResolvedValue();

      const result = await urlService.redirectToShortUrl(shortUrl);

      expect(result).toEqual(mockedUrl.url);
      expect(urlRepository.getUrlByShortUrl).toHaveBeenCalledWith(shortUrl);

      expect(urlRepository.updateVisitCount).toHaveBeenCalledWith(shortUrl, expectedVisitCount);
    });

    it('should throw an error if the short URL does not exist', async () => {
      const shortUrl = '12345abcde';

      urlRepository.getUrlByShortUrl.mockResolvedValue({ rows: [], rowCount: 0 });

      await expect(urlService.redirectToShortUrl(shortUrl)).rejects.toEqual(NOT_FOUND_ERROR);
      expect(urlRepository.getUrlByShortUrl).toHaveBeenCalledWith(shortUrl);
    });
  });

  describe('updateVisitCount', () => {
    it('should update the visit count for a short URL', async () => {
      const shortUrl = '12345abcde';
      const visitCount = 5;
      const updatedVisitCount = visitCount + 1;

      urlRepository.updateVisitCount.mockResolvedValue();

      await urlService.updateVisitCount(shortUrl, visitCount);

      expect(urlRepository.updateVisitCount).toHaveBeenCalledWith(shortUrl, updatedVisitCount);
      expect(urlRepository.updateVisitCount).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteShortUrl', () => {
    it('should delete a short URL for a valid URL ID and user ID', async () => {
      const urlId = 1;
      const userId = 1;
      const mockedUrl = { id: urlId, userId: userId };

      userService.checkUserExists.mockResolvedValue();
      urlRepository.getUrlById.mockResolvedValue({ rows: [mockedUrl], rowCount: 1 });
      urlRepository.deleteShortUrl.mockResolvedValue();

      await urlService.deleteShortUrl(urlId, userId);

      expect(userService.checkUserExists).toHaveBeenCalledWith(userId);
      expect(urlRepository.getUrlById).toHaveBeenCalledWith(urlId);
      expect(urlRepository.deleteShortUrl).toHaveBeenCalledWith(urlId);
    });

    it('should throw an error if the URL does not exist', async () => {
      const urlId = 1;
      const userId = 1;

      userService.checkUserExists.mockResolvedValue();
      urlRepository.getUrlById.mockResolvedValue({ rows: [], rowCount: 0 });

      await expect(urlService.deleteShortUrl(urlId, userId)).rejects.toEqual(NOT_FOUND_ERROR);
      expect(userService.checkUserExists).toHaveBeenCalledWith(userId);
      expect(urlRepository.getUrlById).toHaveBeenCalledWith(urlId);
      expect(urlRepository.deleteShortUrl).not.toHaveBeenCalled();
    });
    it('should throw an error if the user is not authorized to delete the URL', async () => {
      const urlId = 1;
      const userId = 2; // Different user ID
      const mockedUrl = { id: urlId, userId: 1 };

      userService.checkUserExists.mockResolvedValue();
      urlRepository.getUrlById.mockResolvedValue({ rows: [mockedUrl], rowCount: 1 });

      await expect(urlService.deleteShortUrl(urlId, userId)).rejects.toEqual(UNAUTHORIZED_ERROR);
      expect(userService.checkUserExists).toHaveBeenCalledWith(userId);
      expect(urlRepository.getUrlById).toHaveBeenCalledWith(urlId);
      expect(urlRepository.deleteShortUrl).not.toHaveBeenCalled();
    });
  });

  describe('validateUrlExists', () => {
    it('should throw an error if the URL does not exist', async () => {
      const rowCount = 0;
      const expectedError = { type: 'not_found', message: 'URL not found' };

      expect(() => urlService.validateUrlExists(rowCount)).toThrow(expectedError);
    });
    it('should not throw an error if the URL exists', async () => {
      const rowCount = 1;

      expect(() => urlService.validateUrlExists(rowCount)).not.toThrow();
    });
  });
});
