import { Router } from 'express';
import { rankingViews } from '../controllers/rankingController.js';

const rankingRoutes = Router();

rankingRoutes.get('/ranking', rankingViews);

export { rankingRoutes };
