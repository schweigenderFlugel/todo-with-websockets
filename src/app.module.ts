import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import config from '../config';
import { AuthModule } from './modules/auth/auth.module';
import { EventsModule } from './common/websocket/events.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProfileModule } from './modules/profile/profile.module';

@Module({
  imports: [
    EventsModule,
    UserModule,
    AuthModule,
    ProfileModule,
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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'public'),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
