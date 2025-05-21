import { CastMember } from '@core/cast-member/domain/cast-member.aggregate';
import { Category } from '@core/category/domain/category.aggregate';
import { Genre } from '@core/genre/domain/genre.aggregate';
import { SortDirection } from '@core/shared/domain/repository/search-params';
import { Video } from '@core/video/domain/video.aggregate';

export class ListVideosFixture {
  static arrangeIncrementedWithCreatedAt() {
    const category = Category.fake().aCategory().build();
    const genre = Genre.fake()
      .aGenre()
      .addCategoryId(category.category_id)
      .build();
    const castMember = CastMember.fake().anActor().build();

    const _entities = Video.fake()
      .theVideosWithAllMedias(4)
      .addCategoryId(category.category_id)
      .addGenreId(genre.genre_id)
      .addCastMemberId(castMember.cast_member_id)
      .withTitle((i) => i + '')
      .withCreatedAt((i) => new Date(new Date().getTime() + 2000 * i))
      .build();

    const entitiesMap = {
      first: _entities[0],
      second: _entities[1],
      third: _entities[2],
      fourth: _entities[3],
    };

    const relations = {
      categories: new Map([[category.category_id.id, category]]),
      genres: new Map([[genre.genre_id.id, genre]]),
      cast_members: new Map([[castMember.cast_member_id.id, castMember]]),
    };

    const arrange = [
      {
        send_data: {},
        expected: {
          entities: [
            entitiesMap.fourth,
            entitiesMap.third,
            entitiesMap.second,
            entitiesMap.first,
          ],
          meta: {
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 4,
          },
        },
      },
    ];

    return { arrange, entitiesMap, relations };
  }

