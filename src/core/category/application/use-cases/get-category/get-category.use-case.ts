import { Category, CategoryId } from '@core/category/domain/category.aggregate';
import { IUseCase } from '../../../../shared/application/use-case.interface';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { ICategoryRepository } from '../../../domain/category.repository';
import {
  CategoryOutput,
  CategoryOutputMapper,
} from '../common/category-output';

export class GetCategoryUseCase
  implements IUseCase<GetCategoryInput, GetCategoryOutput>
{
  constructor(private categoryRepo: ICategoryRepository) {}
  async execute(input: GetCategoryInput): Promise<GetCategoryOutput> {
    const uuid = new CategoryId(input.id);

    const category = await this.categoryRepo.findById(uuid);

    if (!category) {
      throw new NotFoundError(input.id, Category);
    }

    return CategoryOutputMapper.toOutput(category);
    // return {
    //   id: category.category_id.id,
    //   name: category.name,
    //   description: category.description,
    //   is_active: category.is_active,
    //   created_at: category.created_at,
    // };
  }
}

export type GetCategoryInput = {
  id: string;
};

export type GetCategoryOutput = CategoryOutput;

// export type GetCategoryOutput = {
//   id: string;
//   name: string;
//   description: string | null;
//   is_active: boolean;
//   created_at: Date;
// };
