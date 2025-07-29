import generateShortUrl from './shortUrlGenerator.js';
import urlRepository from '../repositories/urlRepository.js';
import userService from './userService.js';

async function createShortUrl(url, userId) {
  await userService.checkUserExists(userId);
  const shortUrl = generateShortUrl();

  await urlRepository.createShortUrl(shortUrl, url, userId);
  return { shortUrl };
}

async function getUrlById(urlId) {
  let { rows: url, rowCount } = await urlRepository.getUrlById(urlId);
  validateUrlExists(rowCount);
  delete url[0].userId;
  return url[0];
}

async function redirectToShortUrl(shortUrl) {
  const { rows: url, rowCount } = await urlRepository.getUrlByShortUrl(shortUrl);
  validateUrlExists(rowCount);
  await updateVisitCount(shortUrl, url[0].visitCount);
  return url[0].url;
}

async function updateVisitCount(shortUrl, visitCount) {
  const updatedVisitCount = visitCount + 1;
  await urlRepository.updateVisitCount(shortUrl, updatedVisitCount);
}

async function deleteShortUrl(urlId, userId) {
  await userService.checkUserExists(userId);
  const { rowCount, rows: url } = await urlRepository.getUrlById(urlId);
  validateUrlExists(rowCount);
  if (url[0].userId !== userId) {
    const error = { type: 'unauthorized', message: 'User not authorized to delete this URL' };
    throw error;
  }
  await urlRepository.deleteShortUrl(urlId);
}

function validateUrlExists(rowCount) {
  if (rowCount === 0) {
    const error = { type: 'not_found', message: 'URL not found' };
    throw error;
  }
}

const urlService = {
  createShortUrl,
  getUrlById,
  redirectToShortUrl,
  updateVisitCount,
  deleteShortUrl,
  validateUrlExists,
};

export default urlService;
