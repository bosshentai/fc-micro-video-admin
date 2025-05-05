import { Module } from '@nestjs/common/decorators';
import {
  ConfigModuleOptions,
  ConfigModule as NestConfigModule,
} from '@nestjs/config';
import Joi from 'joi';
import { join } from 'path';

const joinJson = Joi.extend((joi) => ({
  type: 'object',
  base: joi.object(),
  coerce: {
    from: 'string',
    method(value, _helpers) {
      if (typeof value !== 'string') return { value };

      const isJsonString = value.trim().startsWith('{');
      if (!isJsonString) return { value };

      try {
        return { value: JSON.parse(value) };
      } catch (err) {
        console.error(err);
        return { value };
      }
    },
  },
}));

type DB_SCHEMA_TYPE = {
  DB_VENDOR: 'mysql' | 'sqlite';
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  DB_LOGGING: boolean;
  DB_AUTO_LOAD_MODELS: boolean;
};

export const CONFIG_BD_SCHEMA: Joi.StrictSchemaMap<DB_SCHEMA_TYPE> = {
  DB_VENDOR: Joi.string().valid('mysql', 'sqlite').required(),
  DB_HOST: Joi.string().required(),
  DB_DATABASE: Joi.string().when('DB_VENDOR', {
    is: 'mysql',
    then: Joi.required(),
  }),
  DB_USERNAME: Joi.string().when('DB_VENDOR', {
    is: 'mysql',
    then: Joi.required(),
  }),
  DB_PASSWORD: Joi.string().when('DB_VENDOR', {
    is: 'mysql',
    then: Joi.required(),
  }),
  DB_PORT: Joi.number().integer().when('DB_VENDOR', {
    is: 'mysql',
    then: Joi.required(),
  }),
  DB_LOGGING: Joi.boolean().required(),
  DB_AUTO_LOAD_MODELS: Joi.boolean(),
};

export type CONFIG_SCHEMA_TYPE = DB_SCHEMA_TYPE;
export type CONFIG_GOOGLE_SCHEMA_TYPE = {
  GOOGLE_CLOUD_CREDENTIALS: object;
  GOOGLE_CLOUD_STORAGE_BUCKET_NAME: string;
};

export const CONFIG_GOOGLE_SCHEMA: Joi.StrictSchemaMap<CONFIG_GOOGLE_SCHEMA_TYPE> =
  {
    GOOGLE_CLOUD_CREDENTIALS: joinJson.object().required(),
    GOOGLE_CLOUD_STORAGE_BUCKET_NAME: Joi.string().required(),
  };

type CONFIG_RABBITMQ_SCHEMA_TYPE = {
  RABBITMQ_URI: string;
};

export const CONFIG_RABBITMQ_SCHEMA: Joi.StrictSchemaMap<CONFIG_RABBITMQ_SCHEMA_TYPE> =
  {
    RABBITMQ_URI: Joi.string().required(),
  };

@Module({})
export class ConfigModule extends NestConfigModule {
  static forRoot(options: ConfigModuleOptions = {}) {
    const { envFilePath, ...otherOptions } = options;

    return super.forRoot({
      isGlobal: true,
      envFilePath: [
        ...(Array.isArray(envFilePath) ? envFilePath : [envFilePath!]),
        join(process.cwd(), 'envs', `.env.${process.env.NODE_ENV}`),
        join(process.cwd(), 'envs', `.env`),
      ],
      validationSchema: Joi.object({
        ...CONFIG_BD_SCHEMA,
        ...CONFIG_GOOGLE_SCHEMA,
        ...CONFIG_RABBITMQ_SCHEMA,
      }),
      ...otherOptions,
    });
  }
}
