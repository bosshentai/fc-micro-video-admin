import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor } from '@nestjs/common/serializer';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes';
import { WrapperDataInterceptor } from './nest-modules/shared-module/interceptors/wrapper-data/wrapper-data.interceptor';
import { NotFoundErrorFilter } from './nest-modules/shared-module/filters/not-found-error.filter';
import { EntityValidationErrorFilter } from './nest-modules/shared-module/filters/entity-validation-error.filter';
import { applyGlobalConfig } from './nest-modules/global-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  applyGlobalConfig(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
