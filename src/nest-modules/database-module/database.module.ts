import { Module } from '@nestjs/common/decorators/modules';
import { ConfigService } from '@nestjs/config';
import { Global, Scope } from '@nestjs/common';
import { getConnectionToken, SequelizeModule } from '@nestjs/sequelize/dist';
import { CONFIG_SCHEMA_TYPE } from 'src/nest-modules/config-module/config.module';
import { CategoryModel } from '../../core/category/infra/db/sequelize/category.model';
import { UnitOfWorkSequelize } from '../../core/shared/infra/db/sequelize/unit-of-work-sequelize';
import { Sequelize } from 'sequelize';
import { GenreModel } from '../../core/genre/infra/db/sequelize/genre-model';
import { GenreCategoryModel } from '../../core/genre/infra/db/sequelize/genre-category-model';
import { CastMemberModel } from '../../core/cast-member/infra/db/sequelize/cast-member.model';
import { VideoModel } from '../../core/video/infra/db/sequelize/video.model';
import { VideoCategoryModel } from '../../core/video/infra/db/sequelize/video-category.model';
import { VideoCastMemberModel } from '../../core/video/infra/db/sequelize/video-cast-member.model';
import { VideoGenreModel } from '../../core/video/infra/db/sequelize/video-genre.model';
import { ImageMediaModel } from '../../core/video/infra/db/sequelize/image-media.model';
import { AudioVideoMediaModel } from '../../core/video/infra/db/sequelize/audio-video-media.model';

const models = [
  CategoryModel,
  GenreModel,
  GenreCategoryModel,
  CastMemberModel,
  VideoModel,
  VideoCategoryModel,
  VideoCastMemberModel,
  VideoGenreModel,
  ImageMediaModel,
  AudioVideoMediaModel,
];

@Global()
@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService<CONFIG_SCHEMA_TYPE>) => {
        const dbVendor = configService.get('DB_VENDOR');

        if (dbVendor === 'sqlite') {
          return {
            dialect: 'sqlite',
            host: configService.get('DB_HOST'),
            models,
            logging: configService.get('DB_LOGGING'),
            autoLoadModels: configService.get('DB_AUTO_LOAD_MODELS'),
          };
        }

        if (dbVendor === 'mysql') {
          return {
            dialect: 'mysql',
            host: configService.get('DB_HOST'),
            port: configService.get('DB_PORT'),
            database: configService.get('DB_DATABASE'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            logging: configService.get('DB_LOGGING'),
            models,
            autoLoadModels: configService.get('DB_AUTO_LOAD_MODELS'),
          };
        }
        throw new Error(`Unsuported database configuration: ${dbVendor}`);
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: UnitOfWorkSequelize,
      useFactory: (sequelize: Sequelize) => {
        return new UnitOfWorkSequelize(sequelize);
      },
      inject: [getConnectionToken()],
      scope: Scope.REQUEST,
    },
    {
      provide: 'UnitOfWork',
      useExisting: UnitOfWorkSequelize,
      scope: Scope.REQUEST,
    },
  ],
  exports: ['UnitOfWork'],
})
export class DatabaseModule {}
