import {
  CreateCategoryOutput,
  CreateCategoryUseCase,
} from '@core/category/application/use-cases/create-category/create-category.use-case';
import { CategoriesController } from '../categories.controller';
import { CreateCategoryDto } from '../dto/create-category.dto';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from '../categories.presenter';
import {
  UpdateCategoryOutput,
  UpdateCategoryUseCase,
} from '@core/category/application/use-cases/update-category/update-category.use-case';
import { UpdateCategoryInput } from '@core/category/application/use-cases/update-category/update-category.input';
import { DeleteCategoryUseCase } from '@core/category/application/use-cases/delete-category/delete-category.use-case';
import {
  GetCategoryOutput,
  GetCategoryUseCase,
} from '@core/category/application/use-cases/get-category/get-category.use-case';
import {
  ListCategoriesOutput,
  ListCategoriesUseCase,
} from '@core/category/application/use-cases/list-category/list-category.use-case';
import { SortDirection } from '@core/shared/domain/repository/search-params';

describe('CategoriesController Unit Tests', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    controller = new CategoriesController();
  });

  it('should creates a category', async () => {
    const output: CreateCategoryOutput = {
      id: '93b7e8b1-0c5e-4b9a-8e0a-6b1e8b7a0c5e',
      name: 'Movie',
      description: 'Movie description',
      is_active: true,
      created_at: new Date(),
    };

    const mockCategoryRepo = {
      insert: jest.fn(),
    };

    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
      categoryRepo: mockCategoryRepo,
    };

    controller['createUseCase'] =
      mockCreateUseCase as unknown as CreateCategoryUseCase;

    const input: CreateCategoryDto = {
      name: 'Movie',
      description: 'Movie description',
      is_active: true,
    };

    const presenter = await controller.create(input);
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter).toStrictEqual(new CategoryPresenter(output));
  });

  it('should updates a category', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    const output: UpdateCategoryOutput = {
      id,
      name: 'Movie',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
    };
    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    controller['updateUseCase'] =
      mockUpdateUseCase as unknown as UpdateCategoryUseCase;

    const input: Omit<UpdateCategoryInput, 'id'> = {
      name: 'Movie',
      description: 'some description',
      is_active: true,
    };

    const presenter = await controller.update(id, input);
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input,
    });

    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter).toStrictEqual(new CategoryPresenter(output));
  });

  it('should deletes a category', async () => {
    const expectedOutput = undefined;

    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };

    controller['deleteUseCase'] =
      mockDeleteUseCase as unknown as DeleteCategoryUseCase;

    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';

    expect(controller.remove(id)).toBeInstanceOf(Promise);
    const output = await controller.remove(id);

    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });

    expect(expectedOutput).toStrictEqual(output);
  });

  it('should gets a category', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    const output: GetCategoryOutput = {
      id,
      name: 'Movie',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
    };

    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };

    controller['getUseCase'] = mockGetUseCase as unknown as GetCategoryUseCase;
    const presenter = await controller.findOne(id);
    expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter).toStrictEqual(new CategoryPresenter(output));
  });

  it('should list categories', async () => {
    const output: ListCategoriesOutput = {
      items: [
        {
          id: '9366b7dc-2d71-4799-b91c-c64adb205104',
          name: 'Movie',
          description: 'some description',
          is_active: true,
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

    controller['listUseCase'] =
      mockListUseCase as unknown as ListCategoriesUseCase;

    const searchParams = {
      page: 1,
      per_page: 2,
      filter: 'test',
      sort: 'name',
      sort_dir: 'des' as SortDirection,
    };

    const presenter = await controller.search(searchParams);
    expect(presenter).toBeInstanceOf(CategoryCollectionPresenter);
    expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParams);
    expect(presenter).toEqual(new CategoryCollectionPresenter(output));
  });
});
