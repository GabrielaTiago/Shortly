import { checksIfEmailExists, signIn } from '../repositories/authRepository.js';

import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

async function signInUsers(req, res) {
  const { email, password } = req.body;

  try {
    const { rows: user, rowCount } = await checksIfEmailExists(email);

    if (rowCount === 0) return res.sendStatus(404);

    const id = user[0].id;
    const validEmail = user[0].email;
    const validPassword = bcrypt.compareSync(password, user[0].password);

    if (validEmail && validPassword) {
      const token = jwt.sign({ id, email, password }, process.env.JWT_KEY, { expiresIn: '1d' });

      res.status(200).send({
        message: 'Authentication Success',
        token: token,
      });
    } else {
      res.status(401).send('Authentication Failure');
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

async function signUpUsers(req, res) {
  const { name, email, password } = req.body;

  try {
    const { rowCount } = await checksIfEmailExists(email);

    if (rowCount === 1) return res.sendStatus(409);

    const encryptedPassword = bcrypt.hashSync(password, 10);

    await signIn(name, email, encryptedPassword);

    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

const authController = {
  signInUsers,
  signUpUsers,
};

export default authController;
