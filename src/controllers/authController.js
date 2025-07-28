import authService from '../services/authService.js';

async function signInUsers(req, res) {
  const userData = req.body;
  const result = await authService.signInUsers(userData);
  res.status(200).send(result);
}

async function signUpUsers(req, res) {
  const userData = req.body;
  await authService.signUpUsers(userData);
  res.status(201).send({ message: 'User created successfully' });
}

const authController = {
  signInUsers,
  signUpUsers,
};

export default authController;
