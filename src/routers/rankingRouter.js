import { Router } from 'express';
import { rankingViews } from '../controllers/rankingController.js';

const rankingRouter = Router();

rankingRouter.get('/', rankingViews);

export default rankingRouter;
