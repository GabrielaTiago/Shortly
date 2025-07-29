import { afterEach, describe, expect, it, jest } from '@jest/globals';

import userRepository from '../../../src/repositories/userRepository';
import userService from '../../../src/services/userService';

jest.mock('../../../src/repositories/userRepository.js');

const NOT_FOUND_ERROR = { type: 'not_found', message: 'User not found' };

describe('userService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTopRankingUsers', () => {
    it('should return the top ranking users', async () => {
      const mockedRanking = [
        { id: 1, name: 'User1' },
        { id: 2, name: 'User2' },
      ];
      userRepository.getTopRankingUsers.mockResolvedValue(mockedRanking);

      const result = await userService.getTopRankingUsers();

      expect(result).toEqual(mockedRanking);
      expect(userRepository.getTopRankingUsers).toHaveBeenCalled();
    });

    it('should return an empty array if no users are found', async () => {
      userRepository.getTopRankingUsers.mockResolvedValue([]);

      const result = await userService.getTopRankingUsers();

      expect(result).toEqual([]);
      expect(userRepository.getTopRankingUsers).toHaveBeenCalled();
    });
  });

  describe('getUserUrls', () => {
    it('should return URLs for a valid user ID', async () => {
      const userId = 1;
      const mockedUrls = [{ id: 1, url: 'https://example.com' }];

      userRepository.getUserById.mockResolvedValue({ rowCount: 1 });
      userRepository.getUserUrls.mockResolvedValue({ rows: mockedUrls });

      const result = await userService.getUserUrls(userId);

      expect(result).toEqual(mockedUrls);
      expect(userRepository.getUserById).toHaveBeenCalledWith(userId);
      expect(userRepository.getUserUrls).toHaveBeenCalledWith(userId);
    });

    it('should throw an error if the user does not exist', async () => {
      const userId = 1;

      userRepository.getUserById.mockResolvedValue({ rowCount: 0 });

      await expect(userService.getUserUrls(userId)).rejects.toEqual(NOT_FOUND_ERROR);
      expect(userRepository.getUserById).toHaveBeenCalledWith(userId);
      expect(userRepository.getUserUrls).not.toHaveBeenCalled();
    });
  });

  describe('checkUserExists', () => {
    it('should not throw an error if the user exists', async () => {
      const userId = 1;
      userRepository.getUserById.mockResolvedValue({ rowCount: 1 });

      await expect(userService.checkUserExists(userId)).resolves.not.toThrow();
      expect(userRepository.getUserById).toHaveBeenCalledWith(userId);
    });

    it('should throw an error if the user does not exist', async () => {
      const userId = 1;
      userRepository.getUserById.mockResolvedValue({ rowCount: 0 });

      await expect(userService.checkUserExists(userId)).rejects.toEqual(NOT_FOUND_ERROR);
      expect(userRepository.getUserById).toHaveBeenCalledWith(userId);
    });
  });
});
