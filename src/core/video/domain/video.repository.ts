import { CastMemberId } from '@core/cast-member/domain/cast-member.aggregate';
import { CategoryId } from '@core/category/domain/category.aggregate';
import { GenreId } from '@core/genre/domain/genre.aggregate';
import {
  SearchParams,
  SearchParamsConstructorProps,
} from '@core/shared/domain/repository/search-params';
import { SearchResult } from '@core/shared/domain/repository/search-result';
import { Video, VideoId } from './video.aggregate';
import { ISearchableRepository } from '@core/shared/domain/repository/repository-interface';

export type VideoFilter = {
  title?: string;
  categories_id?: CategoryId[];
  genres_id?: GenreId[];
  cast_members_id?: CastMemberId[];
};

export class VideoSearchParams extends SearchParams<VideoFilter> {
  private constructor(props: SearchParamsConstructorProps<VideoFilter>) {
    super(props);
  }

  static create(
    props: Omit<SearchParamsConstructorProps<VideoFilter>, 'filter'> & {
      filter?: {
        title?: string;
        categories_id?: CategoryId[] | string[];
        genres_id?: GenreId[] | string[];
        cast_members_id?: CastMemberId[] | string[];
      };
    } = {},
  ) {
    const categories_id = props.filter?.categories_id?.map((cate) =>
      cate instanceof CategoryId ? cate : new CategoryId(cate),
    );
    const genres_id = props.filter?.genres_id?.map((genre) =>
      genre instanceof GenreId ? genre : new GenreId(genre),
    );
    const cast_members_id = props.filter?.cast_members_id?.map((cast) =>
      cast instanceof CastMemberId ? cast : new CastMemberId(cast),
    );
    return new VideoSearchParams({
      ...props,
      filter: {
        title: props.filter?.title,
        categories_id,
        genres_id,
        cast_members_id,
      },
    });
  }

  get filter(): VideoFilter | null {
    return this._filter;
  }

  protected set filter(value: VideoFilter | null) {
    const _value =
      !value || (value as unknown) === '' || typeof value !== 'object'
        ? null
        : value;

    const filter = {
      ...(_value?.title && { title: `${_value?.title}` }),
      ...(_value?.categories_id &&
        _value?.categories_id.length && {
          categories_id: _value?.categories_id,
        }),
      ...(_value?.genres_id &&
        _value?.genres_id.length && {
          genres_id: _value?.genres_id,
        }),
      ...(_value?.cast_members_id &&
        _value?.cast_members_id.length && {
          cast_members_id: _value?.cast_members_id,
        }),
    };

    this._filter = Object.keys(filter).length === 0 ? null : filter;
  }
}

export class VideoSearchResult extends SearchResult<Video> {}

export interface IVideoRepository
  extends ISearchableRepository<
    Video,
    VideoId,
    VideoFilter,
    VideoSearchParams,
    VideoSearchResult
  > {}
