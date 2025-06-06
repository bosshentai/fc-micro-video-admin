import { Category, CategoryId } from '@core/category/domain/category.aggregate';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { CategorySequelizeRepository } from '../../../../infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../../infra/db/sequelize/category.model';
import { UpdateCategoryUseCase } from '../update-category.use-case';

describe('UpdateCategoryUseCase Integration Tests', () => {
  let useCase: UpdateCategoryUseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new UpdateCategoryUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const uuid = new CategoryId();

    await expect(() =>
      useCase.execute({ id: uuid.id, name: 'fake' }),
    ).rejects.toThrow(new NotFoundError(uuid.id, Category));
  });

  it('should update a category', async () => {
    const entity = Category.fake().aCategory().build();
    repository.insert(entity);

    let output = await useCase.execute({
      id: entity.category_id.id,
      name: 'test',
    });

    expect(output).toStrictEqual({
      id: entity.category_id.id,
      name: 'test',
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at,
    });

    type Arrange = {
      input: {
        id: string;
        name: string;
        description?: null | string;
        is_active?: boolean;
      };
      expected: {
        id: string;
        name: string;
        description: null | string;
        is_active: boolean;
        created_at: Date;
      };
    };

    const arrange: Arrange[] = [
      {
        input: {
          id: entity.category_id.id,
          name: 'test',
          description: 'some description',
        },
        expected: {
          id: entity.category_id.id,
          name: 'test',
          description: 'some description',
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.category_id.id,
          name: 'test',
        },
        expected: {
          id: entity.category_id.id,
          name: 'test',
          description: 'some description',
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.category_id.id,
          name: 'test',
          is_active: false,
        },
        expected: {
          id: entity.category_id.id,
          name: 'test',
          description: 'some description',
          is_active: false,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.category_id.id,
          name: 'test',
        },
        expected: {
          id: entity.category_id.id,
          name: 'test',
          description: 'some description',
          is_active: false,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.category_id.id,
          name: 'test',
          is_active: true,
        },
        expected: {
          id: entity.category_id.id,
          name: 'test',
          description: 'some description',
          is_active: true,
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.category_id.id,
          name: 'test',
          description: null,
          is_active: false,
        },
        expected: {
          id: entity.category_id.id,
          name: 'test',
          description: null,
          is_active: false,
          created_at: entity.created_at,
        },
      },
    ];

    for (const item of arrange) {
      output = await useCase.execute({
        id: item.input.id,
        ...(item.input.name && { name: item.input.name }),
        ...('description' in item.input && {
          description: item.input.description,
        }),
        ...('is_active' in item.input && { is_active: item.input.is_active }),
      });

      const entityUpdated = await repository.findById(
        new CategoryId(item.input.id),
      );

      expect(output).toStrictEqual({
        id: entity.category_id.id,
        name: item.expected.name,
        description: item.expected.description,
        is_active: item.expected.is_active,
        created_at: entityUpdated!.created_at,
      });

      expect(entityUpdated!.toJSON()).toStrictEqual({
        category_id: entity.category_id.id,
        name: item.expected.name,
        description: item.expected.description,
        is_active: item.expected.is_active,
        created_at: entityUpdated!.created_at,
      });
    }
  });
});
