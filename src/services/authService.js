import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/userRepository.js';

dotenv.config();

async function signUpUsers(user) {
  const { name, email, password } = user;
  await checkUserExists(email);
  const encryptedPassword = encrypstsPassword(password);
  await userRepository.createUser(name, email, encryptedPassword);
}

async function signInUsers(user) {
  const { email, password } = user;
  const { rows: userData, rowCount } = await userRepository.getUserByEmail(email);

  // Check if the user exists
  const emailExists = rowCount > 0;
  if (!emailExists) {
    const error = { type: 'unauthorized', message: 'Invalid credentials' };
    throw error;
  }

  // Validate the password
  const validPassword = validatePassword(password, userData[0]?.password);
  if (!validPassword) {
    const error = { type: 'unauthorized', message: 'Invalid credentials' };
    throw error;
  }

  // Generate a token for the user
  const token = generateToken({ id: userData[0].id, email: userData[0].email });
  return { message: 'Authentication Success!', token };
}

async function checkUserExists(email) {
  const { rowCount } = await userRepository.getUserByEmail(email);
  if (rowCount > 0) {
    const error = { type: 'conflict', message: 'User with this email already exists' };
    throw error;
  }
}

function encrypstsPassword(password) {
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
}

function validatePassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

function generateToken(user) {
  const { id, email } = user;
  return jwt.sign({ id, email }, process.env.JWT_KEY, { expiresIn: '1d' });
}

const authService = { signInUsers, signUpUsers };

export default authService;
