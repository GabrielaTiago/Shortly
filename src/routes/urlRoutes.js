import { createShortUrl, deleteShortUrl, getUrlsById, redirectToShortUrl } from '../controllers/urlController.js';

import { Router } from 'express';
import validateSchema from '../middlewares/validateSchema.js';
import { validateToken } from '../middlewares/validateToken.js';

const urlsRoutes = Router();

urlsRoutes.post('/urls/shorten', validateSchema('url'), validateToken, createShortUrl);
urlsRoutes.get('/urls/:id', getUrlsById);
urlsRoutes.get('/urls/open/:shortUrl', redirectToShortUrl);
urlsRoutes.delete('/urls/:id', validateToken, deleteShortUrl);

export { urlsRoutes };
