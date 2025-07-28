import { Router } from 'express';
import userController from '../controllers/userController.js';
import validateToken from '../middlewares/validateToken.js';

const userRouter = Router();

userRouter.get('/me', validateToken, userController.getUserData);

export default userRouter;
