import joi from 'joi';

const urlSchema = joi.object({
  url: joi.string().required().messages({
    'string.empty': 'URL cannot be empty',
    'any.required': 'URL is required',
  }),
});

export default urlSchema;
