import { Category, CategoryId } from '@core/category/domain/category.aggregate';
import { ICategoryRepository } from '@core/category/domain/category.repository';
import { Either } from '@core/shared/domain/either';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';

export class CateggoriesIdExistisInDatabaseValidator {
  constructor(private categoryRepo: ICategoryRepository) {}

  async validate(
    categories_id: string[],
  ): Promise<Either<CategoryId[], NotFoundError[]>> {
    const categoriesId = categories_id.map((id) => new CategoryId(id));

    const existsResult = await this.categoryRepo.existsById(categoriesId);

    // console.log(existsResult);

    return existsResult.not_exists.length > 0
      ? Either.fail(
          existsResult.not_exists.map(
            (category) => new NotFoundError(category.id, Category),
          ),
        )
      : Either.ok(categoriesId);
  }
}
