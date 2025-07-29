import { afterEach, describe, expect, it, jest } from '@jest/globals';

import authService from '../../../src/services/authService.js';
import userRepository from '../../../src/repositories/userRepository.js';

jest.mock('../../../src/repositories/userRepository.js');

const CONFLICT_ERROR = { type: 'conflict', message: 'User with this email already exists' };
const UNAUTHORIZED_ERROR = { type: 'unauthorized', message: 'Invalid credentials' };

describe('authService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signUpUsers', () => {
    it('should sign up a new user', async () => {
      const user = { name: 'Test User', email: 'test@email.com', password: 'testPassword' };

      userRepository.getUserByEmail.mockResolvedValueOnce({ rowCount: 0 });
      userRepository.createUser.mockResolvedValueOnce();
      await authService.signUpUsers(user);

      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(user.email);
      expect(userRepository.createUser).toHaveBeenCalledWith(user.name, user.email, expect.any(String));
    });

    it('should throw an error if the user already exists', async () => {
      const user = { name: 'Test User', email: 'test@email.com', password: 'testPassword' };

      userRepository.getUserByEmail.mockResolvedValueOnce({ rowCount: 1 });

      await expect(authService.signUpUsers(user)).rejects.toEqual(CONFLICT_ERROR);
      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(user.email);
      expect(userRepository.createUser).not.toHaveBeenCalled();
    });
  });

  describe('signInUsers', () => {
    it('should sign in a user with valid credentials', async () => {
      const user = { email: 'test@email.com', password: 'testPassword' };
      const hashedPassword = authService.encrypstsPassword(user.password);

      userRepository.getUserByEmail.mockResolvedValueOnce({ rows: [{ id: 1, email: user.email, password: hashedPassword }], rowCount: 1 });
      const result = await authService.signInUsers(user);

      expect(result).toEqual({ message: 'Authentication Success!', token: expect.any(String) });
      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(user.email);
    });

    it('should throw an error if the user does not exist', async () => {
      const user = { email: 'test@email.com', password: 'testPassword' };

      userRepository.getUserByEmail.mockResolvedValueOnce({ rows: [], rowCount: 0 });

      await expect(authService.signInUsers(user)).rejects.toEqual(UNAUTHORIZED_ERROR);
      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(user.email);
    });

    it('should throw an error if the password is invalid', async () => {
      const user = { email: 'test@email.com', password: 'wrongPassword' };

      userRepository.getUserByEmail.mockResolvedValueOnce({ rows: [{ id: 1, email: user.email, password: 'hashedPassword' }], rowCount: 1 });

      await expect(authService.signInUsers(user)).rejects.toEqual(UNAUTHORIZED_ERROR);
      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(user.email);
    });
  });

  describe('checkUserExists', () => {
    it('should throw an error if the user already exists', async () => {
      const email = 'email@test.com';

      userRepository.getUserByEmail.mockResolvedValueOnce({ rowCount: 1 });

      await expect(authService.checkUserExists(email)).rejects.toEqual(CONFLICT_ERROR);
    });

    it('should not throw an error if the user does not exist', async () => {
      const email = 'email@test.com';

      userRepository.getUserByEmail.mockResolvedValueOnce({ rowCount: 0 });

      await expect(authService.checkUserExists(email)).resolves.not.toThrow();
    });
  });
  describe('encrypstsPassword', () => {
    it('should encrypt the password', () => {
      const password = 'testPassword';
      const encryptedPassword = authService.encrypstsPassword(password);

      expect(encryptedPassword).toBeDefined();
      expect(typeof encryptedPassword).toBe('string');
      expect(encryptedPassword).not.toBe(password);
    });
  });

  describe('validatePassword', () => {
    it('should validate the password against the hashed password', () => {
      const password = 'testPassword';
      const hashedPassword = authService.encrypstsPassword(password);

      const isValid = authService.validatePassword(password, hashedPassword);

      expect(isValid).toBe(true);
    });

    it('should return false for an invalid password', () => {
      const password = 'testPassword';
      const hashedPassword = authService.encrypstsPassword(password);

      const isValid = authService.validatePassword('wrongPassword', hashedPassword);

      expect(isValid).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should generate a token for the user', () => {
      const user = { id: 1, email: 'email@test.com' };

      const token = authService.generateToken(user);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should throw an error if JWT_KEY is not defined', () => {
      const backupKey = process.env.JWT_KEY;
      delete process.env.JWT_KEY;

      try {
        expect(() => authService.generateToken({ id: 1, email: 'email@test.com' })).toThrow('secretOrPrivateKey must have a value');
      } finally {
        process.env.JWT_KEY = backupKey;
      }
    });
  });
});
