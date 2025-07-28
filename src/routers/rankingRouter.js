import { Router } from 'express';
import rankingController from '../controllers/rankingController.js';

const rankingRouter = Router();

rankingRouter.get('/', rankingController.rankingViews);

export default rankingRouter;
