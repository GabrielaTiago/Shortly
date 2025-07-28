import { connection } from '../database/postgres.js';

async function createShortUrl(shortUrl, url, userId) {
  await connection.query('INSERT INTO urls ("shortUrl", url, "userId") VALUES ($1, $2, $3)', [shortUrl, url, userId]);
}

async function getUrlById(urlId) {
  const res = await connection.query('SELECT id, "shortUrl", url, "userId" FROM urls WHERE id = $1', [urlId]);
  return res;
}

async function getUrlByShortUrl(shortUrl) {
  const res = await connection.query('SELECT * FROM urls WHERE "shortUrl" = $1', [shortUrl]);
  return res;
}

async function updateVisitCount(shortUrl, visitCount) {
  await connection.query('UPDATE urls SET "visitCount" = $1 WHERE "shortUrl" = $2', [visitCount, shortUrl]);
}

async function deleteShortUrl(urlId) {
  await connection.query('DELETE FROM urls WHERE id = $1', [urlId]);
}

const urlRepository = {
  createShortUrl,
  getUrlById,
  getUrlByShortUrl,
  updateVisitCount,
  deleteShortUrl,
};

export default urlRepository;
