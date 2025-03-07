import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from './schemas/movie.schema';
import { TheatersModule } from '../theaters/theaters.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]), TheatersModule],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule { }
