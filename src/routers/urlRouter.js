import { Router } from 'express';
import urlsController from '../controllers/urlController.js';
import validateSchema from '../middlewares/validateSchema.js';
import validateToken from '../middlewares/validateToken.js';

const urlsRouter = Router();

urlsRouter.post('/shorten', validateSchema('url'), validateToken, urlsController.createShortUrl);
urlsRouter.get('/:id', urlsController.getUrlsById);
urlsRouter.get('/open/:shortUrl', urlsController.redirectToShortUrl);
urlsRouter.delete('/:id', validateToken, urlsController.deleteShortUrl);

export default urlsRouter;
