import { Module } from '@nestjs/common/decorators';
import { CategoriesModule } from './nest-modules/categories-module/categories.module';
import { DatabaseModule } from './nest-modules/database-module/database.module';
import { ConfigModule } from './nest-modules/config-module/config.module';
import { SharedModule } from './nest-modules/shared-module/shared.module';
import { CastMembersModule } from './nest-modules/cast-members/cast-members.module';
import { GenresModule } from './nest-modules/genres-module/genres.module';
import { VideosModuleModule } from './nest-modules/videos-module/videos.module';
import { EventModule } from './nest-modules/event-module/event.module';
import { UseCaseModule } from './nest-modules/use-case-module/use-case.module';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    SharedModule,
    EventModule,
    UseCaseModule,
    CategoriesModule,
    CastMembersModule,
    GenresModule,
    VideosModuleModule,
    RabbitMQModule.forRoot({
      uri: 'amqp://admin:admint@rabbitmq:5672',
      // connectionInitOptions: { wait: false },
    }),
  ],
})
export class AppModule {}
