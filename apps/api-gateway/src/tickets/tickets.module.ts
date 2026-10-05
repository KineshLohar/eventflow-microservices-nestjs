import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller.js';
import { TicketsService } from './tickets.service.js';

@Module({
    imports: [HttpModule],
    controllers: [TicketsController],
    providers: [TicketsService]
})
export class TicketsModule {}
