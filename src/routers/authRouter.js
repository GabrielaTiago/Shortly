import { Router } from 'express';
import authController from '../controllers/authController.js';
import validateSchema from '../middlewares/validateSchema.js';

const authRouter = Router();

authRouter.post('/signup', validateSchema('signUp'), authController.signUpUsers);
authRouter.post('/signin', validateSchema('signIn'), authController.signInUsers);

export default authRouter;
