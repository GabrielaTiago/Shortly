import { Router } from 'express';
import authRouter from './authRouter.js';
import rankingRouter from './rankingRouter.js';
import urlsRouter from './urlRouter.js';
import userRouter from './usersRouter.js';

const router = Router();

router.use(authRouter);
router.use('/urls', urlsRouter);
router.use('/users', userRouter);
router.use('/ranking', rankingRouter);

export default router;
