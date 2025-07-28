import urlService from '../services/urlService.js';

async function createShortUrl(req, res) {
  const { url } = req.body;
  const userId = res.locals.id;
  const shortUrl = await urlService.createShortUrl(url, userId);
  res.status(201).send({ message: 'Short URL created successfully', ...shortUrl });
}

async function getUrlsById(req, res) {
  const { id: urlId } = req.params;
  const url = await urlService.getUrlById(urlId);
  res.status(200).send(url);
}

async function redirectToShortUrl(req, res) {
  const { shortUrl } = req.params;
  const url = await urlService.redirectToShortUrl(shortUrl);
  res.status(200).redirect(url);
}

async function deleteShortUrl(req, res) {
  const { id } = req.params;
  const userId = res.locals.id;
  await urlService.deleteShortUrl(id, userId);
  res.status(200).send({ message: 'Short URL deleted successfully' });
}

const urlsController = {
  createShortUrl,
  getUrlsById,
  redirectToShortUrl,
  deleteShortUrl,
};

export default urlsController;
