import { Router } from 'express';
import authRouter from './authRouter.js';
import rankingRouter from './rankingRouter.js';
import swaggerUi from 'swagger-ui-express';
import urlsRouter from './urlRouter.js';
import userRouter from './usersRouter.js';
import swaggerDocument from '../../swagger.json' with { type: 'json' };

const router = Router();

router.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.use(authRouter);
router.use('/urls', urlsRouter);
router.use('/users', userRouter);
router.use('/ranking', rankingRouter);

export default router;
