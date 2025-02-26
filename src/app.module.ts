import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { TheatersModule } from './theaters/theaters.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    UsersModule,
    MoviesModule,
    TheatersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     type: 'mysql',
    //     host: configService.get('DB_HOST'),
    //     port: +configService.get('DB_PORT'),
    //     username: configService.get('DB_USER'),
    //     password: configService.get('DB_PASSWORD'),
    //     database: configService.get('DB_NAME'),
    //     autoLoadEntities: true,
    //     synchronize: true,
    //   }),
    //   inject: [ConfigService],
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
