import request from 'supertest';
import { ICastMemberRepository } from '../../src/core/cast-member/domain/cast-member.repository';

import { startApp } from 'src/nest-modules/shared-module/testing/helpers';
import { CastMember } from '@core/cast-member/domain/cast-member.aggregate';
import { CAST_MEMBER_PROVIDERS } from 'src/nest-modules/cast-members-module/cast-members.providers';

describe('CastMemberController (e2e)', () => {
  describe('/delete/:id (DELETE)', () => {
    const appHelper = startApp();

    describe('should a response error when id is invalid or not found', () => {
      const arrange = [
        {
          id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          expected: {
            statusCode: 404,
            error: 'Not Found',
            message:
              'CastMember Not Found using Id 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
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
        return request(appHelper.app.getHttpServer())
          .delete(`/cast-members/${id}`)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it('should delete a cast member response with status 204', async () => {
      const castMemberRepo = appHelper.app.get<ICastMemberRepository>(
        CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
      );

      const castMember = CastMember.fake().anActor().build();

      await castMemberRepo.insert(castMember);

      await request(appHelper.app.getHttpServer())
        .delete(`/cast-members/${castMember.cast_member_id.id}`)
        .expect(204);

      await expect(
        castMemberRepo.findById(castMember.cast_member_id),
      ).resolves.toBeNull();
    });
  });
});
