import userRepository from '../repositories/userRepository.js';

async function getTopRankingUsers() {
  const ranking = await userRepository.getTopRankingUsers();
  return ranking;
}

async function getUserUrls(userId) {
  await checkUserExists(userId);
  const { rows: userUrls } = await userRepository.getUserUrls(userId);
  return userUrls;
}

async function checkUserExists(userId) {
  const { rowCount } = await userRepository.getUserById(userId);
  if (rowCount === 0) {
    const error = { type: 'not_found', message: 'User not found' };
    throw error;
  }
}

const userService = {
  getTopRankingUsers,
  getUserUrls,
  checkUserExists,
};

export default userService;
