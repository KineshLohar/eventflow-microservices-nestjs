import { NestFactory } from '@nestjs/core';
import { NotificationsServiceModule } from './notifications-service.module.js';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { KAFKA_BROKER, KAFKA_CLIENT_ID } from '@app/kafka';
import { SERVICES_PORT } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsServiceModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: { 
      client: {
        clientId: `${KAFKA_CLIENT_ID}-notifications`,
        brokers: [KAFKA_BROKER]
      },
      consumer: {
        groupId: `notifications-consumer-group`
      }
    }
  })

  await app.startAllMicroservices();

  await app.listen(SERVICES_PORT.NOTIFICATIONS_SERVICE);
}
await bootstrap();
