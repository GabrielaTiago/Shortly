import { signUpSchema } from '../schemas/authSchema.js';

function signUpMiddleware(req, res, next) {
  const validation = signUpSchema.validate(req.body, { abortEarly: true });

  if (validation.error) return res.status(422).send(validation.error.details);

  next();
}

export { signUpMiddleware };
