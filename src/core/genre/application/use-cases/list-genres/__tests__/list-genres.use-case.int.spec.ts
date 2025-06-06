import { UnitOfWorkSequelize } from '@core/shared/infra/db/sequelize/unit-of-work-sequelize';
import { ListGenresUseCase } from '../list-genres.use-case';
import { GenreSequelizeRepository } from '@core/genre/infra/db/sequelize/genre-sequelize.repository';
import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category-sequelize.repository';
import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { GenreModel } from '@core/genre/infra/db/sequelize/genre-model';
import { GenreCategoryModel } from '@core/genre/infra/db/sequelize/genre-category-model';
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { Category, CategoryId } from '@core/category/domain/category.aggregate';
import { Genre } from '@core/genre/domain/genre.aggregate';
import { GenreOutputMapper } from '../../common/genre-output';

describe('ListGenresUseCase Integration Tests', () => {
  let uow: UnitOfWorkSequelize;
  let useCase: ListGenresUseCase;
  let genreRepo: GenreSequelizeRepository;
  let categoryRepo: CategorySequelizeRepository;

  const sequelizehelper = setupSequelize({
    models: [GenreModel, GenreCategoryModel, CategoryModel],
  });

  beforeEach(() => {
    uow = new UnitOfWorkSequelize(sequelizehelper.sequelize);
    genreRepo = new GenreSequelizeRepository(GenreModel, uow);
    categoryRepo = new CategorySequelizeRepository(CategoryModel);
    useCase = new ListGenresUseCase(genreRepo, categoryRepo);
  });

  it('should return output sorted by created_at when input param is empty', async () => {
    const categories = Category.fake().theCategories(3).build();
    await categoryRepo.bulkInsert(categories);
    const genres = Genre.fake()
      .theGenres(16)
      .withCreatedAt((index) => new Date(new Date().getTime() + 1000 * index))
      .addCategoryId(categories[0].category_id)
      .addCategoryId(categories[1].category_id)
      .addCategoryId(categories[2].category_id)
      .build();

    await genreRepo.bulkInsert(genres);

    const output = await useCase.execute({});

    expect(output).toEqual({
      items: [...genres]
        .reverse()
        .slice(0, 15)
        .map((item) => formatOutput(item, categories)),
      total: 16,
      current_page: 1,
      last_page: 2,
      per_page: 15,
    });
  });

  describe('should search applying filter by name, sort and paginate', () => {
    const categories = Category.fake().theCategories(3).build();

    const genres = [
      Genre.fake()
        .aGenre()
        .withName('test')
        .withCreatedAt(new Date(new Date().getTime() + 4000))
        .addCategoryId(categories[0].category_id)
        .addCategoryId(categories[1].category_id)
        .addCategoryId(categories[2].category_id)
        .build(),
      Genre.fake()
        .aGenre()
        .withName('a')
        .withCreatedAt(new Date(new Date().getTime() + 3000))
        .addCategoryId(categories[0].category_id)
        .addCategoryId(categories[1].category_id)
        .addCategoryId(categories[2].category_id)
        .build(),
      Genre.fake()
        .aGenre()
        .withName('TEST')
        .withCreatedAt(new Date(new Date().getTime() + 2000))
        .addCategoryId(categories[0].category_id)
        .addCategoryId(categories[1].category_id)
        .addCategoryId(categories[2].category_id)
        .build(),
      Genre.fake()
        .aGenre()
        .withName('TeSt')
        .withCreatedAt(new Date(new Date().getTime() + 1000))
        .addCategoryId(categories[0].category_id)
        .addCategoryId(categories[1].category_id)
        .addCategoryId(categories[2].category_id)
        .build(),
    ];

    const arrange = [
      {
        input: {
          page: 1,
          per_page: 2,
          sort: 'name',
          filter: { name: 'TEST' },
        },
        output: {
          items: [genres[2], genres[3]].map((item) =>
            formatOutput(item, categories),
          ),
          total: 3,
          current_page: 1,
          last_page: 2,
          per_page: 2,
        },
      },
      {
        input: {
          page: 2,
          per_page: 2,
          sort: 'name',
          filter: { name: 'TEST' },
        },
        output: {
          items: [genres[0]].map((item) => formatOutput(item, categories)),
          total: 3,
          current_page: 2,
          last_page: 2,
          per_page: 2,
        },
      },
    ];

    beforeEach(async () => {
      await categoryRepo.bulkInsert(categories);
      await genreRepo.bulkInsert(genres);
    });

    test.each(arrange)(
      'when value $search_params',
      async ({ input, output: expectedOutput }) => {
        const output = await useCase.execute(input);
        expect(output).toEqual(expectedOutput);
      },
    );
  });

  describe('should search applying filter by categories_id, sort and paginate', () => {
    const categories = Category.fake().theCategories(4).build();

    const genres = [
      Genre.fake()
        .aGenre()
        .addCategoryId(categories[0].category_id)
        .withName('test')
        .build(),
      Genre.fake()
        .aGenre()
        .addCategoryId(categories[0].category_id)
        .addCategoryId(categories[1].category_id)
        .withName('a')
        .build(),
      Genre.fake()
        .aGenre()
        .addCategoryId(categories[0].category_id)
        .addCategoryId(categories[1].category_id)
        .addCategoryId(categories[2].category_id)
        .withName('TEST')
        .build(),
      Genre.fake()
        .aGenre()
        .addCategoryId(categories[3].category_id)
        .withName('e')
        .build(),
      Genre.fake()
        .aGenre()
        .addCategoryId(categories[1].category_id)
        .addCategoryId(categories[2].category_id)
        .withName('TeSt')
        .build(),
    ];

    const arrange = [
      {
        input: {
          page: 1,
          per_page: 2,
          sort: 'name',
          filter: { categories_id: [categories[0].category_id.id] },
        },
        output: {
          items: [
            formatOutput(genres[2], [
              categories[0],
              categories[1],
              categories[2],
            ]),
            formatOutput(genres[1], [categories[0], categories[1]]),
          ],
          total: 3,
          current_page: 1,
          last_page: 2,
          per_page: 2,
        },
      },
      {
        input: {
          page: 2,
          per_page: 2,
          sort: 'name',
          filter: { categories_id: [categories[0].category_id.id] },
        },
        output: {
          items: [formatOutput(genres[0], [categories[0]])],
          total: 3,
          current_page: 2,
          last_page: 2,
          per_page: 2,
        },
      },
    ];

    beforeEach(async () => {
      await categoryRepo.bulkInsert(categories);
      await genreRepo.bulkInsert(genres);
    });

    test.each(arrange)(
      'when input is $input and output is $output',
      async ({ input, output: expectedOutput }) => {
        const output = await useCase.execute(input);
        expect(output).toEqual(expectedOutput);
      },
    );
  });

  describe('should search using filter by name and categories_id, sort and paginate', () => {
    const categories = Category.fake().theCategories(4).build();

    const genres = [
      Genre.fake()
        .aGenre()
        .addCategoryId(categories[0].category_id)
        .addCategoryId(categories[1].category_id)
        .withName('test')
        .build(),
      Genre.fake()
        .aGenre()
        .addCategoryId(categories[0].category_id)
        .addCategoryId(categories[1].category_id)
        .withName('a')
        .build(),
      Genre.fake()
        .aGenre()
        .addCategoryId(categories[0].category_id)
        .addCategoryId(categories[1].category_id)
        .addCategoryId(categories[2].category_id)
        .withName('TEST')
        .build(),
      Genre.fake()
        .aGenre()
        .addCategoryId(categories[3].category_id)
        .withName('e')
        .build(),
      Genre.fake()
        .aGenre()
        .addCategoryId(categories[1].category_id)
        .addCategoryId(categories[2].category_id)
        .withName('TeSt')
        .build(),
    ];

    const arrange = [
      {
        input: {
          page: 1,
          per_page: 2,
          sort: 'name',
          filter: {
            name: 'TEST',
            categories_id: [categories[1].category_id.id],
          },
        },
        output: {
          items: [
            formatOutput(genres[2], [
              categories[0],
              categories[1],
              categories[2],
            ]),
            formatOutput(genres[4], [categories[1], categories[2]]),
          ],
          total: 3,
          current_page: 1,
          last_page: 2,
          per_page: 2,
        },
      },
      {
        input: {
          page: 2,
          per_page: 2,
          sort: 'name',
          filter: {
            name: 'TEST',
            categories_id: [categories[1].category_id.id],
          },
        },
        output: {
          items: [formatOutput(genres[0], [categories[0]])],
          total: 3,
          current_page: 2,
          last_page: 2,
          per_page: 2,
        },
      },
    ];

    beforeEach(async () => {
      await categoryRepo.bulkInsert(categories);
      await genreRepo.bulkInsert(genres);
    });

    test.each(arrange)(
      'when input is $input and output is $output',
      async ({ input, output: expectedOutput }) => {
        const output = await useCase.execute(input);
        expect(output).toEqual(expectedOutput);
      },
    );
  });
});

function formatOutput(genre: Genre, categories: Category[]) {
  const output = GenreOutputMapper.toOutput(genre, categories);
  return {
    ...output,
    categories: expect.arrayContaining(
      output.categories.map((c) => expect.objectContaining(c)),
    ),
    categories_id: expect.arrayContaining(output.categories_id),
  };
}
