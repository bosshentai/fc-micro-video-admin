import request from 'supertest';
import { CastMember } from '@core/cast-member/domain/cast-member.entity';
import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository';
import { CAST_MEMBER_PROVIDERS } from 'src/nest-modules/cast-members/cast-members.providers';
import { GetCastMemberFixture } from 'src/nest-modules/cast-members/testing/cast-member-fixture';
import { startApp } from 'src/nest-modules/shared-module/testing/helpers';

describe('CastMemberController (e2e)', () => {
  const appHelper = startApp();

  describe('/cast-members/:id (GET)', () => {
    describe('should a response error when id is invalid or not found', () => {
      const arrange = [
        {
          id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          expected: {
            message:
              'CastMember Not Found using Id 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
            statusCode: 404,
            error: 'Not Found',
          },
        },
        {
          id: 'fake id',
          expected: {
            message: 'Validation failed (uuid is expected)',
            statusCode: 422,
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)('when id is $id', async ({ id, expected }) => {
        return request(appHelper.app.getHttpServer())
          .get(`/cast-members/${id}`)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it('should return a cast member', async () => {
      const castMemberRepo = appHelper.app.get<ICastMemberRepository>(
        CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
      );

      const castMember = CastMember.fake().anActor().build();
      await castMemberRepo.insert(castMember);

      const response = await request(appHelper.app.getHttpServer())
        .get(`/cast-members/${castMember.cast_member_id}`)
        .expect(200);

      const keyInResponse = GetCastMemberFixture.keyInResponse;
      expect(Object.keys(response.body)).toStrictEqual(['data']);
      expect(Object.keys(response.body.data)).toStrictEqual(keyInResponse);
    });
  });
});
