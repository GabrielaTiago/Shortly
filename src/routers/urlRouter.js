import { createShortUrl, deleteShortUrl, getUrlsById, redirectToShortUrl } from '../controllers/urlController.js';

import { Router } from 'express';
import validateSchema from '../middlewares/validateSchema.js';
import { validateToken } from '../middlewares/validateToken.js';

const urlsRouter = Router();

urlsRouter.post('/shorten', validateSchema('url'), validateToken, createShortUrl);
urlsRouter.get('/:id', getUrlsById);
urlsRouter.get('/open/:shortUrl', redirectToShortUrl);
urlsRouter.delete('/:id', validateToken, deleteShortUrl);

export default urlsRouter;
