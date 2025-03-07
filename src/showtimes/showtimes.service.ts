import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { Showtime, ShowtimeDocument } from './schemas';
import { isEmptyObject } from '../utils';
import { CustomHttpException } from '../exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from '../movies/schemas';
import { Theater, TheaterDocument } from '../theaters/schemas';

@Injectable()
export class ShowtimesService {
  constructor(@InjectModel(Showtime.name) private showtimeModel: Model<ShowtimeDocument>,
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    @InjectModel(Theater.name) private theaterModel: Model<TheaterDocument>,
  ) { }

  async create(payload: CreateShowtimeDto): Promise<Showtime> {
    if (isEmptyObject(payload)) {
      throw new CustomHttpException(HttpStatus.BAD_REQUEST, 'Showtime data is empty');
    }

    const { movieId, theaterId, startTime, showingDate } = payload;

    // Chuyển đổi startTime thành kiểu Date
    const parsedStartTime = new Date(startTime);
    if (isNaN(parsedStartTime.getTime())) {
      throw new CustomHttpException(HttpStatus.BAD_REQUEST, 'Invalid startTime format');
    }

    // Lấy thông tin phim để tính endTime
    const movie = await this.movieModel.findById(movieId).exec();
    if (!movie) {
      throw new CustomHttpException(HttpStatus.NOT_FOUND, 'Movie not found');
    }

    const theater = await this.theaterModel.findById(theaterId).exec();
    if (!theater) {
      throw new CustomHttpException(HttpStatus.NOT_FOUND, 'Theater not found');
    }

    if (!movie.duration || movie.duration <= 0) {
      throw new CustomHttpException(HttpStatus.BAD_REQUEST, 'Invalid movie duration');
    }

    // Tính toán endTime
    const endTime = new Date(parsedStartTime.getTime() + movie.duration * 60000);

    // Tạo suất chiếu mới
    const newShowtime = new this.showtimeModel({
      movieId,
      theaterId,
      showingDate,
      startTime: parsedStartTime,
      endTime
    });

    return await newShowtime.save();
  }



  findAll() {
    return `This action returns all showtimes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} showtime`;
  }

  update(id: number, updateShowtimeDto: UpdateShowtimeDto) {
    return `This action updates a #${id} showtime`;
  }

  remove(id: number) {
    return `This action removes a #${id} showtime`;
  }
}
