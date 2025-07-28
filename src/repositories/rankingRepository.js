import { connection } from '../database/postgres.js';

async function rankingUsers() {
  return connection.query(
    `
        SELECT 
          us.id,
          name,
          COUNT(ur."linksCount") AS "linksCount",
          COALESCE(SUM(ur."visitCount"), 0) AS "visitCount"
        FROM users us
        LEFT JOIN urls ur
        ON ur."userId" = us.id
        GROUP BY us.id
        ORDER BY "visitCount" DESC
        LIMIT 10
    `
  );
}

export { rankingUsers };
