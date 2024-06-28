import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ProfileService } from './profile.service';
import { ProfileModel } from './profile.model';
import { ProfileController } from './profile.controller';
import { ProfileSchema, Profile } from './profile.schema';
import { HistorialModule } from '../historial/historial.module';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [
    HistorialModule,
    TaskModule,
    MongooseModule.forFeature([
      {
        name: Profile.name,
        schema: ProfileSchema,
      },
    ]),
  ],
  providers: [ProfileService, ProfileModel, JwtService],
  controllers: [ProfileController],
  exports: [ProfileService],
})
export class ProfileModule {}
