import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HistorialService } from './historial.service';
import { HistorialModel } from './historial.model';
import { Historial, HistorialSchema } from './historial.schema';
import { UserModule } from '../user/user.module';
import { HistorialController } from './historial.controller';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      {
        name: Historial.name,
        schema: HistorialSchema,
      },
    ]),
  ],
  providers: [HistorialService, HistorialModel],
  controllers: [HistorialController],
  exports: [HistorialService],
})
export class HistorialModule {}
