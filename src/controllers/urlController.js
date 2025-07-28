import { connection } from '../database/postgres.js';
import { nanoid } from 'nanoid/non-secure';

async function createShortUrl(req, res) {
  const { url } = req.body;
  const userId = res.locals.id;
  const shortUrl = nanoid(10);

  try {
    await connection.query(
      `INSERT INTO urls ("shortUrl", url, "userId")
         VALUES ($1, $2, $3)`,
      [shortUrl, url, userId]
    );

    res.status(201).send({ shortUrl: shortUrl });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

async function getUrlsById(req, res) {
  const { id } = req.params;

  try {
    const { rows: userUrls, rowCount } = await connection.query(`SELECT id, "shortUrl", url FROM urls WHERE "userId" = $1`, [id]);

    if (rowCount === 0) return res.sendStatus(404);

    res.status(200).send(userUrls);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

async function redirectToShortUrl(req, res) {
  const { shortUrl } = req.params;

  try {
    const { rows: macthUrl, rowCount } = await connection.query('SELECT * FROM urls WHERE "shortUrl" = $1', [shortUrl]);

    if (rowCount === 0) return res.sendStatus(404);

    const defaultUrl = macthUrl[0].url;
    const addOneView = macthUrl[0].visitCount + 1;

    await connection.query(
      `UPDATE urls "visitCount" SET "visitCount" = $1
          WHERE "shortUrl" = $2
          `,
      [addOneView, shortUrl]
    );

    res.redirect(defaultUrl);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

async function deleteShortUrl(req, res) {
  const { id } = req.params;
  const userId = res.locals.id;

  try {
    const { rowCount } = await connection.query('SELECT * FROM urls WHERE id = $1', [id]);

    if (rowCount === 0) return res.sendStatus(404);

    const { rows: user } = await connection.query('SELECT * FROM urls WHERE "userId" = $1 AND id = $2', [userId, id]);

    if (user.length === 0) return res.sendStatus(401);

    await connection.query(
      `DELETE FROM urls
       WHERE id = $1`,
      [id]
    );

    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

const urlsController = {
  createShortUrl,
  getUrlsById,
  redirectToShortUrl,
  deleteShortUrl,
};

export default urlsController;
