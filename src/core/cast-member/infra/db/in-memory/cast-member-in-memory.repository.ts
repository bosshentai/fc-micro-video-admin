import { CastMember } from '@core/cast-member/domain/cast-member.aggregate';
import {
  CastMemberFilter,
  ICastMemberRepository,
} from '@core/cast-member/domain/cast-member.repository';
import { CastMemberType } from '@core/cast-member/domain/value-object/cast-member-type.vo';
import { SortDirection } from '@core/shared/domain/repository/search-params';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { InMemorySearchableRepository } from '@core/shared/infra/db/in-memory/in-memory.repository';

export class CastMemberInMemoryRepository
  extends InMemorySearchableRepository<CastMember, Uuid, CastMemberFilter>
  implements ICastMemberRepository
{
  sortableFields: string[] = ['name', 'created_at'];
  protected async applyFilter(
    items: CastMember[],
    filter: CastMemberFilter | null,
  ): Promise<CastMember[]> {
    if (!filter) {
      return items;
    }

    return items.filter((item) => {
      const constainsName =
        filter.name &&
        item.name.toLowerCase().includes(filter.name.toLowerCase());
      const hasType = filter.type && item.member_type.equals(filter.type);

      return filter.name && filter.type
        ? constainsName && hasType
        : filter.name
          ? constainsName
          : hasType;
    });
  }
  getEntity(): new (...args: unknown[]) => CastMember {
    return CastMember;
  }

  protected applySort(
    items: CastMember[],
    stort: keyof CastMember | null,
    sort_dir: SortDirection | null,
  ): CastMember[] {
    return stort
      ? super.applySort(items, stort, sort_dir)
      : super.applySort(items, 'created_at', 'desc');
  }
}
