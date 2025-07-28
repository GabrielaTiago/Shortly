import { connection } from '../database/postgres.js';

async function rankingUsers() {
  return await connection.query(
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
}

export { rankingUsers };
