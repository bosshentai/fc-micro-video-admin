import {
  CreateGenreOutput,
  CreateGenreUseCase,
} from '@core/genre/application/use-cases/create-genre/create-genre.use-case';
import { GenresController } from '../genres.controller';
import { CreateGenreDto } from '../dto/create-genre.dto';
import { GenreCollectionPresenter, GenrePresenter } from '../genres.presenter';
import {
  UpdateCategoryOutput,
  UpdateCategoryUseCase,
} from '@core/category/application/use-cases/update-category/update-category.use-case';
import {
  UpdateGenreOutput,
  UpdateGenreUseCase,
} from '@core/genre/application/use-cases/update-genre/update-genre.use-case';
import { Genre } from '@core/genre/domain/genre.aggregate';
import { DeleteGenreUseCase } from '@core/genre/application/use-cases/delete-genre/delete-genre.use-case';
import {
  GetGenreOutput,
  GetGenreUseCase,
} from '@core/genre/application/use-cases/get-genre/get-genre.use-case';
import {
  ListGenresOutput,
  ListGenresUseCase,
} from '@core/genre/application/use-cases/list-genres/list-genres.use-case';
import { SortDirection } from '@core/shared/domain/repository/search-params';

describe('GenresController Unit Tests', () => {
  let controller: GenresController;

  beforeEach(async () => {
    controller = new GenresController();
  });

  it('should create a genre', async () => {
    const output: CreateGenreOutput = {
      id: '93d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b',
      name: 'action',
      categories: [
        {
          id: '3d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b',
          name: 'horror',
          created_at: new Date(),
        },
      ],
      is_active: true,
      categories_id: ['3d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b'],
      created_at: new Date(),
    };

    const mockCreateUpdateCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    controller['createUseCase'] =
      mockCreateUpdateCase as unknown as CreateGenreUseCase;

    const input: CreateGenreDto = {
      name: 'action',
      categories_id: ['3d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b'],
    };

    const presenter = await controller.create(input);
    expect(mockCreateUpdateCase.execute).toHaveBeenCalledWith(input);

    expect(presenter).toBeInstanceOf(GenrePresenter);
    expect(presenter).toStrictEqual(new GenrePresenter(output));
  });

  it('should updates a genre', async () => {
    const id = '93d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b';
    const output: UpdateGenreOutput = {
      id,
      name: 'action',
      categories: [
        {
          id: '3d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b',
          name: 'horror',
          created_at: new Date(),
        },
      ],
      categories_id: ['3d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b'],
      is_active: true,
      created_at: new Date(),
    };

    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    controller['updateUseCase'] =
      mockUpdateUseCase as unknown as UpdateGenreUseCase;

    const input = {
      name: 'action',
      categories_id: ['3d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b'],
    };

    const presenter = await controller.update(id, input);
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({ id, ...input });
    expect(presenter).toBeInstanceOf(GenrePresenter);
    expect(presenter).toStrictEqual(new GenrePresenter(output));
  });

  it('should deletes a category', async () => {
    const expectedOutput = undefined;
    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };

    controller['deleteUseCase'] =
      mockDeleteUseCase as unknown as DeleteGenreUseCase;

    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';

    expect(controller.remove(id)).toBeInstanceOf(Promise);
    const output = await controller.remove(id);
    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
    expect(expectedOutput).toStrictEqual(output);
  });

  it('should gets a category', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    const output: GetGenreOutput = {
      id,
      name: 'action',
      categories: [
        {
          id: '3d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b',
          name: 'horror',
          created_at: new Date(),
        },
      ],
      categories_id: ['3d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b'],
      is_active: true,
      created_at: new Date(),
    };

    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    controller['getUseCase'] = mockGetUseCase as unknown as GetGenreUseCase;
    const presenter = await controller.findOne(id);

    expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });
    expect(presenter).toBeInstanceOf(GenrePresenter);
    expect(presenter).toStrictEqual(new GenrePresenter(output));
  });

  it('should list categories', async () => {
    const output: ListGenresOutput = {
      items: [
        {
          id: '3d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b',
          name: 'horror',
          categories: [
            {
              id: '3d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b',
              name: 'horror',
              created_at: new Date(),
            },
          ],
          is_active: true,
          categories_id: ['3d7d4a9-6f0c-4b1d-8b4b-9b4b4b4b4b4b'],
          created_at: new Date(),
        },
      ],
      current_page: 1,
      per_page: 15,
      last_page: 1,
      total: 1,
    };

    const mockListUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    controller['listUseCase'] = mockListUseCase as unknown as ListGenresUseCase;

    const searchParams = {
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc' as SortDirection,
      filter: { name: 'actor test' },
    };

    const presenter = await controller.search(searchParams);

    expect(presenter).toBeInstanceOf(GenreCollectionPresenter);
    expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParams);
    expect(presenter).toEqual(new GenreCollectionPresenter(output));
  });
});
