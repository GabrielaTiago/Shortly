import ERRORS from '../errors/serverErrors.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

async function validateToken(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(ERRORS.unauthorized).send({ message: 'Token is required' });
  }

  try {
    const validToken = jwt.verify(token, process.env.JWT_KEY);

    res.locals.id = validToken.id;

    next();
  } catch (error) {
    console.error(error);
    return res.status(ERRORS.unauthorized).send({ message: 'Invalid or expired token' });
  }
}

export default validateToken;
