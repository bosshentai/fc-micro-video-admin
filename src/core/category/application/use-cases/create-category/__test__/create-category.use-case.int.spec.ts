import { CastMemberId } from '@core/cast-member/domain/cast-member.aggregate';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { CategorySequelizeRepository } from '../../../../infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../../infra/db/sequelize/category.model';
import { CreateCategoryUseCase } from '../create-category.use-case';

describe('CreateCatoryUseCase Integration Tests', () => {
  let useCase: CreateCategoryUseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new CreateCategoryUseCase(repository);
  });

  it('should create a category', async () => {
    let output = await useCase.execute({ name: 'test' });
    let entity = await repository.findById(new CastMemberId(output.id));

    expect(output).toStrictEqual({
      id: entity!.category_id.id,
      name: 'test',
      description: null,
      is_active: true,
      created_at: entity!.created_at,
    });

    output = await useCase.execute({
      name: 'test',
      description: 'test description',
    });

    entity = await repository.findById(new CastMemberId(output.id));
    expect(output).toStrictEqual({
      id: entity!.category_id.id,
      name: 'test',
      description: 'test description',
      is_active: true,
      created_at: entity!.created_at,
    });
  });
});
