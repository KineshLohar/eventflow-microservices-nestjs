import { Module } from '@nestjs/common';
import { TicketsServiceController } from './tickets-service.controller.js';
import { TicketsServiceService } from './tickets-service.service.js';
import { KafkaModule } from '@app/kafka';
import { DatabaseModule } from '@app/database';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // This allows libs/database to read variables safely
      envFilePath: join(process.cwd(), '.env'),
    }),
    KafkaModule.register('tickets-service-group'), DatabaseModule],
  controllers: [TicketsServiceController],
  providers: [TicketsServiceService],
})
export class TicketsServiceModule { }
