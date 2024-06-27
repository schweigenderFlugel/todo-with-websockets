import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { HistorialService } from './historial.service';
import { HistorialModel } from './historial.model';
import { Historial, HistorialSchema } from './historial.schema';
import { HistorialController } from './historial.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Historial.name,
        schema: HistorialSchema,
      },
    ]),
  ],
  providers: [HistorialService, HistorialModel, JwtService],
  controllers: [HistorialController],
  exports: [HistorialService],
})
export class HistorialModule {}
