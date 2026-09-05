import { KAFKA_TOPICS } from '@app/kafka/index.js';
import { KAFKA_SERVICE } from '@app/kafka/kafka.module.js';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AuthServiceService implements OnModuleInit {
  constructor(
    @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka
  ) { }


  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  getHello(): string {
    return 'Hello World!';
  }

  async simulateUserRegistration(email: string) {
    this.kafkaClient.emit(KAFKA_TOPICS.USER_REGISTERED, {
      email,
      timestamp: new Date().toISOString()
    })

    return { message: `User Registered ${email}` };
  }
}
