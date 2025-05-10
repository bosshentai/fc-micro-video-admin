import { VideoMedia } from '@core/video/domain/value-object/video-media.vo';
import { AudioVideoMediaModel } from '@core/video/infra/db/sequelize/audio-video-media.model';
import { ImageMediaModel } from '@core/video/infra/db/sequelize/image-media.model';
import { VideoCastMemberModel } from '@core/video/infra/db/sequelize/video-cast-member.model';
import { VideoCategoryModel } from '@core/video/infra/db/sequelize/video-category.model';
import { VideoGenreModel } from '@core/video/infra/db/sequelize/video-genre.model';
import { VideoModel } from '@core/video/infra/db/sequelize/video.model';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CategoriesModule } from '../categories-module/categories.module';
import { GenresModule } from '../genres-module/genres.module';
import { VIDEO_PROVIDERS } from './videos.providers';
import { VideoController } from './videos.controller';
import { RabbitmqModule } from '../rabbitmq-module/rabbitmq.module';
import { VideosConsumers } from './videos.consumers';
import { CastMembersModule } from '../cast-members-module/cast-members.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      VideoModel,
      VideoCategoryModel,
      VideoGenreModel,
      VideoCastMemberModel,
      ImageMediaModel,
      AudioVideoMediaModel,
    ]),
    RabbitmqModule.forFeature(),
    CategoriesModule,
    GenresModule,
    CastMembersModule,
  ],
  controllers: [VideoController],
  providers: [
    ...Object.values(VIDEO_PROVIDERS.REPOSITORIES),
    ...Object.values(VIDEO_PROVIDERS.USE_CASES),
    ...Object.values(VIDEO_PROVIDERS.HANDLERS),
    VideosConsumers,
  ],
})
export class VideosModule {}
