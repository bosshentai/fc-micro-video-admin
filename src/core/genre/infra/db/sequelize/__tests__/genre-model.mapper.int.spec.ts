import { ICategoryRepository } from '@core/category/domain/category.repository';
import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { GenreModel } from '../genre-model';
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { GenreCategoryModel } from '../genre-category-model';
import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category-sequelize.repository';
import { GenreModelMapper } from '../genre-model-mapper';
import { LoadEntityError } from '@core/shared/domain/validator/validation.error';
import { Category } from '@core/category/domain/category.aggregate';
import { Genre, GenreId } from '@core/genre/domain/genre.aggregate';

describe('GenreModelMapper Unit Tests', () => {
  let categoryRepo: ICategoryRepository;

  setupSequelize({ models: [CategoryModel, GenreModel, GenreCategoryModel] });

  beforeEach(() => {
    categoryRepo = new CategorySequelizeRepository(CategoryModel);
  });

  it('should throw error when genre is invalid', async () => {
    const arrange = [
      {
        makeModel: () => {
          return GenreModel.build({
            genre_id: '93d5a7a7-9e3a-4a4a-9e3a-4a4a9e3a4a4a',
            name: 't'.repeat(256),
            categories_id: [],
            created_at: new Date(),
            is_active: true,
          });
        },
        expectedErrors: [
          {
            categories_id: ['categories_id should not be empty'],
          },
          {
            name: ['name must be shorter than or equal to 255 characters'],
          },
        ],
      },
    ];

    for (const item of arrange) {
      try {
        GenreModelMapper.toEntity(item.makeModel());
        fail('The genre is valid, but it needs throws a LoadEntityError');
      } catch (error) {
        expect(error).toBeInstanceOf(LoadEntityError);
        expect(error.error).toMatchObject(item.expectedErrors);
      }
    }
  });

  it('should convert a genre model to a genre entity', async () => {
    const category1 = Category.fake().aCategory().build();
    const category2 = Category.fake().aCategory().build();
    await categoryRepo.bulkInsert([category1, category2]);
    const created_at = new Date();

    const model = await GenreModel.create(
      {
        genre_id: '93d5a7a7-9e3a-4a4a-9e3a-4a4a9e3a4a4a',
        name: 'Movie',
        categories_id: [
          GenreCategoryModel.build({
            genre_id: '93d5a7a7-9e3a-4a4a-9e3a-4a4a9e3a4a4a',
            category_id: category1.category_id.id,
          }),
          GenreCategoryModel.build({
            genre_id: '93d5a7a7-9e3a-4a4a-9e3a-4a4a9e3a4a4a',
            category_id: category2.category_id.id,
          }),
        ],
        created_at,
        is_active: true,
      },
      { include: ['categories_id'] },
    );

    const entity = GenreModelMapper.toEntity(model);

    expect(entity.toJSON()).toEqual(
      new Genre({
        genre_id: new GenreId('93d5a7a7-9e3a-4a4a-9e3a-4a4a9e3a4a4a'),
        name: 'Movie',
        categories_id: new Map([
          [category1.category_id.id, category1.category_id],
          [category2.category_id.id, category2.category_id],
        ]),
        is_active: true,
        created_at,
      }).toJSON(),
    );
  });
});
