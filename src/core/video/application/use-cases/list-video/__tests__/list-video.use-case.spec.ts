import { VideoInMemoryRepository } from '@core/video/infra/db/in-memory/video-in-memory.repository';
import { ListVideoUseCase } from '../list-video.use-case';
import { CategoryInMemoryRepository } from '@core/category/infra/db/in-memory/category-in-memory.repository';
import { GenreInMemoryRepository } from '@core/genre/infra/db/in-memory/genre-in-memory.repository';
import { CastMemberInMemoryRepository } from '@core/cast-member/infra/db/in-memory/cast-member-in-memory.repository';
import { VideoSearchResult } from '@core/video/domain/video.repository';
import { Category } from '@core/category/domain/category.aggregate';
import { Genre } from '@core/genre/domain/genre.aggregate';
import { CastMember } from '@core/cast-member/domain/cast-member.aggregate';
import { Video } from '@core/video/domain/video.aggregate';
import { VideoOutputMapper } from '../../common/video-output';
import { SortDirection } from '@core/shared/domain/repository/search-params';

describe('ListVideoUseCase Unit Tests', () => {
  let useCase: ListVideoUseCase;
  let videoRepo: VideoInMemoryRepository;
  let categoryRepo: CategoryInMemoryRepository;
  let genreRepo: GenreInMemoryRepository;
  let castMemberRepo: CastMemberInMemoryRepository;

  beforeEach(() => {
    videoRepo = new VideoInMemoryRepository();
    categoryRepo = new CategoryInMemoryRepository();
    genreRepo = new GenreInMemoryRepository();
    castMemberRepo = new CastMemberInMemoryRepository();
    useCase = new ListVideoUseCase(
      videoRepo,
      categoryRepo,
      genreRepo,
      castMemberRepo,
    );
  });

  test('toOutput method', async () => {
    let result = new VideoSearchResult({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
    });

    let output = await useCase['toOutput'](result);
    expect(output).toStrictEqual({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });

    const categories = Category.fake().theCategories(3).build();
    categoryRepo.bulkInsert(categories);

    const genres = Genre.fake()
      .aGenre()
      .addCategoryId(categories[0].category_id)
      .addCategoryId(categories[1].category_id)
      .build();

    genreRepo.insert(genres);

    const castMembers = CastMember.fake().theCastMembers(2).build();

    castMemberRepo.bulkInsert(castMembers);

    const video = Video.fake()
      .aVideoWithoutMedias()

      .addCategoryId(categories[0].category_id)
      .addCategoryId(categories[1].category_id)
      .addGenreId(genres.genre_id)
      .addCastMemberId(castMembers[0].cast_member_id)
      .addCastMemberId(castMembers[1].cast_member_id)
      .build();

    result = new VideoSearchResult({
      items: [video],
      total: 1,
      current_page: 1,
      per_page: 2,
    });

    output = await useCase['toOutput'](result);
    expect(output).toStrictEqual({
      items: [
        {
          id: video.video_id.id,
          title: video.title,
          description: video.description,
          duration: video.duration,
          year_launched: video.year_launched,
          rating: video.rating.value,
          is_opened: video.is_opened,
          is_published: video.is_published,
          categories_id: [
            categories[0].category_id.id,
            categories[1].category_id.id,
          ],
          categories: [
            {
              id: categories[0].category_id.id,
              name: categories[0].name,
              created_at: categories[0].created_at,
            },
            {
              id: categories[1].category_id.id,
              name: categories[1].name,
              created_at: categories[1].created_at,
            },
          ],
          genres_id: [genres.genre_id.id],
          genres: [
            {
              id: genres.genre_id.id,
              name: genres.name,
              is_active: genres.is_active,
              categories_id: [
                categories[0].category_id.id,
                categories[1].category_id.id,
              ],
              categories: [
                {
                  id: categories[0].category_id.id,
                  name: categories[0].name,
                  created_at: categories[0].created_at,
                },
                {
                  id: categories[1].category_id.id,
                  name: categories[1].name,
                  created_at: categories[1].created_at,
                },
              ],
              created_at: genres.created_at,
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
        },
      ],
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });
  });

  it('should search sorted by created_at when input param is empty', async () => {
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

    const created_at = new Date();

    const videos = [
      Video.fake()
        .aVideoWithoutMedias()
        .withTitle('test')
        .addCategoryId(categories[0].category_id)
        .addGenreId(genres[0].genre_id)
        .addCastMemberId(castMembers[0].cast_member_id)
        .withCreatedAt(created_at)
        .build(),
      Video.fake()
        .aVideoWithoutMedias()
        .withTitle('a')
        .addCategoryId(categories[0].category_id)
        .addGenreId(genres[0].genre_id)
        .addCastMemberId(castMembers[0].cast_member_id)
        .withCreatedAt(created_at)
        .build(),
      Video.fake()
        .aVideoWithoutMedias()
        .withTitle('TEST')
        .addCategoryId(categories[0].category_id)
        .addGenreId(genres[1].genre_id)
        .addCastMemberId(castMembers[1].cast_member_id)
        .withCreatedAt(created_at)
        .build(),
      Video.fake()
        .aVideoWithoutMedias()
        .withTitle('teSt')
        .addCategoryId(categories[0].category_id)
        .addGenreId(genres[2].genre_id)
        .addCastMemberId(castMembers[1].cast_member_id)
        .withCreatedAt(created_at)
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
    const categories = Category.fake().theCategories(3).build();
    await categoryRepo.bulkInsert(categories);

    const genres = Genre.fake()
      .theGenres(3)
      .addCategoryId(categories[0].category_id)
      .build();
    await genreRepo.bulkInsert(genres);

    const castMembers = CastMember.fake().theCastMembers(2).build();
    await castMemberRepo.bulkInsert(castMembers);

    const created_at = new Date();

    const vidoes = [
      Video.fake()
        .aVideoWithoutMedias()
        .addCategoryId(categories[0].category_id)
        .addGenreId(genres[0].genre_id)
        .addCastMemberId(castMembers[0].cast_member_id)
        .withCreatedAt(created_at)
        .build(),
      Video.fake()
        .aVideoWithoutMedias()
        .addCategoryId(categories[0].category_id)
        .addCategoryId(categories[1].category_id)
        .addGenreId(genres[0].genre_id)
        .addCastMemberId(castMembers[0].cast_member_id)
        .withCreatedAt(created_at)
        .build(),
      Video.fake()
        .aVideoWithoutMedias()
        .addCategoryId(categories[0].category_id)
        .addCategoryId(categories[1].category_id)
        .addCategoryId(categories[2].category_id)
        .addGenreId(genres[1].genre_id)
        .addCastMemberId(castMembers[1].cast_member_id)
        .withCreatedAt(created_at)
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
            VideoOutputMapper.toOutput({
              video: vidoes[0],
              allCategoriesOfVideoAndGenre: [categories[0]],
              genres: [genres[0]],
              cast_members: [castMembers[0]],
            }),
            VideoOutputMapper.toOutput({
              video: vidoes[1],
              allCategoriesOfVideoAndGenre: [categories[0], categories[1]],
              genres: [genres[0]],
              cast_members: [castMembers[0]],
            }),
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
            VideoOutputMapper.toOutput({
              video: vidoes[2],
              allCategoriesOfVideoAndGenre: [
                categories[0],
                categories[1],
                categories[2],
              ],
              genres: [genres[1]],
              cast_members: [castMembers[1]],
            }),
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
            VideoOutputMapper.toOutput({
              video: vidoes[0],
              allCategoriesOfVideoAndGenre: [categories[0]],
              genres: [genres[0]],
              cast_members: [castMembers[0]],
            }),
            VideoOutputMapper.toOutput({
              video: vidoes[1],
              allCategoriesOfVideoAndGenre: [categories[0], categories[1]],
              genres: [genres[0]],
              cast_members: [castMembers[0]],
            }),
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
            VideoOutputMapper.toOutput({
              video: vidoes[2],
              allCategoriesOfVideoAndGenre: [
                categories[0],
                categories[1],
                categories[2],
              ],
              genres: [genres[1]],
              cast_members: [castMembers[1]],
            }),
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
            VideoOutputMapper.toOutput({
              video: vidoes[1],
              allCategoriesOfVideoAndGenre: [categories[0], categories[1]],
              genres: [genres[0]],
              cast_members: [castMembers[0]],
            }),
            VideoOutputMapper.toOutput({
              video: vidoes[2],
              allCategoriesOfVideoAndGenre: [
                categories[0],
                categories[1],
                categories[2],
              ],
              genres: [genres[1]],
              cast_members: [castMembers[1]],
            }),
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

  it('should search applying paginate and filter by genre_id', async () => {
    const categories = Category.fake().theCategories(3).build();
    await categoryRepo.bulkInsert(categories);

    const genres = Genre.fake()
      .theGenres(3)
      .addCategoryId(categories[0].category_id)
      .build();
    await genreRepo.bulkInsert(genres);

    const castMembers = CastMember.fake().theCastMembers(2).build();
    await castMemberRepo.bulkInsert(castMembers);

    const created_at = new Date();

    const vidoes = [
      Video.fake()
        .aVideoWithoutMedias()
        .addCategoryId(categories[0].category_id)
        .addGenreId(genres[0].genre_id)
        .addCastMemberId(castMembers[0].cast_member_id)
        .withCreatedAt(created_at)
        .build(),
      Video.fake()
        .aVideoWithoutMedias()
        .addCategoryId(categories[0].category_id)
        .addGenreId(genres[0].genre_id)
        .addGenreId(genres[1].genre_id)
        .addCastMemberId(castMembers[0].cast_member_id)
        .withCreatedAt(created_at)
        .build(),
      Video.fake()
        .aVideoWithoutMedias()
        .addCategoryId(categories[0].category_id)
        .addGenreId(genres[0].genre_id)
        .addGenreId(genres[1].genre_id)
        .addGenreId(genres[2].genre_id)
        .addCastMemberId(castMembers[0].cast_member_id)
        .withCreatedAt(created_at)
        .build(),
    ];

    await videoRepo.bulkInsert(vidoes);

    const arrange = [
      {
        input: {
          page: 1,
          per_page: 2,
          filter: {
            genres_id: [genres[0].genre_id.id],
          },
        },
        output: {
          items: [
            VideoOutputMapper.toOutput({
              video: vidoes[0],
              allCategoriesOfVideoAndGenre: [categories[0]],
              genres: [genres[0]],
              cast_members: [castMembers[0]],
            }),
            VideoOutputMapper.toOutput({
              video: vidoes[1],
              allCategoriesOfVideoAndGenre: [categories[0]],
              genres: [genres[0], genres[1]],
              cast_members: [castMembers[0]],
            }),
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
            genres_id: [genres[0].genre_id.id],
          },
        },
        output: {
          items: [
            VideoOutputMapper.toOutput({
              video: vidoes[2],
              allCategoriesOfVideoAndGenre: [categories[0]],
              genres: [genres[0], genres[1], genres[2]],
              cast_members: [castMembers[0]],
            }),
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
            genres_id: [genres[0].genre_id.id, genres[1].genre_id.id],
          },
        },
        output: {
          items: [
            VideoOutputMapper.toOutput({
              video: vidoes[0],
              allCategoriesOfVideoAndGenre: [categories[0]],
              genres: [genres[0]],
              cast_members: [castMembers[0]],
            }),
            VideoOutputMapper.toOutput({
              video: vidoes[1],
              allCategoriesOfVideoAndGenre: [categories[0]],
              genres: [genres[0], genres[1]],
              cast_members: [castMembers[0]],
            }),
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
            genres_id: [genres[0].genre_id.id, genres[1].genre_id.id],
          },
        },
        output: {
          items: [
            VideoOutputMapper.toOutput({
              video: vidoes[2],
              allCategoriesOfVideoAndGenre: [categories[0]],
              genres: [genres[0], genres[1], genres[2]],
              cast_members: [castMembers[0]],
            }),
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
            genres_id: [genres[1].genre_id.id, genres[2].genre_id.id],
            categories_id: [categories[0].category_id.id],
          },
        },
        output: {
          items: [
            VideoOutputMapper.toOutput({
              video: vidoes[1],
              allCategoriesOfVideoAndGenre: [categories[0]],
              genres: [genres[0], genres[1]],
              cast_members: [castMembers[0]],
            }),
            VideoOutputMapper.toOutput({
              video: vidoes[2],
              allCategoriesOfVideoAndGenre: [categories[0]],
              genres: [genres[0], genres[1], genres[2]],
              cast_members: [castMembers[0]],
            }),
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

  it('should search applying paginate and sort', async () => {
    const categories = Category.fake().theCategories(3).build();
    await categoryRepo.bulkInsert(categories);

    const genres = Genre.fake()
      .theGenres(3)
      .addCategoryId(categories[0].category_id)
      .build();
    await genreRepo.bulkInsert(genres);

    const castMembers = CastMember.fake().theCastMembers(2).build();
    await castMemberRepo.bulkInsert(castMembers);

    const created_at = new Date();

    expect(videoRepo.sortableFields).toStrictEqual(['title', 'created_at']);

    const videos = [
      Video.fake()
        .aVideoWithoutMedias()
        .withTitle('b')
        .addCategoryId(categories[0].category_id)
        .addGenreId(genres[0].genre_id)
        .addCastMemberId(castMembers[0].cast_member_id)
        .build(),
      Video.fake()
        .aVideoWithoutMedias()
        .withTitle('a')
        .addCategoryId(categories[0].category_id)
        .addGenreId(genres[0].genre_id)
        .addCastMemberId(castMembers[0].cast_member_id)
        .build(),
      Video.fake()
        .aVideoWithoutMedias()
        .withTitle('d')
        .addCategoryId(categories[0].category_id)
        .addGenreId(genres[0].genre_id)
        .addCastMemberId(castMembers[0].cast_member_id)
        .build(),
      Video.fake()
        .aVideoWithoutMedias()
        .withTitle('e')
        .addCategoryId(categories[0].category_id)
        .addGenreId(genres[0].genre_id)
        .addCastMemberId(castMembers[0].cast_member_id)
        .build(),
      Video.fake()
        .aVideoWithoutMedias()
        .withTitle('c')
        .addCategoryId(categories[0].category_id)
        .addGenreId(genres[0].genre_id)
        .addCastMemberId(castMembers[0].cast_member_id)
        .build(),
    ];

    await videoRepo.bulkInsert(videos);

    const arrange = [
      {
        input: {
          page: 1,
          per_page: 2,
          sort: 'title',
        },
        output: {
          items: [
            VideoOutputMapper.toOutput({
              video: videos[1],
              allCategoriesOfVideoAndGenre: [categories[0]],
              genres: [genres[0]],
              cast_members: [castMembers[0]],
            }),
            VideoOutputMapper.toOutput({
              video: videos[0],
              allCategoriesOfVideoAndGenre: [categories[0]],
              genres: [genres[0]],
              cast_members: [castMembers[0]],
            }),
          ],
          total: 5,
          current_page: 1,
          per_page: 2,
          last_page: 3,
        },
      },
      {
        input: {
          page: 2,
          per_page: 2,
          sort: 'title',
        },
        output: {
          items: [
            VideoOutputMapper.toOutput({
              video: videos[4],
              allCategoriesOfVideoAndGenre: [categories[0]],
              genres: [genres[0]],
              cast_members: [castMembers[0]],
            }),
            VideoOutputMapper.toOutput({
              video: videos[2],
              allCategoriesOfVideoAndGenre: [categories[0]],
              genres: [genres[0]],
              cast_members: [castMembers[0]],
            }),
          ],
          total: 5,
          current_page: 2,
          per_page: 2,
          last_page: 3,
        },
      },
      {
        input: {
          page: 1,
          per_page: 2,
          sort: 'title',
          sort_dir: 'desc' as SortDirection,
        },
        output: {
          items: [
            VideoOutputMapper.toOutput({
              video: videos[3],
              allCategoriesOfVideoAndGenre: [categories[0]],
              genres: [genres[0]],
              cast_members: [castMembers[0]],
            }),
            VideoOutputMapper.toOutput({
              video: videos[2],
              allCategoriesOfVideoAndGenre: [categories[0]],
              genres: [genres[0]],
              cast_members: [castMembers[0]],
            }),
          ],
          total: 5,
          current_page: 1,
          per_page: 2,
          last_page: 3,
        },
      },
      {
        input: {
          page: 2,
          per_page: 2,
          sort: 'title',
          sort_dir: 'desc' as SortDirection,
        },
        output: {
          items: [
            VideoOutputMapper.toOutput({
              video: videos[4],
              allCategoriesOfVideoAndGenre: [categories[0]],
              genres: [genres[0]],
              cast_members: [castMembers[0]],
            }),
            VideoOutputMapper.toOutput({
              video: videos[0],
              allCategoriesOfVideoAndGenre: [categories[0]],
              genres: [genres[0]],
              cast_members: [castMembers[0]],
            }),
          ],
          total: 5,
          current_page: 2,
          per_page: 2,
          last_page: 3,
        },
      },
    ];

    for (const item of arrange) {
      const output = await useCase.execute(item.input);
      expect(output).toStrictEqual(item.output);
    }
  });

  describe('should search filter by title, sort and paginate', () => {
    const categories = Category.fake().theCategories(3).build();

    const genres = Genre.fake()
      .theGenres(3)
      .addCategoryId(categories[0].category_id)
      .build();

    const castMembers = CastMember.fake().theCastMembers(2).build();

    const videos = [
      Video.fake()
        .aVideoWithoutMedias()
        .withTitle('test')
        .addCategoryId(categories[0].category_id)
        .addGenreId(genres[0].genre_id)
        .addCastMemberId(castMembers[0].cast_member_id)
        .build(),
      Video.fake()
        .aVideoWithoutMedias()
        .withTitle('a')
        .addCategoryId(categories[0].category_id)
        .addGenreId(genres[0].genre_id)
        .addCastMemberId(castMembers[0].cast_member_id)
        .build(),
      Video.fake()
        .aVideoWithoutMedias()
        .withTitle('TEST')
        .addCategoryId(categories[0].category_id)
        .addGenreId(genres[0].genre_id)
        .addCastMemberId(castMembers[0].cast_member_id)
        .build(),
      Video.fake()
        .aVideoWithoutMedias()
        .withTitle('e')
        .addCategoryId(categories[0].category_id)
        .addGenreId(genres[0].genre_id)
        .addCastMemberId(castMembers[0].cast_member_id)
        .build(),
      Video.fake()
        .aVideoWithoutMedias()
        .withTitle('TeSt')
        .addCategoryId(categories[0].category_id)
        .addGenreId(genres[0].genre_id)
        .addCastMemberId(castMembers[0].cast_member_id)
        .build(),
    ];

    const arrange = [
      {
        input: {
          page: 1,
          per_page: 2,
          sort: 'title',
          filter: { title: 'test' },
        },
        output: {
          items: [
            VideoOutputMapper.toOutput({
              video: videos[2],
              allCategoriesOfVideoAndGenre: [categories[0]],
              genres: [genres[0]],
              cast_members: [castMembers[0]],
            }),
            VideoOutputMapper.toOutput({
              video: videos[4],
              allCategoriesOfVideoAndGenre: [categories[0]],
              genres: [genres[0]],
              cast_members: [castMembers[0]],
            }),
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
          sort: 'title',
          filter: { title: 'test' },
        },
        output: {
          items: [
            VideoOutputMapper.toOutput({
              video: videos[0],
              allCategoriesOfVideoAndGenre: [categories[0]],
              genres: [genres[0]],
              cast_members: [castMembers[0]],
            }),
          ],
          total: 3,
          current_page: 2,
          per_page: 2,
          last_page: 2,
        },
      },
    ];

    beforeEach(async () => {
      await categoryRepo.bulkInsert(categories);
      await genreRepo.bulkInsert(genres);
      await castMemberRepo.bulkInsert(castMembers);
      await videoRepo.bulkInsert(videos);
    });

    test.each(arrange)(
      'when input is {"filter": $input.filter, "page": $input.page, "per_page": $input.per_page, "sort": $input.sort, "sort_dir": $input.sort_dir}',
      async ({ input, output: expectedOutput }) => {
        const output = await useCase.execute(input);
        expect(output).toStrictEqual(expectedOutput);
      },
    );
  });

  describe('should search filter by categories_id, sort and paginate', () => {
    const categories = Category.fake().theCategories(4).build();

    const genres = Genre.fake()
      .theGenres(3)
      .addCategoryId(categories[0].category_id)
      .build();

    const castMembers = CastMember.fake().theCastMembers(2).build();

    const created_at = new Date();

    const videos = [
      Video.fake()
        .aVideoWithoutMedias()
        .withTitle('test')
        .addCategoryId(categories[0].category_id)
        .addGenreId(genres[0].genre_id)
        .addCastMemberId(castMembers[0].cast_member_id)
        .withCreatedAt(created_at)
        .build(),
      Video.fake()
        .aVideoWithoutMedias()
        .withTitle('a')
        .addCategoryId(categories[0].category_id)
        .addCategoryId(categories[1].category_id)
        .addGenreId(genres[0].genre_id)
        .addCastMemberId(castMembers[0].cast_member_id)
        .withCreatedAt(created_at)
        .build(),
      Video.fake()
        .aVideoWithoutMedias()
        .withTitle('TEST')
        .addCategoryId(categories[0].category_id)
        .addCategoryId(categories[1].category_id)
        .addCategoryId(categories[2].category_id)
        .addGenreId(genres[0].genre_id)
        .addCastMemberId(castMembers[0].cast_member_id)
        .withCreatedAt(created_at)
        .build(),
      Video.fake()
        .aVideoWithoutMedias()
        .withTitle('e')
        .addCategoryId(categories[3].category_id)
        .addGenreId(genres[0].genre_id)
        .addCastMemberId(castMembers[0].cast_member_id)
        .withCreatedAt(created_at)
        .build(),
      Video.fake()
        .aVideoWithoutMedias()
        .withTitle('TeSt')
        .addCategoryId(categories[1].category_id)
        .addCategoryId(categories[2].category_id)
        .addGenreId(genres[0].genre_id)
        .addCastMemberId(castMembers[0].cast_member_id)
        .withCreatedAt(created_at)
        .build(),
    ];

    const arrange = [
      {
        input: {
          page: 1,
          per_page: 2,
          sort: 'title',
          filter: {
            title: 'TEST',
            categories_id: [categories[0].category_id.id],
          },
        },
        output: {
          items: [
            VideoOutputMapper.toOutput({
              video: videos[2],
              allCategoriesOfVideoAndGenre: [
                categories[0],
                categories[1],
                categories[2],
              ],
              genres: [genres[0]],
              cast_members: [castMembers[0]],
            }),
            VideoOutputMapper.toOutput({
              video: videos[0],
              allCategoriesOfVideoAndGenre: [categories[0]],
              genres: [genres[0]],
              cast_members: [castMembers[0]],
            }),
          ],
          total: 2,
          current_page: 1,
          per_page: 2,
          last_page: 1,
        },
      },
      {
        input: {
          page: 1,
          per_page: 2,
          sort: 'title',
          filter: {
            title: 'TEST',
            categories_id: [
              categories[0].category_id.id,
              categories[1].category_id.id,
            ],
          },
        },
        output: {
          items: [
            VideoOutputMapper.toOutput({
              video: videos[2],
              allCategoriesOfVideoAndGenre: [
                categories[0],
                categories[1],
                categories[2],
              ],
              genres: [genres[0]],
              cast_members: [castMembers[0]],
            }),
            VideoOutputMapper.toOutput({
              video: videos[4],
              allCategoriesOfVideoAndGenre: [categories[1], categories[2]],
              genres: [genres[0]],
              cast_members: [castMembers[0]],
            }),
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
          sort: 'title',
          filter: {
            title: 'TEST',
            categories_id: [
              categories[0].category_id.id,
              categories[1].category_id.id,
            ],
          },
        },
        output: {
          items: [
            VideoOutputMapper.toOutput({
              video: videos[0],
              allCategoriesOfVideoAndGenre: [categories[0]],
              genres: [genres[0]],
              cast_members: [castMembers[0]],
            }),
          ],
          total: 3,
          current_page: 2,
          per_page: 2,
          last_page: 2,
        },
      },
    ];

    beforeEach(async () => {
      await categoryRepo.bulkInsert(categories);
      await genreRepo.bulkInsert(genres);
      await castMemberRepo.bulkInsert(castMembers);
      await videoRepo.bulkInsert(videos);
    });

    test.each(arrange)(
      'when input is {"filter": $input.filter, "page": $input.page, "per_page": $input.per_page, "sort": $input.sort, "sort_dir": $input.sort_dir}',
      async ({ input, output: expectedOutput }) => {
        const output = await useCase.execute(input);
        expect(output).toStrictEqual(expectedOutput);
      },
    );
  });
});
