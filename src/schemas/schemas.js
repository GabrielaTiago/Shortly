import authSchema from './authSchema.js';
import urlSchema from './urlSchema.js';

const schemas = {
  signIn: authSchema.signInSchema,
  signUp: authSchema.signUpSchema,
  url: urlSchema,
};

export default schemas;
