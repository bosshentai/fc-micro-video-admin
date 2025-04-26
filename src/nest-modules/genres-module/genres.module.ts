import { Module } from '@nestjs/common/decorators';
import { SequelizeModule } from '@nestjs/sequelize/dist';
import { GenreCategoryModel } from '@core/genre/infra/db/sequelize/genre-category-model';
import { GenreModel } from '@core/genre/infra/db/sequelize/genre-model';
import { CategoriesModule } from '../categories-module/categories.module';
import { GENRES_PROVIDERS } from './genres.providers';
import { GenresController } from './genres.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([GenreModel, GenreCategoryModel]),
    CategoriesModule,
  ],
  controllers: [GenresController],
  providers: [
    ...Object.values(GENRES_PROVIDERS.REPOSITORIES),
    ...Object.values(GENRES_PROVIDERS.USE_CASES),
  ],
  exports: [GENRES_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide],
})
export class GenresModule {}
