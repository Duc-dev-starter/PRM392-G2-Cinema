import { Module } from '@nestjs/common';
import { ScreensService } from './screens.service';
import { ScreensController } from './screens.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Theater, TheaterSchema } from '../theaters/schemas';
import { Screen, ScreenSchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Screen.name, schema: ScreenSchema },
      { name: Theater.name, schema: TheaterSchema }
    ]),
  ],
  controllers: [ScreensController],
  providers: [ScreensService],
  exports: [MongooseModule]
})
export class ScreensModule { }
