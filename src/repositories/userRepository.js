import { connection } from '../database/postgres.js';

async function checksIfUserExits(userId) {
  return connection.query('SELECT * FROM users WHERE id = $1', [userId]);
}

async function userUrls(userId) {
  return connection.query(
    `SELECT 
              us.id,
              name,
              SUM(ur."visitCount") AS "visitCount",
              ARRAY_AGG(
                  JSON_BUILD_OBJECT(
                      'id', ur.id,
                      'shortUrl', ur."shortUrl",
                      'url', ur.url,
                      'visitCount', ur."visitCount"
                  )) AS "shortenedUrls"
           FROM users us
           JOIN urls ur
           ON ur."userId" = us.id
           WHERE us.id = $1
           GROUP BY us.id`,
    [userId]
  );
}

export { checksIfUserExits, userUrls };
