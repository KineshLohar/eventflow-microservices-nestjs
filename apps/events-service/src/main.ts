import { NestFactory } from '@nestjs/core';
import { EventsServiceModule } from './events-service.module.js';
import { SERVICES_PORT } from '@app/common';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(EventsServiceModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  )

  await app.listen(SERVICES_PORT.EVENTS_SERVICE);
}
await bootstrap();
