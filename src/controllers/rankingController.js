import { rankingUsers } from '../repositories/rankingRepository.js';

async function rankingViews(req, res) {
  try {
    const { rows: ranking } = await rankingUsers();

    res.status(200).send(ranking);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export { rankingViews };
