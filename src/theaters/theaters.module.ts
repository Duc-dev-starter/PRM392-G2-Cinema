import { Module } from '@nestjs/common';
import { TheatersService } from './theaters.service';
import { TheatersController } from './theaters.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Theater, TheaterSchema } from './schemas';
@Module({
  imports: [MongooseModule.forFeature([{ name: Theater.name, schema: TheaterSchema }])],
    controllers: [TheatersController],
    providers: [TheatersService],
})
export class TheatersModule {}
