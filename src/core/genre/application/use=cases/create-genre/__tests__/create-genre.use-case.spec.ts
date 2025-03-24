import { GenreInMemoryRepository } from '@core/genre/infra/db/in-memory/genre-in-memory.repository';
import { CreateGenreUseCase } from '../create-genre.use-case';
import { CategoryInMemoryRepository } from '@core/category/infra/db/in-memory/category-in-memory.repository';
import { CategoriesIdExistisInDatabaseValidator } from '@core/category/application/validations/categories-ids-exists-in-database.validator';
import { UnitOfWorkFakeInMemory } from '@core/shared/infra/db/in-memory/fake-unit-of-work-in-memory';
import { EntityValidationError } from '@core/shared/domain/validator/validation.error';
import { Category } from '@core/category/domain/category.aggregate';

describe('CreateGenreUseCase Unit Tests', () => {
  let useCase: CreateGenreUseCase;
  let genreRepo: GenreInMemoryRepository;
  let categoryRepo: CategoryInMemoryRepository;
  let categoriesIdsExistsInStorageValidator: CategoriesIdExistisInDatabaseValidator;
  let uow: UnitOfWorkFakeInMemory;

  beforeEach(() => {
    uow = new UnitOfWorkFakeInMemory();
    genreRepo = new GenreInMemoryRepository();
    categoryRepo = new CategoryInMemoryRepository();
    categoriesIdsExistsInStorageValidator =
      new CategoriesIdExistisInDatabaseValidator(categoryRepo);
    useCase = new CreateGenreUseCase(
      uow,
      genreRepo,
      categoryRepo,
      categoriesIdsExistsInStorageValidator,
    );
  });

  describe('execute method', () => {
    it('should throw an entity validation error when categories id is not exists', async () => {
      expect.assertions(3);

      const spyValidateCategoriesId = jest.spyOn(
        categoriesIdsExistsInStorageValidator,
        'validate',
      );

      try {
        await useCase.execute({
          name: 'test',
          categories_id: [
            'b7e9f9a3-1b4c-4b4b-9f9a-3e9f9a3b4c4b',
            '87e9f9a3-1b4c-4b4b-9f9a-3e9f9a3b4c4b',
          ],
        });
      } catch (error) {
        expect(spyValidateCategoriesId).toHaveBeenCalledWith([
          'b7e9f9a3-1b4c-4b4b-9f9a-3e9f9a3b4c4b',
          '87e9f9a3-1b4c-4b4b-9f9a-3e9f9a3b4c4b',
        ]);
        expect(error).toBeInstanceOf(EntityValidationError);
        expect(error.error).toStrictEqual([
          {
            categories_id: [
              'Category Not Found using Id b7e9f9a3-1b4c-4b4b-9f9a-3e9f9a3b4c4b',
              'Category Not Found using Id 87e9f9a3-1b4c-4b4b-9f9a-3e9f9a3b4c4b',
            ],
          },
        ]);
      }
    });

    it('should create a genre', async () => {
      const category1 = Category.fake().aCategory().build();
      const category2 = Category.fake().aCategory().build();

      await categoryRepo.bulkInsert([category1, category2]);
      const spyInsert = jest.spyOn(genreRepo, 'insert');
      const spyUowDo = jest.spyOn(uow, 'do');

      let output = await useCase.execute({
        name: 'test',
        categories_id: [category1.category_id.id, category2.category_id.id],
      });

      expect(spyUowDo).toHaveBeenCalledTimes(1);
      expect(spyInsert).toHaveBeenCalledTimes(1);
      expect(output).toStrictEqual({
        id: genreRepo.items[0].genre_id.id,
        name: 'test',
        categories: [category1, category2].map((entity) => ({
          id: entity.category_id.id,
          name: entity.name,
          created_at: entity.created_at,
        })),
        categories_id: [category1.category_id.id, category2.category_id.id],
        is_active: true,
        created_at: genreRepo.items[0].created_at,
      });

      output = await useCase.execute({
        name: 'test',
        categories_id: [category1.category_id.id, category2.category_id.id],
        is_active: false,
      });

      expect(spyInsert).toHaveBeenCalledTimes(2);
      expect(spyUowDo).toHaveBeenCalledTimes(2);
      expect(output).toStrictEqual({
        id: genreRepo.items[1].genre_id.id,
        name: 'test',
        categories_id: [category1.category_id.id, category2.category_id.id],
        categories: [category1, category2].map((entity) => ({
          id: entity.category_id.id,
          name: entity.name,
          created_at: entity.created_at,
        })),
        is_active: false,
        created_at: genreRepo.items[1].created_at,
      });
    });
  });
});
