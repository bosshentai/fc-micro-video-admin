import { CastMember } from '@core/cast-member/domain/cast-member.aggregate';
import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository';
import { Category } from '@core/category/domain/category.aggregate';
import { ICategoryRepository } from '@core/category/domain/category.repository';
import { Genre } from '@core/genre/domain/genre.aggregate';
import { IGenreRepository } from '@core/genre/domain/genre.repository';
import { Video } from '@core/video/domain/video.aggregate';
import { IVideoRepository } from '@core/video/domain/video.repository';
import { CAST_MEMBER_PROVIDERS } from 'src/nest-modules/cast-members-module/cast-members.providers';
import { CATEGORY_PROVIDERS } from 'src/nest-modules/categories-module/categories.providers';
import { GENRES_PROVIDERS } from 'src/nest-modules/genres-module/genres.providers';
import { startApp } from 'src/nest-modules/shared-module/testing/helpers';
import { VIDEO_PROVIDERS } from 'src/nest-modules/videos-module/videos.providers';
import request from 'supertest';
describe('VideosController (e2e)', () => {
  describe('/delete/:id (DELETE)', () => {
    const nestApp = startApp();

    describe('should a response error when id is invalid or not found', () => {
      const arrange = [
        {
          id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          expected: {
            message:
              'Video Not Found using Id 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
            statusCode: 404,
            error: 'Not Found',
          },
        },
        {
          id: 'fake id',
          expected: {
            statusCode: 422,
            message: 'Validation failed (uuid is expected)',
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)('when id is $id', async ({ id, expected }) => {
        return request(nestApp.app.getHttpServer())
          .delete(`/videos/${id}`)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it('should delete a video response with status 204', async () => {
      const genreRepo = nestApp.app.get<IGenreRepository>(
        GENRES_PROVIDERS.REPOSITORIES.GENRE_REPOSITORY.provide,
      );
      const categoryRepo = nestApp.app.get<ICategoryRepository>(
        CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      );

      const castMemberRepo = nestApp.app.get<ICastMemberRepository>(
        CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
      );

      const videoRepo = nestApp.app.get<IVideoRepository>(
        VIDEO_PROVIDERS.REPOSITORIES.VIDEO_REPOSITORY.provide,
      );

      const category = Category.fake().aCategory().build();
      await categoryRepo.insert(category);

      const genre = Genre.fake()
        .aGenre()
        .addCategoryId(category.category_id)
        .build();
      await genreRepo.insert(genre);

      const castMember = CastMember.fake().anActor().build();
      await castMemberRepo.insert(castMember);

      const video = Video.fake()
        .aVideoWithoutMedias()
        .addCategoryId(category.category_id)
        .addGenreId(genre.genre_id)
        .addCastMemberId(castMember.cast_member_id)
        .build();
      await videoRepo.insert(video);

      await request(nestApp.app.getHttpServer())
        .delete(`/videos/${video.video_id}`)
        .expect(204);

      await expect(videoRepo.findById(video.video_id)).resolves.toBeNull();
    });
  });
});
