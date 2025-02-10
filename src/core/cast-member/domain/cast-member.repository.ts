import { SearchParams } from '@core/shared/domain/repository/search-params';
import { SearchResult } from '@core/shared/domain/repository/search-result';
import { CastMember } from './cast-member.entity';
import { ISearchableRepository } from '@core/shared/domain/repository/repository-interface';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { CastMemberType } from './value-object/cast-member-type.vo';

export type CastMemberFilter = {
  name?: string | null;
  type?: CastMemberType | null;
};

export class CastMemberSearchParams extends SearchParams<CastMemberFilter> {}

export class CastMemberSearchResult extends SearchResult<CastMember> {}

export interface ICastMemberRepository
  extends ISearchableRepository<
    CastMember,
    Uuid,
    CastMemberFilter,
    CastMemberSearchParams,
    CastMemberSearchResult
  > {}
