import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EventsService } from './events.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [EventsGateway, EventsService, JwtService],
  exports: [EventsGateway],
})
export class EventsModule {}
