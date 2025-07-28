import { connection } from '../database/postgres.js';

async function getUserById(userId) {
  const user = await connection.query('SELECT * FROM users WHERE id = $1', [userId]);
  return user;
}

async function getUserByEmail(email) {
  const user = await connection.query('SELECT * FROM users WHERE email = $1', [email]);
  return user;
}

async function getUserUrls(userId) {
  return await connection.query(
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

async function createUser(name, email, password) {
  await connection.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, password]);
}

async function getTopRankingUsers() {
  const result = await connection.query(
    `
      SELECT 
        u.id,
        u.name,
        COUNT(l.id) AS "linksCount",
        COALESCE(SUM(l."visitCount"), 0)::INTEGER AS "visitCount"
      FROM users u
      LEFT JOIN urls l ON u.id = l."userId"
      GROUP BY u.id
      ORDER BY "visitCount" DESC, "linksCount" DESC
      LIMIT 10;
    `
  );
  return result.rows;
}

const userRepository = {
  getUserByEmail,
  getUserById,
  getUserUrls,
  createUser,
  getTopRankingUsers,
};

export default userRepository;
