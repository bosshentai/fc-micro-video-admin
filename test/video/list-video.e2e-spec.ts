import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository';
import { ICategoryRepository } from '@core/category/domain/category.repository';
import { IGenreRepository } from '@core/genre/domain/genre.repository';
import { IVideoRepository } from '@core/video/domain/video.repository';
import { CAST_MEMBER_PROVIDERS } from 'src/nest-modules/cast-members-module/cast-members.providers';
import { CATEGORY_PROVIDERS } from 'src/nest-modules/categories-module/categories.providers';
import { GENRES_PROVIDERS } from 'src/nest-modules/genres-module/genres.providers';
import { startApp } from 'src/nest-modules/shared-module/testing/helpers';
import { ListVideosFixture } from 'src/nest-modules/videos-module/testing/video-fixture';
import { VIDEO_PROVIDERS } from 'src/nest-modules/videos-module/videos.providers';

import qs from 'qs';

import request from 'supertest';

describe('VideosController (e2e)', () => {
  describe('/videos (GET)', () => {
    describe('should return videos sorted by created_at when request query is empty', () => {
      let videoRepo: IVideoRepository;
      let categoryRepo: ICategoryRepository;
      let genreRepo: IGenreRepository;
      let castMemberRepo: ICastMemberRepository;
      const nestApp = startApp();
      const { relations, entitiesMap, arrange } =
        ListVideosFixture.arrangeIncrementedWithCreatedAt();

      beforeEach(async () => {
        videoRepo = nestApp.app.get<IVideoRepository>(
          VIDEO_PROVIDERS.REPOSITORIES.VIDEO_REPOSITORY.provide,
        );
        categoryRepo = nestApp.app.get<ICategoryRepository>(
          CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );
        genreRepo = nestApp.app.get<IGenreRepository>(
          GENRES_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
        );
        castMemberRepo = nestApp.app.get<ICastMemberRepository>(
          CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
        );

        await categoryRepo.bulkInsert(
          Array.from(relations.categories.values()),
        );
        await genreRepo.bulkInsert(Array.from(relations.genres.values()));
        await castMemberRepo.bulkInsert(
          Array.from(relations.cast_members.values()),
        );
        await videoRepo.bulkInsert(Object.values(entitiesMap));
      });

      test.each(arrange)(
        'when send_data is $label',
        async ({ send_data, expected }) => {
          const queryParams = new URLSearchParams(send_data as any).toString();
          const data = expected.entities.map((e) => ({
            id: e.video_id.id,
            title: e.title,
            description: e.description,
            duration: e.duration,
            rating: e.rating.value,
            is_opened: e.is_opened,
            is_published: e.is_published,
            year_launched: e.year_launched,
            cast_members_id: expect.arrayContaining(
              Array.from(e.cast_members_id.keys()),
            ),
            cast_members: expect.arrayContaining(
              Array.from(relations.cast_members.values())
                .filter((c) => e.cast_members_id.has(c.cast_member_id.id))
                .map((c) => ({
                  id: c.cast_member_id.id,
                  name: c.name,
                  type: c.member_type.type,
                  created_at: c.created_at.toISOString(),
                })),
            ),
            categories_id: expect.arrayContaining(
              Array.from(e.categories_id.keys()),
            ),
            categories: expect.arrayContaining(
              Array.from(relations.categories.values())
                .filter((c) => e.categories_id.has(c.category_id.id))
                .map((c) => ({
                  id: c.category_id.id,
                  name: c.name,
                  created_at: c.created_at.toISOString(),
                })),
            ),
            genres_id: expect.arrayContaining(Array.from(e.genres_id.keys())),
            genres: expect.arrayContaining(
              Array.from(relations.genres.values())
                .filter((c) => e.genres_id.has(c.genre_id.id))
                .map((c) => ({
                  id: c.genre_id.id,
                  name: c.name,
                  is_active: c.is_active,
                  categories_id: expect.arrayContaining(
                    Array.from(e.categories_id.keys()),
                  ),
                  categories: expect.arrayContaining(
                    Array.from(relations.categories.values())
                      .filter((c) => e.categories_id.has(c.category_id.id))
                      .map((c) => ({
                        id: c.category_id.id,
                        name: c.name,
                        created_at: c.created_at.toISOString(),
                      })),
                  ),
                  created_at: c.created_at.toISOString(),
                })),
            ),
            created_at: e.created_at.toISOString(),
          }));

          const response = await request(nestApp.app.getHttpServer())
            .get(`/videos/?${queryParams}`)
            .expect(200);

          expect(response.body).toStrictEqual({
            data: data,
            meta: expected.meta,
          });
        },
      );
    });

    describe('should return videos using paginate, filter and sort', () => {
      let videoRepo: IVideoRepository;
      let categoryRepo: ICategoryRepository;
      let genreRepo: IGenreRepository;
      let castMemberRepo: ICastMemberRepository;
      const nestApp = startApp();
      const { relations, entitiesMap, arrange } =
        ListVideosFixture.arrangeUnsorted();

      beforeEach(async () => {
        videoRepo = nestApp.app.get<IVideoRepository>(
          VIDEO_PROVIDERS.REPOSITORIES.VIDEO_REPOSITORY.provide,
        );
        categoryRepo = nestApp.app.get<ICategoryRepository>(
          CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );
        genreRepo = nestApp.app.get<IGenreRepository>(
          GENRES_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
        );
        castMemberRepo = nestApp.app.get<ICastMemberRepository>(
          CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
        );

        await categoryRepo.bulkInsert(
          Array.from(relations.categories.values()),
        );
        await genreRepo.bulkInsert(Array.from(relations.genres.values()));
        await castMemberRepo.bulkInsert(
          Array.from(relations.cast_members.values()),
        );
        await videoRepo.bulkInsert(Object.values(entitiesMap));
      });

      test.each(arrange)(
        'when send_data is $label',
        async ({ send_data, expected }) => {
          const queryParams = qs.stringify(send_data as any);

          const data = expected.entities.map((e) => ({
            id: e.video_id.id,
            title: e.title,
            description: e.description,
            duration: e.duration,
            rating: e.rating.value,
            is_opened: e.is_opened,
            is_published: e.is_published,
            year_launched: e.year_launched,
            cast_members_id: expect.arrayContaining(
              Array.from(e.cast_members_id.keys()),
            ),
            cast_members: expect.arrayContaining(
              Array.from(relations.cast_members.values())
                .filter((c) => e.cast_members_id.has(c.cast_member_id.id))
                .map((c) => ({
                  id: c.cast_member_id.id,
                  name: c.name,
                  type: c.member_type.type,
                  created_at: c.created_at.toISOString(),
                })),
            ),
            categories_id: expect.arrayContaining(
              Array.from(e.categories_id.keys()),
            ),
            categories: expect.arrayContaining(
              Array.from(relations.categories.values())
                .filter((c) => e.categories_id.has(c.category_id.id))
                .map((c) => ({
                  id: c.category_id.id,
                  name: c.name,
                  created_at: c.created_at.toISOString(),
                })),
            ),
            genres_id: expect.arrayContaining(Array.from(e.genres_id.keys())),
            genres: expect.arrayContaining(
              Array.from(relations.genres.values())
                .filter((c) => e.genres_id.has(c.genre_id.id))
                .map((c) => ({
                  id: c.genre_id.id,
                  name: c.name,
                  is_active: c.is_active,
                  categories_id: expect.arrayContaining(
                    Array.from(c.categories_id.keys()),
                  ),
                  categories: expect.arrayContaining(
                    Array.from(relations.categories.values())
                      .filter((c) => e.categories_id.has(c.category_id.id))
                      .map((c) => ({
                        id: c.category_id.id,
                        name: c.name,
                        created_at: c.created_at.toISOString(),
                      })),
                  ),
                  created_at: c.created_at.toISOString(),
                })),
            ),
            created_at: e.created_at.toISOString(),
          }));

          const response = await request(nestApp.app.getHttpServer())
            .get(`/videos/?${queryParams}`)
            .expect(200);

          expect(response.body).toStrictEqual({
            data: data,
            meta: expected.meta,
          });
        },
      );
    });
  });
});
