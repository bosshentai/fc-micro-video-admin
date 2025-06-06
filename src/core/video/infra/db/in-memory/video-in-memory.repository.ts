import { SortDirection } from '@core/shared/domain/repository/search-params';
import { InMemorySearchableRepository } from '@core/shared/infra/db/in-memory/in-memory.repository';
import { Video, VideoId } from '@core/video/domain/video.aggregate';
import {
  IVideoRepository,
  VideoFilter,
} from '@core/video/domain/video.repository';

export class VideoInMemoryRepository
  extends InMemorySearchableRepository<Video, VideoId, VideoFilter>
  implements IVideoRepository
{
  sortableFields: string[] = ['title', 'created_at'];
  protected async applyFilter(
    items: Video[],
    filter: VideoFilter | null,
  ): Promise<Video[]> {
    if (!filter) {
      return items;
    }

    return items.filter((i) => {
      const containsTitle =
        filter.title &&
        i.title.toLowerCase().includes(filter.title.toLowerCase());

      const constainsCategoriesId =
        filter.categories_id &&
        filter.categories_id.some((c) => i.categories_id.has(c.id));

      const containsGenresId =
        filter.genres_id && filter.genres_id.some((g) => i.genres_id.has(g.id));

      const containsCastMembersId =
        filter.cast_members_id &&
        filter.cast_members_id.some((c) => i.cast_members_id.has(c.id));

      const filterMap = [
        [filter.title, containsTitle],
        [filter.categories_id, constainsCategoriesId],
        [filter.genres_id, containsGenresId],
        [filter.cast_members_id, containsCastMembersId],
      ].filter((i) => i[0]);

      return filterMap.every((f) => f[1]);
    });
  }

  protected applySort(
    items: Video[],
    sort: string | null,
    sort_dir: SortDirection | null,
  ): Video[] {
    return !sort
      ? super.applySort(items, 'created_at', 'desc')
      : super.applySort(items, sort, sort_dir);
  }

  getEntity(): new (...args: any[]) => Video {
    return Video;
  }
}
