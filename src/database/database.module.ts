import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { Module } from '@nestjs/common/decorators/modules';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize/dist';
import { CONFIG_SCHEMA_TYPE } from 'src/config/config.module';

const models = [CategoryModel];

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService<CONFIG_SCHEMA_TYPE>) => {
        const dbVendor = configService.get('DB_VENDOR');
        if (dbVendor === 'mysql') {
          return {
            dialect: 'mysql',
            host: configService.get('DB_HOST'),
            port: configService.get('DB_PORT'),
            database: configService.get('DB_DATABASE'),
            username: configService.get('DB_USERBNAME'),
            password: configService.get('DB_PASSWORD'),
            models,
            logging: configService.get('DB_LOGGING'),
            autoLoadModels: configService.get('DB_AUTO_LOAD_MODELS'),
          };
        }
        if (dbVendor === 'sqlite') {
          return {
            dialect: 'sqlite',
            host: configService.get('DB_HOST'),
            models,
            logging: configService.get('DB_LOGGING'),
            autoLoadModels: configService.get('DB_AUTO_LOAD_MODELS'),
          };
        }
        throw new Error(`Unsuported database configuration: ${dbVendor}`);
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
