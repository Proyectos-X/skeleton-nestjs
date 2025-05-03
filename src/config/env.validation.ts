import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().required(),
  NODE_ENV: Joi.string().valid('dev', 'prod').default('dev'),
});
