import { Router } from 'express';
import userController from '../controllers/userController.js';

const rankingRouter = Router();

rankingRouter.get('/', userController.getTopRankingUsers);

export default rankingRouter;
