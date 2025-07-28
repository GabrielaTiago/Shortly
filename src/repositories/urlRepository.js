import { connection } from '../database/postgres';

async function createShortUrl(shortUrl, url, userId) {
  await connection.query('INSERT INTO urls ("shortUrl", url, "userId") VALUES ($1, $2, $3)', [shortUrl, url, userId]);
}

async function getUrlsById(urlId) {
  const res = await connection.query('SELECT id, "shortUrl", url FROM urls WHERE id = $1', [urlId]);
  return res;
}

async function redirectToShortUrl(shortUrl) {
  const res = await connection.query('SELECT * FROM urls WHERE "shortUrl" = $1', [shortUrl]);
  return res;
}

async function deleteShortUrl(shortUrl) {
  await connection.query('DELETE FROM urls WHERE "shortUrl" = $1', [shortUrl]);
}

const urlRepository = {
  createShortUrl,
  getUrlsById,
  redirectToShortUrl,
  deleteShortUrl,
};

export default urlRepository;
