import { SearchInput } from '@core/shared/application/search-input';
import { SortDirection } from '@core/shared/domain/repository/search-params';
import { IsArray, IsUUID, ValidateNested, validateSync } from 'class-validator';

export class ListVideoFilter {
  title?: string;

  @IsUUID('4', { each: true })
  @IsArray()
  categories_id?: string[];

  @IsUUID('4', { each: true })
  @IsArray()
  genres_id?: string[];

  @IsUUID('4', { each: true })
  @IsArray()
  cast_members_id?: string[];
}

export class ListVideoInput implements SearchInput<ListVideoFilter> {
  page?: number;
  per_page?: number;

  sort?: string;

  sort_dir?: SortDirection;

  @ValidateNested()
  filter?: ListVideoFilter;
}

export class ValidateListVideoInput {
  static validate(input: ListVideoInput) {
    return validateSync(input);
  }
}
