import { Module } from '@nestjs/common/decorators';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './nest-modules/categories-module/categories.module';
import { DatabaseModule } from './nest-modules/database-module/database.module';
import { ConfigModule } from './nest-modules/config-module/config.module';
import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { getModelToken } from '@nestjs/sequelize';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
