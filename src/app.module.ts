import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import config from '../config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
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
