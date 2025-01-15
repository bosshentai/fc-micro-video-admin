import { Test } from '@nestjs/testing/test';
import { TestingModule } from '@nestjs/testing/testing-module';
import { CategoriesController } from './categories.controller';
import { DatabaseModule } from 'src/database/database.module';
import { CategoriesModule } from './categories.module';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from '@nestjs/config';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    // console.dir(module.get(ConfigService));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
