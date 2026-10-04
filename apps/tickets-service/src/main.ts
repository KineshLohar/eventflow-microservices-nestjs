import { NestFactory } from '@nestjs/core';
import { TicketsServiceModule } from './tickets-service.module.js';
import { SERVICES_PORT } from '@app/common';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(TicketsServiceModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  )

  await app.listen(SERVICES_PORT.TICKETS_SERVICE);
}
await bootstrap();
