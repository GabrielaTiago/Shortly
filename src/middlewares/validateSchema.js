import ERRORS from '../errors/serverErrors.js';
import schemas from '../schemas/schemas.js';

function validateSchema(schema) {
  if (!schemas[schema]) throw new Error(`Schema ${schema} does not exist`);

  return (req, res, next) => {
    const data = req.body;

    if (!data) return res.status(ERRORS.unprocessable_entity).send('Request body is required');

    const { error } = schemas[schema].validate(data, { abortEarly: false });

    if (error) return res.status(ERRORS.unprocessable_entity).send(error.details.map((err) => err.message));

    return next();
  };
}

export default validateSchema;
