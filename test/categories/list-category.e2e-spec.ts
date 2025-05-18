import { CategoryOutputMapper } from '@core/category/application/use-cases/common/category-output';
import { ICategoryRepository } from '@core/category/domain/category.repository';
import { instanceToPlain } from 'class-transformer';
import { CategoriesController } from 'src/nest-modules/categories-module/categories.controller';
import { CATEGORY_PROVIDERS } from 'src/nest-modules/categories-module/categories.providers';
import { ListCategoriesFixture } from 'src/nest-modules/categories-module/testing/category-fixture';
import { startApp } from 'src/nest-modules/shared-module/testing/helpers';
import request from 'supertest';

describe('CategoriesController (e2e)', () => {
  describe('/categories (GET)', () => {
    describe('should return a categories sorted by created_at when request query is empty', () => {
      let categoryRepo: ICategoryRepository;
      const nestApp = startApp();

      const { entitiesMap, arrange } =
        ListCategoriesFixture.arrangeIncrementedWithCreatedAt();

      beforeEach(async () => {
        categoryRepo = nestApp.app.get<ICategoryRepository>(
          CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );

        await categoryRepo.bulkInsert(Object.values(entitiesMap));
      });

      test.each(arrange)(
        'when params is $send_data',
        async ({ send_data, expected }) => {
          const queryParams = new URLSearchParams(
            Object.entries(send_data).map(([key, value]) => [
              key,
              value.toString(),
            ]),
          ).toString();

          return request(nestApp.app.getHttpServer())
            .get(`/categories/?${queryParams}`)
            .authenticate(nestApp.app)
            .expect(200)
            .expect({
              data: expected.entities.map((e) =>
                instanceToPlain(
                  CategoriesController.serialize(
                    CategoryOutputMapper.toOutput(e),
                  ),
                ),
              ),
              meta: expected.meta,
            });
        },
      );
    });

    describe('should return categories using paginate, filter and sort', () => {
      let categoryRepo: ICategoryRepository;
      const nestApp = startApp();
      const { entitiesMap, arrange } = ListCategoriesFixture.arrangeUnsorted();

      beforeEach(async () => {
        categoryRepo = nestApp.app.get<ICategoryRepository>(
          CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
        );
        await categoryRepo.bulkInsert(Object.values(entitiesMap));
      });

      test.each([arrange])(
        'when query params is $send_data',
        async ({ send_data, expected }) => {
          const queryParams = new URLSearchParams(
            Object.entries(send_data).map(([key, value]) => [
              key,
              value.toString(),
            ]),
          ).toString();

          return request(nestApp.app.getHttpServer())
            .get(`/categories/?${queryParams}`)
            .authenticate(nestApp.app)
            .expect(200)
            .expect({
              data: expected.entities.map((e) =>
                instanceToPlain(
                  CategoriesController.serialize(
                    CategoryOutputMapper.toOutput(e),
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
