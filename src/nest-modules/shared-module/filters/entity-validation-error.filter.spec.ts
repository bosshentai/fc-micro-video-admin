import { EntityValidationError } from '@core/shared/domain/validator/validation.error';
import { Controller, Get } from '@nestjs/common/decorators';
import { EntityValidationErrorFilter } from './entity-validation-error.filter';
import { INestApplication } from '@nestjs/common/interfaces';
import { TestingModule } from '@nestjs/testing/testing-module';
import { Test } from '@nestjs/testing/test';
import request from 'supertest';

@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new EntityValidationError([
      'another error',
      {
        field1: ['field1 is required'],
      },
      {
        field2: ['field2 is required'],
      },
    ]);
  }
}

describe('EntityValidationErrorFilter Unit Tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [StubController],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new EntityValidationErrorFilter());
    await app.init();
  });

  it('should catch a EntityValidationError', () => {
    return request(app.getHttpServer())
      .get('/stub')
      .expect(422)
      .expect({
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: ['another error', 'field1 is required', 'field2 is required'],
      });
  });
});
