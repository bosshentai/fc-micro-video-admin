import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository';
import { ICategoryRepository } from '@core/category/domain/category.repository';
import { IGenreRepository } from '@core/genre/domain/genre.repository';
import {
  IVideoRepository,
  VideoSearchParams,
  VideoSearchResult,
} from '@core/video/domain/video.repository';
import { ListVideoInput } from './list-genres.input';
import { IUseCase } from '@core/shared/application/use-case.interface';
import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@core/shared/application/pagination-output';
import { VideoOutput, VideoOutputMapper } from '../common/video-output';
import { CategoryId } from '@core/category/domain/category.aggregate';
import { GenreId } from '@core/genre/domain/genre.aggregate';
import { CastMemberId } from '@core/cast-member/domain/cast-member.aggregate';

export class ListVideoUseCase
  implements IUseCase<ListVideoInput, ListVideoOutput>
{
  constructor(
    private videoRepo: IVideoRepository,
    private categoryRepo: ICategoryRepository,

    private genreRepo: IGenreRepository,
    private castMemberRepo: ICastMemberRepository,
  ) {}
  async execute(input: ListVideoInput): Promise<ListVideoOutput> {
    const params = VideoSearchParams.create(input);

    const searchResult = await this.videoRepo.search(params);

    return this.toOutput(searchResult);
  }

  private async toOutput(searchResult: VideoSearchResult) {
    const { items: _items } = searchResult;

    const categoryIdsRelated = searchResult.items.reduce<CategoryId[]>(
      (acc, item) => {
        return acc.concat(Array.from(item.categories_id.values()));
      },
      [],
    );

    // TODO - remove duplicates
    const categoriesRelated =
      await this.categoryRepo.findByIds(categoryIdsRelated);

    const genresIdsRelated = searchResult.items.reduce<GenreId[]>(
      (acc, item) => {
        return acc.concat(Array.from(item.genres_id.values()));
      },
      [],
    );

    const genresRelated = await this.genreRepo.findByIds(genresIdsRelated);

    const castMemberIdsRelated = searchResult.items.reduce<CastMemberId[]>(
      (acc, item) => {
        return acc.concat(Array.from(item.cast_members_id.values()));
      },
      [],
    );

    const castMembersRelated =
      await this.castMemberRepo.findByIds(castMemberIdsRelated);

    const items = _items.map((item) => {
      const categoriesOfVideo = categoriesRelated.filter((category) =>
        item.categories_id.has(category.category_id.id),
      );
      const genresOfVideo = genresRelated.filter((genre) =>
        item.genres_id.has(genre.genre_id.id),
      );
      const castMembersOfVideo = castMembersRelated.filter((castMember) =>
        item.cast_members_id.has(castMember.cast_member_id.id),
      );
      return VideoOutputMapper.toOutput({
        video: item,
        allCategoriesOfVideoAndGenre: categoriesOfVideo,
        genres: genresOfVideo,
        cast_members: castMembersOfVideo,
      });
    });

    return PaginationOutputMapper.toOutput(items, searchResult);
  }
}

export type ListVideoOutput = PaginationOutput<VideoOutput>;
