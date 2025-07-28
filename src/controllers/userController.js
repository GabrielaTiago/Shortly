import userService from '../services/userService.js';

async function getUserUrls(req, res) {
  const userId = res.locals.id;
  const result = await userService.getUserUrls(userId);
  res.status(200).send(result);
}

async function getTopRankingUsers(req, res) {
  const ranking = await userService.getTopRankingUsers();
  res.status(200).send(ranking);
}

const userController = {
  getUserUrls,
  getTopRankingUsers,
};

export default userController;
