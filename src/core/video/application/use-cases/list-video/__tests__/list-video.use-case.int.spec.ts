import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category-sequelize.repository';
import { ListVideoUseCase } from '../list-video.use-case';
import { GenreSequelizeRepository } from '@core/genre/infra/db/sequelize/genre-sequelize.repository';
import { CastMemberSequelizeRepository } from '@core/cast-member/infra/db/sequelize/cast-member-sequelize';
import { setupSequelizeForVideo } from '@core/video/infra/db/sequelize/testing/helpers';
import { UnitOfWorkSequelize } from '@core/shared/infra/db/sequelize/unit-of-work-sequelize';
import { GenreModel } from '@core/genre/infra/db/sequelize/genre-model';
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { VideoSequelizeRepository } from '@core/video/infra/db/sequelize/video-sequelize.repository';
import { CastMemberModel } from '@core/cast-member/infra/db/sequelize/cast-member.model';
import { VideoModel } from '@core/video/infra/db/sequelize/video.model';
import { Category, CategoryId } from '@core/category/domain/category.aggregate';
import { Genre, GenreId } from '@core/genre/domain/genre.aggregate';
import {
  CastMember,
  CastMemberId,
} from '@core/cast-member/domain/cast-member.aggregate';
import { Video } from '@core/video/domain/video.aggregate';
import { VideoOutputMapper } from '../../common/video-output';

