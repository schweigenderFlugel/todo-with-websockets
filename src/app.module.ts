import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';

import config from './config';
import { AuthModule } from './modules/auth/auth.module';
import { EventsModule } from './modules/room/room.module';
import { ProfileModule } from './modules/profile/profile.module';
import { HistorialModule } from './modules/historial/historial.module';
import { TaskModule } from './modules/task/task.module';
import { ItemModule } from './modules/item/item.module';
import { ApiKeyGuard } from './common/guards';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MetadataScanner } from '@nestjs/core';

@Module({
  imports: [
    EventsModule,
    UserModule,
    AuthModule,
    ProfileModule,
    HistorialModule,
    TaskModule,
    ItemModule,
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
  controllers: [AppController],
  providers: [
    AppService,
    MetadataScanner,
    {
      provide: 'APP_GUARD',
      useClass: ApiKeyGuard,
    },
  ],
})
export class AppModule {}
