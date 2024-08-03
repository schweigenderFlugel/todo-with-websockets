import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import config from './config';
import { AuthModule } from './modules/auth/auth.module';
import { EventsModule } from './modules/room/room.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProfileModule } from './modules/profile/profile.module';
import { HistorialModule } from './modules/historial/historial.module';
import { TaskModule } from './modules/task/task.module';
import { ItemModule } from './modules/item/item.module';

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'public'),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
