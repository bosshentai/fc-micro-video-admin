import { SearchInput } from '@core/shared/application/search-input';
import { SortDirection } from '@core/shared/domain/repository/search-params';
import { IsArray, IsUUID, ValidateNested, validateSync } from 'class-validator';

export class ListGenreFilter {
  name?: string;

  @IsUUID('4', { each: true })
  @IsArray()
  categories_id?: string[];
}

export class ListGenresInput implements SearchInput<ListGenreFilter> {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;

  @ValidateNested()
  filter?: ListGenreFilter;
}

export class ValidateListGenresInput {
  static validate(input: ListGenresInput) {
    return validateSync(input);
  }
}
