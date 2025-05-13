import { Test } from '@nestjs/testing/test';
import { TestingModule } from '@nestjs/testing/testing-module';
import { ConfigModule } from 'src/nest-modules/config-module/config.module';
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { getModelToken } from '@nestjs/sequelize/dist';
import { CategoryInMemoryRepository } from '@core/category/infra/db/in-memory/category-in-memory.repository';
import { CategoriesController } from '../categories.controller';
import { CategoriesModule } from '../categories.module';
import { AuthModule } from 'src/nest-modules/auth-module/auth.module';
import { DatabaseModule } from 'src/nest-modules/database-module/database.module';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({}),
        DatabaseModule,
        AuthModule,
        CategoriesModule,
      ],
    })
      .overrideProvider(getModelToken(CategoryModel))
      .useValue({})
      .overrideProvider('CategoryRepository')
      .useValue(CategoryInMemoryRepository)
      .compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
