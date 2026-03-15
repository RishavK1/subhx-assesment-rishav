import { validate } from '../../common/middlewares/validate.middleware.js';
import { loginRequestSchema, registerRequestSchema } from './auth.schema.js';

export const validateRegister = validate({
  body: registerRequestSchema
});

export const validateLogin = validate({
  body: loginRequestSchema
});
