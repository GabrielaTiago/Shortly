import { Router } from 'express';
import { getUserData } from '../controllers/userController.js';
import { validateToken } from '../middlewares/validateToken.js';

const userRoutes = Router();

userRoutes.get('/users/me', validateToken, getUserData);

export { userRoutes };
