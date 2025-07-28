import { checksIfUserExits, userUrls } from '../repositories/userRepository.js';

async function getUserData(req, res) {
  const userId = res.locals.id;

  try {
    const { rowCount } = await checksIfUserExits(userId);

    if (rowCount === 0) return res.sendStatus(404);

    const { rows: userInfo } = await userUrls(userId);

    res.status(200).send(userInfo);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

const userController = {
  getUserData,
};

export default userController;
