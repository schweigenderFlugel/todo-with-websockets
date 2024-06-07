import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import config from '../config';
import { AuthModule } from './modules/auth/auth.module';
import { GatewayModule } from './common/websocket/websocket.module';

@Module({
  imports: [
    GatewayModule,
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    MongooseModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          uri: configService.mongodbUri,
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
