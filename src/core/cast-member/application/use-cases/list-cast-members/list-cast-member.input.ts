import { CastMemberTypes } from '@core/cast-member/domain/value-object/cast-member-type.vo';
import { SearchInput } from '@core/shared/application/search-input';
import { SortDirection } from '@core/shared/domain/repository/search-params';
import { ValidateNested, validateSync } from 'class-validator';

export class ListCastMembersFilter {
  name?: string | null;
  type?: CastMemberTypes | null;
}

export class ListCastMembersInput
  implements SearchInput<ListCastMembersFilter>
{
  page?: number;

  per_page?: number;

  sort?: string;

  sort_dir?: SortDirection;

  @ValidateNested()
  filter?: ListCastMembersFilter;
}

export class ValidatteListCastMembesInput {
  static validate(input: ListCastMembersInput) {
    return validateSync(input);
  }
}
