import { Module } from '@nestjs/common';
import { AuthServiceController } from './auth-service.controller.js';
import { AuthServiceService } from './auth-service.service.js';
import { KafkaModule } from '@app/kafka';
import { DatabaseModule } from '@app/database';
import { CommonModule } from '@app/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from './jwt.strategy.js';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // This allows libs/database to read variables safely
      envFilePath: join(process.cwd(), '.env'),
    }),
    KafkaModule.register('auth-service-group'),
    DatabaseModule,
    PassportModule,
    CommonModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'kinesh',
      signOptions: {
        expiresIn: "1d"
      }
    })

  ],
  controllers: [AuthServiceController],
  providers: [AuthServiceService, JwtStrategy],
})
export class AuthServiceModule { }
