import { UpdateCategoryInput } from '@core/category/application/use-cases/update-category/update-category.input';
import { OmitType } from '@nestjs/mapped-types';

export class UpdateCategoryWithoutId extends OmitType(UpdateCategoryInput, [
  'id',
] as const) {}

export class UpdateCategoryDto extends UpdateCategoryWithoutId {}
