import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

async function validateToken(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');

  try {
    const validToken = jwt.verify(token, process.env.JWT_KEY);

    res.locals.id = validToken.id;

    next();
  } catch (error) {
    console.error(error);
    res.status(401).send('Authentication Failure');
  }
}

export { validateToken };
