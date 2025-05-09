import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { applyGlobalConfig } from 'src/nest-modules/global-config';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  await app.init();
}

bootstrap();
