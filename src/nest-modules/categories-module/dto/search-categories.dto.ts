import { SortDirection } from '@core/shared/domain/repository/search-params';
import { ListCategoriesInput } from './../../../core/category/application/use-cases/list-category/list-category.use-case';

export class SearchCategoriesDto implements ListCategoriesInput {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;
  filter?: string;
}
