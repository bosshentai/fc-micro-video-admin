import { Category, CategoryId } from '@core/category/domain/category.aggregate';
import { CategoryInMemoryRepository } from '@core/category/infra/db/in-memory/category-in-memory.repository';
import { CategoriesIdExistsInDatabaseValidator } from './categories-ids-exists-in-database.validator';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';

describe('CategoriesIdExistsInDatabaseValidator', () => {
  let categoryRepo: CategoryInMemoryRepository;
  let validator: CategoriesIdExistsInDatabaseValidator;

  beforeEach(() => {
    categoryRepo = new CategoryInMemoryRepository();
    validator = new CategoriesIdExistsInDatabaseValidator(categoryRepo);
  });

  it('should throw an entity validation error when categories id is not found', async () => {
    const categoryId1 = new CategoryId();
    const categoryId2 = new CategoryId();
    const spyExistsById = jest.spyOn(categoryRepo, 'existsById');

    let [categoriesId, errorsCategoriesId] = await validator.validate([
      categoryId1.id,
      categoryId2.id,
    ]);
    expect(categoriesId).toStrictEqual(undefined);
    expect(errorsCategoriesId).toStrictEqual([
      new NotFoundError(categoryId1.id, Category),
      new NotFoundError(categoryId2.id, Category),
    ]);

    expect(spyExistsById).toHaveBeenCalledTimes(1);

    const category1 = Category.fake().aCategory().build();

    await categoryRepo.insert(category1);

    [categoriesId, errorsCategoriesId] = await validator.validate([
      category1.category_id.id,
      categoryId2.id,
    ]);

    expect(categoriesId).toStrictEqual(undefined);
    expect(spyExistsById).toHaveBeenCalledTimes(2);
    expect(errorsCategoriesId).toStrictEqual([
      new NotFoundError(categoryId2.id, Category),
    ]);
  });

  it('should return a list of categories id', async () => {
    const category1 = Category.fake().aCategory().build();
    const category2 = Category.fake().aCategory().build();

    await categoryRepo.bulkInsert([category1, category2]);

    const [categoriesId, errorsCategoriesId] = await validator.validate([
      category1.category_id.id,
      category2.category_id.id,
    ]);

    expect(categoriesId).toHaveLength(2);
    expect(errorsCategoriesId).toStrictEqual(undefined);
    expect(categoriesId[0]).toBeValueObject(category1.category_id);
    expect(categoriesId[1]).toBeValueObject(category2.category_id);
  });
});
