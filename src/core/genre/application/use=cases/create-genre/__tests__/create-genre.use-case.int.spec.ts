import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { UnitOfWorkSequelize } from '@core/shared/infra/db/sequelize/unit-of-work-sequelize';
import { CreateGenreUseCase } from '../create-genre.use-case';
import { GenreSequelizeRepository } from '@core/genre/infra/db/sequelize/genre-sequelize.repository';
import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category-sequelize.repository';
import { CategoriesIdExistsInDatabaseValidator } from '@core/category/application/validations/categories-ids-exists-in-database.validator';
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { GenreCategoryModel } from '@core/genre/infra/db/sequelize/genre-category-model';
import { GenreModel } from '@core/genre/infra/db/sequelize/genre-model';
import { Category } from '@core/category/domain/category.aggregate';
import { Genre, GenreId } from '@core/genre/domain/genre.aggregate';
import { DatabaseError } from 'sequelize';

describe('CreateGenreUseCase Integration Tests', () => {
  let uow: UnitOfWorkSequelize;
  let useCase: CreateGenreUseCase;
  let genreRepo: GenreSequelizeRepository;
  let categoryRepo: CategorySequelizeRepository;
  let categoriesIdsExistsInStorageValidator: CategoriesIdExistsInDatabaseValidator;

  const sequelizeHelper = setupSequelize({
    models: [GenreModel, GenreCategoryModel, CategoryModel],
  });

  beforeEach(() => {
    uow = new UnitOfWorkSequelize(sequelizeHelper.sequelize);
    genreRepo = new GenreSequelizeRepository(GenreModel, uow);
    categoryRepo = new CategorySequelizeRepository(CategoryModel);
    categoriesIdsExistsInStorageValidator =
      new CategoriesIdExistsInDatabaseValidator(categoryRepo);
    useCase = new CreateGenreUseCase(
      uow,
      genreRepo,
      categoryRepo,
      categoriesIdsExistsInStorageValidator,
    );
  });

  it('should create a genre', async () => {
    const categories = Category.fake().theCategories(2).build();
    await categoryRepo.bulkInsert(categories);

    const categoriesId = categories.map((category) => category.category_id.id);

    let output = await useCase.execute({
      name: 'test genre',
      categories_id: categoriesId,
    });

    let entity = await genreRepo.findById(new GenreId(output.id));
    expect(output).toStrictEqual({
      id: entity!.genre_id.id,
      name: 'test genre',
      categories: expect.arrayContaining(
        categories.map((category) => ({
          id: category.category_id.id,
          name: category.name,
          created_at: category.created_at,
        })),
      ),
      categories_id: expect.arrayContaining(categoriesId),
      is_active: true,
      created_at: entity!.created_at,
    });

    output = await useCase.execute({
      name: 'test genre',
      categories_id: [categories[0].category_id.id],
      is_active: true,
    });

    entity = await genreRepo.findById(new GenreId(output.id));
    expect(output).toStrictEqual({
      id: entity!.genre_id.id,
      name: 'test genre',
      categories: expect.arrayContaining(
        [categories[0]].map((category) => ({
          id: category.category_id.id,
          name: category.name,
          created_at: category.created_at,
        })),
      ),
      categories_id: expect.arrayContaining([categories[0].category_id.id]),
      is_active: true,
      created_at: entity!.created_at,
    });
  });

  it('rollback transaction', async () => {
    const categories = Category.fake().theCategories(2).build();
    await categoryRepo.bulkInsert(categories);
    const categoriesId = categories.map((category) => category.category_id.id);

    const genre = Genre.fake().aGenre().build();
    genre.name = 't'.repeat(256);

    const mockCreate = jest
      .spyOn(Genre, 'create')
      .mockImplementation(() => genre);

    await expect(
      useCase.execute({
        name: 'test genre',
        categories_id: categoriesId,
      }),
    ).rejects.toThrow(DatabaseError);

    const genres = await genreRepo.findAll();
    expect(genres.length).toEqual(0);
    mockCreate.mockRestore();
  });
});
