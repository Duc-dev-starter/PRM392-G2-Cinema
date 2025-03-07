import { Module } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { ShowtimesController } from './showtimes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Showtime, ShowtimeSchema } from './schemas';
import { Movie, MovieSchema } from '../movies/schemas';
import { Theater, TheaterSchema } from '../theaters/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Showtime.name, schema: ShowtimeSchema },
      { name: Movie.name, schema: MovieSchema }, // Đăng ký MovieModel
      { name: Theater.name, schema: TheaterSchema }
    ]),
  ],
  controllers: [ShowtimesController],
  providers: [ShowtimesService],
})
export class ShowtimesModule {}
