import { Video, VideoId } from '@core/video/domain/video.aggregate';
import { GetVideoUseCase } from '../get-video.use-case';
import { VideoSequelizeRepository } from '@core/video/infra/db/sequelize/video-sequelize.repository';
import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category-sequelize.repository';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { GenreSequelizeRepository } from '@core/genre/infra/db/sequelize/genre-sequelize.repository';
import { CastMemberSequelizeRepository } from '@core/cast-member/infra/db/sequelize/cast-member-sequelize';
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { GenreModel } from '@core/genre/infra/db/sequelize/genre-model';
import { VideoModel } from '@core/video/infra/db/sequelize/video.model';
import { setupSequelizeForVideo } from '@core/video/infra/db/sequelize/testing/helpers';
import { UnitOfWorkSequelize } from '@core/shared/infra/db/sequelize/unit-of-work-sequelize';
import { CastMemberModel } from '@core/cast-member/infra/db/sequelize/cast-member.model';
import { Category, CategoryId } from '@core/category/domain/category.aggregate';
import { Genre, GenreId } from '@core/genre/domain/genre.aggregate';
import {
  CastMember,
  CastMemberId,
} from '@core/cast-member/domain/cast-member.aggregate';
describe('GetVideoUseCase Integration Tests', () => {
  let useCase: GetVideoUseCase;
  let videoRepo: VideoSequelizeRepository;
  let categoryRepo: CategorySequelizeRepository;
  let genreRepo: GenreSequelizeRepository;
  let castMemberRepo: CastMemberSequelizeRepository;
  const sequeliezeHelper = setupSequelizeForVideo();

  beforeEach(() => {
    let uow = new UnitOfWorkSequelize(sequeliezeHelper.sequelize);

    categoryRepo = new CategorySequelizeRepository(CategoryModel);
    genreRepo = new GenreSequelizeRepository(GenreModel, uow);
    castMemberRepo = new CastMemberSequelizeRepository(CastMemberModel);
    videoRepo = new VideoSequelizeRepository(VideoModel, uow);
    useCase = new GetVideoUseCase(
      videoRepo,
      categoryRepo,
      genreRepo,
      castMemberRepo,
    );
  });

  it('should throw error when entity not found', async () => {
    const videoId = new VideoId();
    await expect(() => useCase.execute({ id: videoId.id })).rejects.toThrow(
      new NotFoundError(videoId.id, Video),
    );
  });

  it('should return a video', async () => {
    const categories = Category.fake().theCategories(2).build();
    await categoryRepo.bulkInsert(categories);

    const genres = Genre.fake().theGenres(2).build();
    genres[0].syncCategoriesId([categories[0].category_id]);
    genres[1].syncCategoriesId([categories[1].category_id]);
    await genreRepo.bulkInsert(genres);

    const castMembers = CastMember.fake().theCastMembers(2).build();
    await castMemberRepo.bulkInsert(castMembers);

    const video = Video.fake()
      .aVideoWithoutMedias()
      .addCategoryId(new CategoryId(categories[0].category_id.id))
      .addGenreId(new GenreId(genres[0].genre_id.id))
      .addCastMemberId(new CastMemberId(castMembers[0].cast_member_id.id))
      .addCastMemberId(new CastMemberId(castMembers[1].cast_member_id.id))
      .build();
    await videoRepo.insert(video);

    const output = await useCase.execute({ id: video.video_id.id });
    expect(output).toStrictEqual({
      id: video.video_id.id,
      title: video.title,
      description: video.description,
      year_launched: video.year_launched,
      duration: video.duration,
      rating: video.rating.value,
      is_opened: video.is_opened,
      is_published: video.is_published,
      categories_id: [categories[0].category_id.id],
      categories: [
        {
          id: categories[0].category_id.id,
          name: categories[0].name,
          created_at: categories[0].created_at,
        },
      ],
      genres_id: [genres[0].genre_id.id],
      genres: [
        {
          id: genres[0].genre_id.id,
          name: genres[0].name,
          is_active: genres[0].is_active,
          categories_id: [categories[0].category_id.id],
          categories: [
            {
              id: categories[0].category_id.id,
              name: categories[0].name,
              created_at: categories[0].created_at,
            },
          ],
          created_at: genres[0].created_at,
        },
      ],
      cast_members_id: [
        castMembers[0].cast_member_id.id,
        castMembers[1].cast_member_id.id,
      ],
      cast_members: [
        {
          id: castMembers[0].cast_member_id.id,
          name: castMembers[0].name,
          type: castMembers[0].member_type.type,
          created_at: castMembers[0].created_at,
        },
        {
          id: castMembers[1].cast_member_id.id,
          name: castMembers[1].name,
          type: castMembers[1].member_type.type,
          created_at: castMembers[1].created_at,
        },
      ],
      created_at: video.created_at,
    });
  });
});
