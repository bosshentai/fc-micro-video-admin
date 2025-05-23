import { INestApplication } from '@nestjs/common/interfaces';
import { getConnectionToken } from '@nestjs/sequelize/dist/common';
import { Test } from '@nestjs/testing/test';
import { TestingModule } from '@nestjs/testing/testing-module';
import { Sequelize } from 'sequelize-typescript';
import { AppModule } from 'src/app.module';
import { applyGlobalConfig } from 'src/nest-modules/global-config';
import { UnitOfWorkSequelize } from '../../../core/shared/infra/db/sequelize/unit-of-work-sequelize';

export function startApp() {
  let _app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('UnitOfWork')
      .useFactory({
        factory: (sequelize: Sequelize) => {
          return new UnitOfWorkSequelize(sequelize);
        },
        inject: [getConnectionToken()],
      })
      .compile();

    const sequelize = moduleFixture.get<Sequelize>(getConnectionToken());

    await sequelize.sync({ force: true });

    _app = moduleFixture.createNestApplication();
    applyGlobalConfig(_app);
    await _app.init();
  });

  afterEach(async () => {
    await _app?.close();
  });

  return {
    get app() {
      return _app;
    },
  };
}
