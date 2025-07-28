import { Router } from 'express';
import { getUserData } from '../controllers/userController.js';
import { validateToken } from '../middlewares/validateToken.js';

const userRouter = Router();

userRouter.get('/me', validateToken, getUserData);

export default userRouter;
