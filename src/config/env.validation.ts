import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().required(),
  NODE_ENV: Joi.string().valid('dev', 'prod').default('dev'),
  // Database
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  DB_HOST: Joi.string().hostname().required(),
  DB_PORT: Joi.number().default(5432),

  // TypeORM
  TYPEORM_AUTOLOAD: Joi.boolean().truthy('true').falsy('false').default(true),
  TYPEORM_SYNCHRONIZE: Joi.boolean()
    .truthy('true')
    .falsy('false')
    .default(false),
  TYPEORM_LOGGING: Joi.boolean().truthy('true').falsy('false').default(false),
});
