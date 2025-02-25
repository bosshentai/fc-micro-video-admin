import { CastMemberOutputMapper } from '@core/cast-member/application/use-cases/common/cast-member-output';
import { CastMember } from '@core/cast-member/domain/cast-member.entity';
import { ICastMemberRepository } from '@core/cast-member/domain/cast-member.repository';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { instanceToPlain } from 'class-transformer';
import { CastMembersController } from 'src/nest-modules/cast-members/cast-members.controller';
import { CAST_MEMBER_PROVIDERS } from 'src/nest-modules/cast-members/cast-members.providers';
import { UpdateCastMemberFixture } from 'src/nest-modules/cast-members/testing/cast-member-fixture';
import { UpdateCategoryFixture } from 'src/nest-modules/categories-module/testing/category-fixture';
import { startApp } from 'src/nest-modules/shared-module/testing/helpers';
import request from 'supertest';

describe('CastMemberController (e2e)', () => {
  const uuid = '98b1c5e6-3c4d-4a7b-8e9f-0e1d2f3c4d5e';

  describe('/update/:id (PATCH)', () => {
    describe('should a response error when id is invalid or not found', () => {
      const appHelper = startApp();
      const invalidRequest = UpdateCategoryFixture.arrangeInvalidRequest();

      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));
      test.each(arrange)('when id is $id', async ({ value }) => {
        return request(appHelper.app.getHttpServer())
          .patch(`/cast-members/${uuid}`)
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should a response error with 422 when throw EntityValidationError', () => {
      const appHelper = startApp();

      const validationError =
        UpdateCastMemberFixture.arrangeForEntityValidationError();

      const arrange = Object.keys(validationError).map((key) => ({
        label: key,
        value: validationError[key],
      }));

      let castMemberRepo: ICastMemberRepository;

      beforeEach(() => {
        castMemberRepo = appHelper.app.get<ICastMemberRepository>(
          CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
        );
      });

      test.each(arrange)('when body is $label', async ({ value }) => {
        const castMember = CastMember.fake().anActor().build();
        await castMemberRepo.insert(castMember);

        return request(appHelper.app.getHttpServer())
          .patch(`/cast-members/${castMember.cast_member_id.id}`)
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should update a cast member', () => {
      const appHelper = startApp();
      const arrange = UpdateCastMemberFixture.arrangeForupdate();

      let castMemberRepo: ICastMemberRepository;

      beforeEach(async () => {
        castMemberRepo = appHelper.app.get<ICastMemberRepository>(
          CAST_MEMBER_PROVIDERS.REPOSITORIES.CAST_MEMBER_REPOSITORY.provide,
        );
      });

      test.each(arrange)(
        'when body is $send_data',
        async ({ send_data, expected }) => {
          const castMemberCreated = CastMember.fake().anActor().build();
          await castMemberRepo.insert(castMemberCreated);

          const response = await request(appHelper.app.getHttpServer())
            .patch(`/cast-members/${castMemberCreated.cast_member_id.id}`)
            .send(send_data)
            .expect(200);

          const keyInResponse = UpdateCastMemberFixture.keyInResponse;
          expect(Object.keys(response.body)).toStrictEqual(['data']);
          expect(Object.keys(response.body.data)).toStrictEqual(keyInResponse);
          const id = response.body.data.id;
          const castMemberUpdated = await castMemberRepo.findById(new Uuid(id));
          const presenter = CastMembersController.serialize(
            CastMemberOutputMapper.toOutput(castMemberUpdated!),
          );
          const serialized = instanceToPlain(presenter);

          expect(response.body.data).toStrictEqual(serialized);
          expect(response.body.data).toStrictEqual({
            id: serialized.id,
            created_at: serialized.created_at,
            ...expected,
          });
        },
      );
    });
  });
});
