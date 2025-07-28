import { signInUsers, signUpUsers } from '../controllers/authController.js';

import { Router } from 'express';
import validateSchema from '../middlewares/validateSchema.js';

const authRoutes = Router();

authRoutes.post('/signup', validateSchema('signUp'), signUpUsers);
authRoutes.post('/signin', validateSchema('signIn'), signInUsers);

export { authRoutes };
