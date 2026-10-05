import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { EventsModule } from './events/events.module.js';
import { JwtStrategy } from './jwt.strategy.js';
import { TicketsModule } from './tickets/tickets.module.js';

@Module({
  imports: [
    AuthModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'kinesh'
    }),
    EventsModule,
    TicketsModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule { }
