import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ProfileService } from './profile.service';
import { ProfileModel } from './profile.model';
import { ProfileController } from './profile.controller';
import { ProfiileSchema, Profile } from './profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Profile.name,
        schema: ProfiileSchema,
      },
    ]),
  ],
  providers: [ProfileService, ProfileModel, JwtService],
  controllers: [ProfileController],
})
export class ProfileModule {}
