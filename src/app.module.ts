import { Module } from '@nestjs/common/decorators';
import { CategoriesModule } from './nest-modules/categories-module/categories.module';
import { DatabaseModule } from './nest-modules/database-module/database.module';
import { ConfigModule } from './nest-modules/config-module/config.module';
import { SharedModule } from './nest-modules/shared-module/shared.module';
import { CastMembersModule } from './nest-modules/cast-members/cast-members.module';
import { GenresModule } from './nest-modules/genres-module/genres.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    SharedModule,
    CategoriesModule,
    CastMembersModule,
    GenresModule,
  ],
})
export class AppModule {}
