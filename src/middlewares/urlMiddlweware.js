import { urlSchema } from '../schemas/urlSchema.js';

function urlMiddleware(req, res, next) {
  const validation = urlSchema.validate(req.body, { abortEarly: true });

  if (validation.error) return res.status(422).send(validation.error.details);

  next();
}

export { urlMiddleware };
