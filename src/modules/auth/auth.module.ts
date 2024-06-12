import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/modules/user/user.module';
import { EventsModule } from 'src/common/websocket/events.module';
import { AuthModel } from './auth.model';
import { Auth, AuthSchema } from './auth.schema';

@Module({
  imports: [
    UserModule,
    EventsModule,
    MongooseModule.forFeature([
      {
        name: Auth.name,
        schema: AuthSchema,
      },
    ]),
    JwtModule.register({}),
  ],
  providers: [AuthService, AuthModel],
  controllers: [AuthController],
})
export class AuthModule {}