  static arrangeUnsorted() {
    const categories = Category.fake().theCategories(4).build();
    const genres = Genre.fake()
      .theGenres(4)
      .addCategoryId(categories[0].category_id)
      .addCategoryId(categories[1].category_id)
      .addCategoryId(categories[2].category_id)
      .addCategoryId(categories[3].category_id)
      .build();

    const castMembers = CastMember.fake().theCastMembers(4).build();

    const relations = {
      categories: new Map(
        categories.map((category) => [category.category_id.id, category]),
      ),
      genres: new Map(genres.map((genre) => [genre.genre_id.id, genre])),
      cast_members: new Map(
        castMembers.map((castMember) => [
          castMember.cast_member_id.id,
          castMember,
        ]),
      ),
    };

    const created_at = new Date();

    const entitiesMap = {
      test: Video.fake()
        .aVideoWithoutMedias()
        .addCategoryId(categories[0].category_id)
        .addCategoryId(categories[1].category_id)
        .addGenreId(genres[0].genre_id)
        .addGenreId(genres[1].genre_id)
        .addCastMemberId(castMembers[0].cast_member_id)
        .addCastMemberId(castMembers[1].cast_member_id)
        .withTitle('test')
        .withCreatedAt(new Date(created_at.getTime() + 1000))
        .build(),
      a: Video.fake()
        .aVideoWithoutMedias()
        .addCategoryId(categories[0].category_id)
        .addCategoryId(categories[1].category_id)
        .addGenreId(genres[0].genre_id)
        .addGenreId(genres[1].genre_id)
        .addCastMemberId(castMembers[0].cast_member_id)
        .addCastMemberId(castMembers[1].cast_member_id)
        .withTitle('a')
        .withCreatedAt(new Date(created_at.getTime() + 2000))
        .build(),
      TEST: Video.fake()
        .aVideoWithoutMedias()
        .addCategoryId(categories[0].category_id)
        .addCategoryId(categories[1].category_id)
        .addCategoryId(categories[2].category_id)
        .addGenreId(genres[0].genre_id)
        .addGenreId(genres[1].genre_id)
        .addGenreId(genres[2].genre_id)
        .addCastMemberId(castMembers[0].cast_member_id)
        .addCastMemberId(castMembers[1].cast_member_id)
        .addCastMemberId(castMembers[2].cast_member_id)

        .withTitle('TEST')
        .withCreatedAt(new Date(created_at.getTime() + 3000))
        .build(),
      e: Video.fake()
        .aVideoWithoutMedias()
        .addCategoryId(categories[3].category_id)
        .addGenreId(genres[3].genre_id)
        .addCastMemberId(castMembers[3].cast_member_id)
        .withTitle('e')
        .withCreatedAt(new Date(created_at.getTime() + 4000))
        .build(),
      TeSt: Video.fake()
        .aVideoWithoutMedias()
        .addCategoryId(categories[1].category_id)
        .addCategoryId(categories[2].category_id)
        .addGenreId(genres[1].genre_id)
        .addGenreId(genres[2].genre_id)
        .addCastMemberId(castMembers[1].cast_member_id)
        .addCastMemberId(castMembers[2].cast_member_id)
        .withTitle('TeSt')
        .withCreatedAt(new Date(created_at.getTime() + 5000))
        .build(),
    };

    const arrange_filter_by_title_sort_title_asc = [
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'title',
          sort_dir: 'asc',
          filter: { title: 'TEST' },
        },
        get label() {
          return JSON.stringify(this.send_data);
        },
        expected: {
          entities: [entitiesMap.TEST, entitiesMap.TeSt],
          meta: {
            total: 3,
            current_page: 1,
            last_page: 2,
            per_page: 2,
          },
        },
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
          sort: 'title',
          sort_dir: 'asc',
          filter: { title: 'TEST' },
        },
        get label() {
          return JSON.stringify(this.send_data);
        },
        expected: {
          entities: [entitiesMap.test],
          meta: {
            total: 3,
            current_page: 2,
            last_page: 2,
            per_page: 2,
          },
        },
      },
    ];

    const arrange_filter_by_categories_id_and_sort_by_created_desc = [
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'created_at',
          sort_dir: 'desc',
          filter: { categories_id: [categories[0].category_id.id] },
        },
        get label() {
          return JSON.stringify({
            ...this.send_data,
            filter: { categories_id_length: 1 },
          });
        },
        expected: {
          entities: [entitiesMap.TEST, entitiesMap.a],
          meta: {
            total: 3,
            current_page: 1,
            last_page: 2,
            per_page: 2,
          },
        },
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
          sort: 'created_at',
          sort_dir: 'desc',
          filter: { categories_id: [categories[0].category_id.id] },
        },
        get label() {
          return JSON.stringify({
            ...this.send_data,
            filter: { categories_id_length: 1 },
          });
        },
        expected: {
          entities: [entitiesMap.test],
          meta: {
            total: 3,
            current_page: 2,
            last_page: 2,
            per_page: 2,
          },
        },
      },
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'created_at',
          sort_dir: 'desc',
          filter: { categories_id: [categories[3].category_id.id] },
        },
        get label() {
          return JSON.stringify({
            ...this.send_data,
            filter: { categories_id_length: 1 },
          });
        },
        expected: {
          entities: [entitiesMap.e],
          meta: {
            total: 1,
            current_page: 1,
            last_page: 1,
            per_page: 2,
          },
        },
      },
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'created_at',
          sort_dir: 'desc',
          filter: {
            categories_id: [
              categories[0].category_id.id,
              categories[1].category_id.id,
            ],
          },
        },
        get label() {
          return JSON.stringify({
            ...this.send_data,
            filter: { categories_id_length: 2 },
          });
        },
        expected: {
          entities: [entitiesMap.TeSt, entitiesMap.TEST],
          meta: {
            total: 4,
            current_page: 1,
            last_page: 2,
            per_page: 2,
          },
        },
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
          sort: 'created_at',
          sort_dir: 'desc',
          filter: {
            categories_id: [
              categories[0].category_id.id,
              categories[1].category_id.id,
            ],
          },
        },
        get label() {
          return JSON.stringify({
            ...this.send_data,
            filter: { categories_id_length: 2 },
          });
        },
        expected: {
          entities: [entitiesMap.a, entitiesMap.test],
          meta: {
            total: 4,
            current_page: 2,
            last_page: 2,
            per_page: 2,
          },
        },
      },
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'created_at',
          sort_dir: 'desc',
          filter: {
            categories_id: [
              categories[0].category_id.id,
              categories[1].category_id.id,
              categories[2].category_id.id,
            ],
          },
        },
        get label() {
          return JSON.stringify({
            ...this.send_data,
            filter: { categories_id_length: 3 },
          });
        },
        expected: {
          entities: [entitiesMap.TeSt, entitiesMap.TEST],
          meta: {
            total: 4,
            current_page: 1,
            last_page: 2,
            per_page: 2,
          },
        },
      },
    ];

    const arrange_filter_by_genres_id_and_sort_by_created_asc = [
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'created_at',
          sort_dir: 'asc',
          filter: { genres_id: [genres[0].genre_id.id] },
        },
        get label() {
          return JSON.stringify({
            ...this.send_data,
            filter: { genres_id_length: 1 },
          });
        },
        expected: {
          entities: [entitiesMap.test, entitiesMap.a],
          meta: {
            total: 3,
            current_page: 1,
            last_page: 2,
            per_page: 2,
          },
        },
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
          sort: 'created_at',
          sort_dir: 'asc',
          filter: { genres_id: [genres[0].genre_id.id] },
        },
        get label() {
          return JSON.stringify({
            ...this.send_data,
            filter: { genres_id_length: 1 },
          });
        },
        expected: {
          entities: [entitiesMap.TEST],
          meta: {
            total: 3,
            current_page: 2,
            last_page: 2,
            per_page: 2,
          },
        },
      },
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'created_at',
          sort_dir: 'asc',
          filter: { genres_id: [genres[0].genre_id.id, genres[1].genre_id.id] },
        },
        get label() {
          return JSON.stringify({
            ...this.send_data,
            filter: { genres_id_length: 2 },
          });
        },
        expected: {
          entities: [entitiesMap.test, entitiesMap.a],
          meta: {
            total: 4,
            current_page: 1,
            last_page: 2,
            per_page: 2,
          },
        },
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
          sort: 'created_at',
          sort_dir: 'asc',
          filter: { genres_id: [genres[0].genre_id.id, genres[1].genre_id.id] },
        },
        get label() {
          return JSON.stringify({
            ...this.send_data,
            filter: { genres_id_length: 2 },
          });
        },
        expected: {
          entities: [entitiesMap.TEST, entitiesMap.TeSt],
          meta: {
            total: 4,
            current_page: 2,
            last_page: 2,
            per_page: 2,
          },
        },
      },
    ];

    const arrange_filter_by_castMembers_id_and_sort_by_created_desc = [
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'created_at',
          sort_dir: 'desc',
          filter: { cast_members_id: [castMembers[0].cast_member_id.id] },
        },
        get label() {
          return JSON.stringify({
            ...this.send_data,
            filter: { cast_members_id_length: 1 },
          });
        },
        expected: {
          entities: [entitiesMap.TEST, entitiesMap.a],
          meta: {
            total: 3,
            current_page: 1,
            last_page: 2,
            per_page: 2,
          },
        },
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
          sort: 'created_at',
          sort_dir: 'desc',
          filter: { cast_members_id: [castMembers[0].cast_member_id.id] },
        },
        get label() {
          return JSON.stringify({
            ...this.send_data,
            filter: { cast_members_id_length: 1 },
          });
        },
        expected: {
          entities: [entitiesMap.test],
          meta: {
            total: 3,
            current_page: 2,
            last_page: 2,
            per_page: 2,
          },
        },
      },
      {
        send_data: {
          page: 1,
          per_page: 2,
          sort: 'created_at',
          sort_dir: 'desc',
          filter: {
            cast_members_id: [
              castMembers[0].cast_member_id.id,
              castMembers[1].cast_member_id.id,
            ],
          },
        },
        get label() {
          return JSON.stringify({
            ...this.send_data,
            filter: { cast_members_id_length: 2 },
          });
        },
        expected: {
          entities: [entitiesMap.TeSt, entitiesMap.TEST],
          meta: {
            total: 4,
            current_page: 1,
            last_page: 2,
            per_page: 2,
          },
        },
      },
    ];

    return {
      arrange: [
        ...arrange_filter_by_title_sort_title_asc,
        ...arrange_filter_by_categories_id_and_sort_by_created_desc,
        ...arrange_filter_by_genres_id_and_sort_by_created_asc,
        ...arrange_filter_by_castMembers_id_and_sort_by_created_desc,
      ],
      entitiesMap,
      relations,
    };
  }
}
