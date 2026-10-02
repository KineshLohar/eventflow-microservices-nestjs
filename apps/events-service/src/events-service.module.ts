import { DatabaseModule } from '@app/database';
import { KafkaModule } from '@app/kafka';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { EventsServiceController } from './events-service.controller.js';
import { EventsServiceService } from './events-service.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // This allows libs/database to read variables safely
      envFilePath: join(process.cwd(), '.env'),
    }),
    KafkaModule.register('events-service-group'),
    DatabaseModule
  ],
  controllers: [EventsServiceController],
  providers: [EventsServiceService],
})
export class EventsServiceModule { }
