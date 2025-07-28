import { signInUsers, signUpUsers } from '../controllers/authController.js';

import { Router } from 'express';
import validateSchema from '../middlewares/validateSchema.js';

const authRouter = Router();

authRouter.post('/signup', validateSchema('signUp'), signUpUsers);
authRouter.post('/signin', validateSchema('signIn'), signInUsers);

export default authRouter;
