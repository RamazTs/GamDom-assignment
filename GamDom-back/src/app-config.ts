require("dotenv").config();
import Joi from "joi";

export type NodeEnv = "development" | "production" | "test";
export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

export interface Env {
  NODE_ENV: NodeEnv;
  PORT: number;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  LOG_LEVEL: LogLevel;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
}

export interface AppConfig {
  port: number;
  nodeEnv: NodeEnv;
  logLevel: LogLevel;
  jwt: {
    secret: string;
    expiresIn: string;
  };
  db: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
}

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  PORT: Joi.number().default(3000),
  JWT_SECRET: Joi.string().default("secret"),
  JWT_EXPIRES_IN: Joi.string().default("1w"),
  LOG_LEVEL: Joi.string()
    .valid("debug", "info", "warn", "error", "fatal")
    .default("debug"),
  DB_HOST: Joi.string().default("localhost"),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().default("postgres"),
  DB_PASSWORD: Joi.string().default("mysecretpassword"),
  DB_DATABASE: Joi.string().default("gamdom"),
});

const validateResult = envSchema.validate({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  LOG_LEVEL: process.env.LOG_LEVEL,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
});

if (validateResult.error) {
  throw new Error(
    `Invalid environment variables: ${validateResult.error.message}`
  );
}

const env: Env = validateResult.value;

export const appConfig: AppConfig = {
  port: env.PORT,
  nodeEnv: env.NODE_ENV,
  logLevel: env.LOG_LEVEL,
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
  },
  db: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
  },
};

export default appConfig;
