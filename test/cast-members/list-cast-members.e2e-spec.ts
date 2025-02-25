import { CastMemberOutputMapper } from '@core/cast-member/application/use-cases/common/cast-member-output';
import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository';
import { instanceToPlain } from 'class-transformer';
import qs from 'qs';
import { CastMembersController } from 'src/nest-modules/cast-members/cast-members.controller';
import { CAST_MEMBER_PROVIDERS } from 'src/nest-modules/cast-members/cast-members.providers';
import { ListCastMembersFixture } from 'src/nest-modules/cast-members/testing/cast-member-fixture';
import { startApp } from 'src/nest-modules/shared-module/testing/helpers';
import request from 'supertest';

describe('CastMemberController (e2e)', () => {
  describe('/cast-members (GET)', () => {
    describe('should return a cast members sorted by created_at when request query is empty', () => {
      let castMemberRepo: ICastMemberRepository;

      const appHelper = startApp();

      const { entitiesMap, arrange } =
        ListCastMembersFixture.arrangeIncrementedWithCreatedAt();

      beforeEach(async () => {
        castMemberRepo = appHelper.app.get<ICastMemberRepository>(
          CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
        );

        await castMemberRepo.bulkInsert(Object.values(entitiesMap));
      });

      test.each(arrange)(
        'when query params is $send_data',
        async ({ send_data, expected }) => {
          const queryParams = new URLSearchParams(
            Object.entries(send_data).map(([key, value]) => [
              key,
              value.toString(),
            ]),
          ).toString();

          return request(appHelper.app.getHttpServer())
            .get(`/cast-members/?${queryParams}`)
            .expect(200)
            .expect({
              data: expected.entities.map((e) =>
                instanceToPlain(
                  CastMembersController.serialize(
                    CastMemberOutputMapper.toOutput(e),
                  ),
                ),
              ),
              meta: expected.meta,
            });
        },
      );
    });

    describe('should return a cast members using paginate, filter and sort', () => {
      let castMemberRepo: ICastMemberRepository;
      const appHelper = startApp();
      const { entitiesMap, arrange } = ListCastMembersFixture.arrangeUnsorted();

      beforeEach(async () => {
        castMemberRepo = appHelper.app.get<ICastMemberRepository>(
          CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
        );
        await castMemberRepo.bulkInsert(Object.values(entitiesMap));
      });

      test.each([arrange])(
        'when query params is $send_data',
        ({ send_data, expected }) => {
          const queryParams = qs.stringify(send_data);

          return request(appHelper.app.getHttpServer())
            .get(`/cast-members/?${queryParams}`)
            .expect(200)
            .expect({
              data: expected.entities.map((e) =>
                instanceToPlain(
                  CastMembersController.serialize(
                    CastMemberOutputMapper.toOutput(e),
                  ),
                ),
              ),
              meta: expected.meta,
            });
        },
      );
    });
  });
});