describe('ListVideoUseCase Integration Tests', () => {
  let useCase: ListVideoUseCase;

  let genreRepo: GenreSequelizeRepository;
  let castMemberRepo: CastMemberSequelizeRepository;

  let categoryRepo: CategorySequelizeRepository;

  let videoRepo: VideoSequelizeRepository;

  const sequeliezeHelper = setupSequelizeForVideo();

  beforeEach(() => {
    const uow = new UnitOfWorkSequelize(sequeliezeHelper.sequelize);

    categoryRepo = new CategorySequelizeRepository(CategoryModel);
    genreRepo = new GenreSequelizeRepository(GenreModel, uow);
    castMemberRepo = new CastMemberSequelizeRepository(CastMemberModel);
    videoRepo = new VideoSequelizeRepository(VideoModel, uow);
    useCase = new ListVideoUseCase(
      videoRepo,
      categoryRepo,
      genreRepo,
      castMemberRepo,
    );
  });

  it('should return output sorted by created_at when input param is empty', async () => {
    const categories = Category.fake().theCategories(3).build();
    await categoryRepo.bulkInsert(categories);
    const genres = Genre.fake()
      .aGenre()
      .addCategoryId(categories[0].category_id)
      .build();
    await genreRepo.insert(genres);
    const castMembers = CastMember.fake().theCastMembers(2).build();
    await castMemberRepo.bulkInsert(castMembers);

    const video = Video.fake()
      .aVideoWithoutMedias()
      .withTitle('video 1')
      .withDescription('description 1')
      .withDuration(100)
      .addCategoryId(categories[0].category_id)
      .addGenreId(genres.genre_id)
      .addCastMemberId(castMembers[0].cast_member_id)
      .build();

    await videoRepo.insert(video);

    const output = await useCase.execute({});

    expect(output).toStrictEqual({
      items: [
        VideoOutputMapper.toOutput({
          video,
          allCategoriesOfVideoAndGenre: [categories[0]],
          genres: [genres],
          cast_members: [castMembers[0]],
        }),
      ],
      total: 1,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });
  it('should search applying paginate and filter by title', async () => {
    const categories = Category.fake().theCategories(3).build();
    await categoryRepo.bulkInsert(categories);
    const genres = Genre.fake()
      .theGenres(3)
      .addCategoryId(categories[0].category_id)

      .build();
    await genreRepo.bulkInsert(genres);

    const castMembers = CastMember.fake().theCastMembers(2).build();
    await castMemberRepo.bulkInsert(castMembers);

    const videos = [
      Video.fake()
        .aVideoWithoutMedias()
        .withTitle('test')
        .addCategoryId(categories[0].category_id)
        .addGenreId(genres[0].genre_id)
        .addCastMemberId(castMembers[0].cast_member_id)
        .withCreatedAt(new Date(new Date().getTime() + 4000))
        .build(),
      Video.fake()
        .aVideoWithoutMedias()
        .withTitle('a')
        .addCategoryId(categories[0].category_id)
        .addGenreId(genres[0].genre_id)
        .addCastMemberId(castMembers[0].cast_member_id)
        .withCreatedAt(new Date(new Date().getTime() + 3000))
        .build(),
      Video.fake()
        .aVideoWithoutMedias()
        .withTitle('TEST')
        .addCategoryId(categories[0].category_id)
        .addGenreId(genres[1].genre_id)
        .addCastMemberId(castMembers[1].cast_member_id)
        .withCreatedAt(new Date(new Date().getTime() + 2000))
        .build(),
      Video.fake()
        .aVideoWithoutMedias()
        .withTitle('teSt')
        .addCategoryId(categories[0].category_id)
        .addGenreId(genres[2].genre_id)
        .addCastMemberId(castMembers[1].cast_member_id)
        .withCreatedAt(new Date(new Date().getTime() + 1000))
        .build(),
    ];

    await videoRepo.bulkInsert(videos);

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      filter: {
        title: 'TEST',
      },
    });

    expect(output).toStrictEqual({
      items: [
        VideoOutputMapper.toOutput({
          video: videos[0],
          allCategoriesOfVideoAndGenre: [categories[0]],
          genres: [genres[0]],
          cast_members: [castMembers[0]],
        }),
        VideoOutputMapper.toOutput({
          video: videos[2],
          allCategoriesOfVideoAndGenre: [categories[0]],
          genres: [genres[1]],
          cast_members: [castMembers[1]],
        }),
      ],
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      filter: {
        title: 'TEST',
      },
    });

    expect(output).toStrictEqual({
      items: [
        VideoOutputMapper.toOutput({
          video: videos[3],
          allCategoriesOfVideoAndGenre: [categories[0]],
          genres: [genres[2]],
          cast_members: [castMembers[1]],
        }),
      ],
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });
  });
  it('should search applying paginate and filter by category_id', async () => {
    const created_at = new Date();
    const categories = Category.fake()
      .theCategories(3)
      // .withCreatedAt((i) => new Date(created_at.getTime() + 1000 * i))
      .build();
    await categoryRepo.bulkInsert(categories);

    const genres = Genre.fake()
      .theGenres(3)
      .addCategoryId(categories[0].category_id)
      // .withCreatedAt((i) => new Date(created_at.getTime() + 1000 * i))
      .build();

    // genres[1].syncCategoriesId([categories[1].category_id]);
    // genres[2].syncCategoriesId([
    //   categories[1].category_id,
    //   categories[2].category_id,
    // ]);

    await genreRepo.bulkInsert(genres);

    const castMembers = CastMember.fake().theCastMembers(2).build();
    await castMemberRepo.bulkInsert(castMembers);

    const vidoes = [
      Video.fake()
        .aVideoWithAllMedias()
        .addCategoryId(categories[0].category_id)
        .addGenreId(genres[0].genre_id)
        .addCastMemberId(castMembers[0].cast_member_id)
        .withCreatedAt(new Date(new Date().getTime() + 4000))
        .build(),
      Video.fake()
        .aVideoWithAllMedias()
        .addCategoryId(categories[0].category_id)
        .addCategoryId(categories[1].category_id)
        .addGenreId(genres[1].genre_id)
        .addCastMemberId(castMembers[0].cast_member_id)
        .withCreatedAt(new Date(new Date().getTime() + 3000))
        .build(),
      Video.fake()
        .aVideoWithAllMedias()
        .addCategoryId(categories[0].category_id)
        .addCategoryId(categories[1].category_id)
        .addCategoryId(categories[2].category_id)
        .addGenreId(genres[2].genre_id)
        .addCastMemberId(castMembers[0].cast_member_id)
        .withCreatedAt(new Date(new Date().getTime() + 1000))
        .build(),
    ];
    await videoRepo.bulkInsert(vidoes);

    const arrange = [
      {
        input: {
          page: 1,
          per_page: 2,
          filter: {
            categories_id: [categories[0].category_id.id],
          },
        },
        output: {
          items: [
            formatOutput(
              vidoes[0],
              [categories[0]],
              [genres[0]],
              [castMembers[0]],
            ),
            formatOutput(
              vidoes[1],
              [categories[0], categories[1]],
              [genres[1]],
              [castMembers[0]],
            ),
          ],
          total: 3,
          current_page: 1,
          per_page: 2,
          last_page: 2,
        },
      },
      {
        input: {
          page: 2,
          per_page: 2,
          filter: {
            categories_id: [categories[0].category_id.id],
          },
        },
        output: {
          items: [
            formatOutput(
              vidoes[2],
              [categories[0], categories[1], categories[2]],
              [genres[2]],
              [castMembers[0]],
            ),
          ],
          total: 3,
          current_page: 2,
          per_page: 2,
          last_page: 2,
        },
      },
      {
        input: {
          page: 1,
          per_page: 2,
          filter: {
            categories_id: [
              categories[0].category_id.id,
              categories[1].category_id.id,
            ],
          },
        },
        output: {
          items: [
            formatOutput(
              vidoes[0],
              [categories[0]],
              [genres[0]],
              [castMembers[0]],
            ),
            formatOutput(
              vidoes[1],
              [categories[0], categories[1]],
              [genres[1]],
              [castMembers[0]],
            ),
          ],
          total: 3,
          current_page: 1,
          per_page: 2,
          last_page: 2,
        },
      },
      {
        input: {
          page: 2,
          per_page: 2,
          filter: {
            categories_id: [
              categories[0].category_id.id,
              categories[1].category_id.id,
            ],
          },
        },
        output: {
          items: [
            formatOutput(
              vidoes[2],
              [categories[0], categories[1], categories[2]],
              [genres[2]],
              [castMembers[0]],
            ),
          ],
          total: 3,
          current_page: 2,
          per_page: 2,
          last_page: 2,
        },
      },
      {
        input: {
          page: 1,
          per_page: 2,
          filter: {
            categories_id: [
              categories[1].category_id.id,
              categories[2].category_id.id,
            ],
          },
        },
        output: {
          items: [
            formatOutput(
              vidoes[1],
              [categories[0], categories[1]],
              [genres[1]],
              [castMembers[0]],
            ),
            formatOutput(
              vidoes[2],
              [categories[0], categories[1], categories[2]],
              [genres[2]],
              [castMembers[0]],
            ),
          ],
          total: 2,
          current_page: 1,
          per_page: 2,
          last_page: 1,
        },
      },
    ];

    for (const item of arrange) {
      const output = await useCase.execute(item.input);
      expect(output).toStrictEqual(item.output);
    }
  });
});

function formatOutput(
  video: Video,
  categories: Category[],
  genres: Genre[],
  castMembers: CastMember[],
) {
  const output = VideoOutputMapper.toOutput({
    video,
    allCategoriesOfVideoAndGenre: categories,
    genres: genres,
    cast_members: castMembers,
  });
  return {
    ...output,
    categories: expect.arrayContaining(
      output.categories.map((c) => expect.objectContaining(c)),
    ),
    categories_id: expect.arrayContaining(output.categories_id),
  };
}
