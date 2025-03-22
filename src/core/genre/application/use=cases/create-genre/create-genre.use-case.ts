import { IGenreRepository } from './../../../domain/genre.repository';
import { IUseCase } from '@core/shared/application/use-case.interface';
import { CreateGenreInput } from './create--genre.input';
import { GenreOutput, GenreOutputMapper } from '../common/genre-output';
import { IUnitOfWork } from '@core/shared/domain/repository/unit-of-work.interface';
import { ICategoryRepository } from '@core/category/domain/category.repository';
import { Genre } from '@core/genre/domain/genre.aggregate';
import { EntityValidationError } from '@core/shared/domain/validator/validation.error';
import { CateggoriesIdExistisInDatabaseValidator } from '@core/category/application/validations/categories-ids-exists-in-database.validator';

export class CreateGenreUseCase
  implements IUseCase<CreateGenreInput, CreateGenreOutput>
{
  constructor(
    private uow: IUnitOfWork,
    private genreRepo: IGenreRepository,
    private categoryRepo: ICategoryRepository,
    private categoriesIdExistsInDb: CateggoriesIdExistisInDatabaseValidator,
  ) {}

  async execute(input: CreateGenreInput): Promise<GenreOutput> {
    const [categoriesId, errorsCategoriesIds] = (
      await this.categoriesIdExistsInDb.validate(input.categories_id)
    ).asArray();

    const { name, is_active } = input;

    const entity = Genre.create({
      name,
      categories_id: errorsCategoriesIds ? [] : categoriesId,
      is_active,
    });

    const notification = entity.notification;

    if (errorsCategoriesIds) {
      notification.setError(
        errorsCategoriesIds.map((error) => error.message),
        'categories_id',
      );
    }

    if (notification.hasErrors()) {
      throw new EntityValidationError(notification.toJSON());
    }

    await this.uow.do(async () => {
      return this.genreRepo.insert(entity);
    });

    const categories = await this.categoryRepo.findByIds(
      Array.from(entity.categories_id.values()),
    );

    return GenreOutputMapper.toOutput(entity, categories);
  }
}

export type CreateGenreOutput = GenreOutput;
