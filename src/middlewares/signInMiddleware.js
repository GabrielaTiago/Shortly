import { signInSchema } from '../schemas/authSchema.js';

function signInMiddleware(req, res, next) {
  const validation = signInSchema.validate(req.body, { abortEarly: true });

  if (validation.error) return res.status(422).send(validation.error.details);

  next();
}

export { signInMiddleware };
