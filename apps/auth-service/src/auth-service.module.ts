import { Module } from '@nestjs/common';
import { AuthServiceController } from './auth-service.controller.js';
import { AuthServiceService } from './auth-service.service.js';
import { KafkaModule } from '../../../libs/kafka/src/index.js'

@Module({
  imports: [KafkaModule.register('auth-service-group')],
  controllers: [AuthServiceController],
  providers: [AuthServiceService],
})
export class AuthServiceModule { }
