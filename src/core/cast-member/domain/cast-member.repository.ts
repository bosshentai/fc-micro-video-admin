import {
  SearchParams as DefaultSearchParams,
  SearchParamsConstructorProps,
} from '@core/shared/domain/repository/search-params';
import { SearchResult } from '@core/shared/domain/repository/search-result';
import { CastMember } from './cast-member.entity';
import { ISearchableRepository } from '@core/shared/domain/repository/repository-interface';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import {
  CastMemberType,
  CastMemberTypes,
  InvalidCastMemberTypeError,
} from './value-object/cast-member-type.vo';
import { Either } from '@core/shared/domain/either';
import { SearchValidationError } from '@core/shared/domain/validator/validation.error';

export type CastMemberFilter = {
  name?: string | null;
  type?: CastMemberType | null;
};

export class CastMemberSearchParams extends DefaultSearchParams<CastMemberFilter> {
  private constructor(
    props: SearchParamsConstructorProps<CastMemberFilter> = {},
  ) {
    super(props);
  }

  static create(
    props: Omit<SearchParamsConstructorProps<CastMemberFilter>, 'filter'> & {
      filter?: {
        name?: string | null;
        type?: CastMemberTypes | null;
      };
    } = {},
  ) {
    const [type, errorCastMemberType] = Either.of(props.filter?.type)
      .map((type) => type || null)
      .chain<CastMemberType | null, InvalidCastMemberTypeError>((type) =>
        type ? CastMemberType.create(type) : Either.of(null),
      )
      .asArray();

    if (errorCastMemberType) {
      const error = new SearchValidationError([
        { type: [errorCastMemberType.message] },
      ]);
      throw error;
    }

    return new CastMemberSearchParams({
      ...props,
      filter: {
        name: props.filter?.name || null,
        type,
      },
    });
  }

  get filter(): CastMemberFilter | null {
    return this._filter;
  }

  protected set filter(value: CastMemberFilter | null) {
    const _value =
      !value || (value as unknown) === '' || typeof value !== 'object'
        ? null
        : value;

    const filter = {
      ...(_value && _value.name && { name: `${_value?.name}` }),
      ...(_value && _value.type && { type: _value?.type }),
    };

    this._filter = Object.keys(filter).length === 0 ? null : filter;
  }
}

export class CastMemberSearchResult extends SearchResult<CastMember> {}

export interface ICastMemberRepository
  extends ISearchableRepository<
    CastMember,
    Uuid,
    CastMemberFilter,
    CastMemberSearchParams,
    CastMemberSearchResult
  > {}
