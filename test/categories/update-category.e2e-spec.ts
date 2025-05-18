import request from 'supertest';
import { startApp } from 'src/nest-modules/shared-module/testing/helpers';
import { UpdateCategoryFixture } from 'src/nest-modules/categories-module/testing/category-fixture';
import { ICategoryRepository } from '@core/category/domain/category.repository';
import { CATEGORY_PROVIDERS } from 'src/nest-modules/categories-module/categories.providers';
import { CategoriesController } from 'src/nest-modules/categories-module/categories.controller';
import { Uuid } from '@core/shared/domain/value-objects/uuid.vo';
import { instanceToPlain } from 'class-transformer';
import { CategoryOutputMapper } from '@core/category/application/use-cases/common/category-output';
import { Category } from '@core/category/domain/category.aggregate';

describe('CAtegoriesController (e2e)', () => {
  const uuid = '98b1c5e6-3c4d-4a7b-8e9f-0e1d2f3c4d5e';

  describe('/categories/:id (PATCH)', () => {
    describe('should a response error when id is invalid or not found', () => {
      const nestApp = startApp();
      const faker = Category.fake().aCategory();

      const arrange = [
        {
          id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          send_data: { name: faker.name },
          expected: {
            message:
              'Category Not Found using Id 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
            statusCode: 404,
            error: 'Not Found',
          },
        },
        {
          id: 'fake id',
          send_data: { name: faker.name },
          expected: {
            message: 'Validation failed (uuid is expected)',
            statusCode: 422,
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)(
        'when id is $id',
        async ({ id, send_data, expected }) => {
          return request(nestApp.app.getHttpServer())
            .patch(`/categories/${id}`)
            .authenticate(nestApp.app)
            .send(send_data)
            .expect(expected.statusCode)
            .expect(expected);
        },
      );
    });

    describe('should a response error with  422 when request body is invalid', () => {
      const appHelper = startApp();
      const invalidRequest = UpdateCategoryFixture.arrangeInvalidRequest();

      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each(arrange)('when body is $label', ({ value }) => {
        return request(appHelper.app.getHttpServer())
          .patch(`/categories/${uuid}`)
          .authenticate(appHelper.app)
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should a response error with 422 when throw EntityValidationError', () => {
      const appHelper = startApp();
      const validationError =
        UpdateCategoryFixture.arrangeForEntityValidationError();
      const arrange = Object.keys(validationError).map((key) => ({
        label: key,
        value: validationError[key],
      }));
      let categoryRepo: ICategoryRepository;

      beforeEach(() => {
        categoryRepo = appHelper.app.get<ICategoryRepository>(
          CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );
      });
      test.each(arrange)('when body is $label', async ({ value }) => {
        const category = Category.fake().aCategory().build();
        await categoryRepo.insert(category);

        return request(appHelper.app.getHttpServer())
          .patch(`/categories/${category.category_id.id}`)
          .authenticate(appHelper.app)
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should update a category', () => {
      const appHelper = startApp();
      const arrange = UpdateCategoryFixture.arrangeForUpdate();
      let categoryRepo: ICategoryRepository;
      beforeEach(async () => {
        categoryRepo = appHelper.app.get<ICategoryRepository>(
          CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );
      });

      test.each(arrange)(
        'when body is $send_data',
        async ({ send_data, expected }) => {
          const categoryCreated = Category.fake().aCategory().build();
          await categoryRepo.insert(categoryCreated);

          const res = await request(appHelper.app.getHttpServer())
            .patch(`/categories/${categoryCreated.category_id.id}`)
            .authenticate(appHelper.app)
            .send(send_data)
            .expect(200);
          const keyInResponse = UpdateCategoryFixture.keysInResponse;
          expect(Object.keys(res.body)).toStrictEqual(['data']);
          expect(Object.keys(res.body.data)).toStrictEqual(keyInResponse);
          const id = res.body.data.id;
          const categoryUpdated = await categoryRepo.findById(new Uuid(id));
          const presenter = CategoriesController.serialize(
            CategoryOutputMapper.toOutput(categoryUpdated!),
          );
          const serialized = instanceToPlain(presenter);
          expect(res.body.data).toStrictEqual(serialized);
          expect(res.body.data).toStrictEqual({
            id: serialized.id,
            created_at: serialized.created_at,
            name: expected.name ?? categoryUpdated!.name,
            description:
              'description' in expected
                ? expected.description
                : categoryUpdated!.description,
            is_active: expected.is_active ?? categoryUpdated!.is_active,
          });
        },
      );
    });
  });
});
