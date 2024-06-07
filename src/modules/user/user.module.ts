import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserModel } from './user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [UserService, UserModel],
  exports: [UserService],
})
export class UserModule {}
