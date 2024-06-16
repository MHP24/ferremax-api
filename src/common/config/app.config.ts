import { config } from 'dotenv';
import * as joi from 'joi';
config();

interface EnvVars {
  PORT: number;
  DB_URL: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_EXPIRE_TEXT: string;
  JWT_REFRESH_EXPIRE_TEXT: string;
  JWT_EXPIRE_SECONDS: number;
  STATIC_FILE_PATH: string;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    DB_URL: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    JWT_REFRESH_SECRET: joi.string().required(),
    JWT_EXPIRE_TEXT: joi.string().required(),
    JWT_REFRESH_EXPIRE_TEXT: joi.string().required(),
    JWT_EXPIRE_SECONDS: joi.number().required(),
    STATIC_FILE_PATH: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate(process.env);
if (error) {
  throw new Error(error.message);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  dbUrl: envVars.DB_URL,
  jwtSecret: envVars.JWT_SECRET,
  jwtRefreshSecret: envVars.JWT_REFRESH_SECRET,
  jwtExpireText: envVars.JWT_EXPIRE_TEXT,
  jwtRefreshExpireText: envVars.JWT_REFRESH_EXPIRE_TEXT,
  jwtExpireSeconds: envVars.JWT_EXPIRE_SECONDS,
  staticFilePath: envVars.STATIC_FILE_PATH,
};
