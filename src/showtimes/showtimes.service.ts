import { HttpStatus, Injectable } from '@nestjs/common';
import { Showtime, ShowtimeDocument } from './schemas';
import { isEmptyObject } from '../utils';
import { CustomHttpException } from '../exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Movie, MovieDocument } from '../movies/schemas';
import { Theater, TheaterDocument } from '../theaters/schemas';
import { PaginationResponseModel, SearchPaginationResponseModel } from '../models';
import { SearchShowtimeDto } from './dto/search-showtime.dto';
import { CreateShowtimeDto, UpdateShowtimeDto } from './dto';

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

    const parsedStartTime = new Date(startTime);
    const parsedShowingDate = new Date(showingDate);
    if (isNaN(parsedStartTime.getTime()) || isNaN(parsedShowingDate.getTime())) {
      throw new CustomHttpException(HttpStatus.BAD_REQUEST, 'Invalid date or time format');
    }

    // Kiểm tra movie và theater có tồn tại không
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

    const endTime = new Date(parsedStartTime.getTime() + movie.duration * 60000);

    // Kiểm tra trùng lịch
    const overlappingShowtime = await this.showtimeModel.findOne({
      theaterId: new Types.ObjectId(theaterId),
      showingDate: parsedShowingDate,
      $or: [
        { startTime: { $lt: endTime, $gte: parsedStartTime } },
        { endTime: { $gt: parsedStartTime, $lte: endTime } },
        { startTime: { $lte: parsedStartTime }, endTime: { $gte: endTime } },
      ],
    }).exec();

    if (overlappingShowtime) {
      throw new CustomHttpException(HttpStatus.CONFLICT, 'Showtime overlaps with an existing schedule');
    }

    // Tạo suất chiếu với movieId và theaterId dạng ObjectId
    const newShowtime = new this.showtimeModel({
      movieId: new Types.ObjectId(movieId),
      theaterId: new Types.ObjectId(theaterId),
      showingDate: parsedShowingDate,
      startTime: parsedStartTime,
      endTime,
    });

    return await newShowtime.save();
  }


  async findShowtimesByMovieAndDate(params: SearchShowtimeDto) {
    const { movieId, date, pageNum = 1, pageSize = 10 } = params;

    // Chuyển date sang kiểu Date (MongoDB lưu Date nên so sánh phải cùng kiểu)
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new CustomHttpException(HttpStatus.BAD_REQUEST, 'Invalid date format');
    }

    // Tính tổng số suất chiếu
    const totalItems = await this.showtimeModel.countDocuments({
      movieId: new Types.ObjectId(movieId),
      showingDate: parsedDate,
    });

    // Aggregation để nhóm theo theaterId và lấy thông tin rạp với phân trang
    const result = await this.showtimeModel.aggregate([
      {
        $match: {
          movieId: new Types.ObjectId(movieId),
          showingDate: parsedDate, // So sánh trực tiếp với kiểu Date
        },
      },
      {
        $group: {
          _id: '$theaterId',
          showtimes: {
            $push: {
              _id: '$_id',
              startTime: '$startTime',
              endTime: '$endTime',
            },
          },
        },
      },
      {
        $lookup: {
          from: 'theaters',
          localField: '_id',
          foreignField: '_id',
          as: 'theater',
        },
      },
      {
        $unwind: '$theater',
      },
      {
        $project: {
          _id: 0,
          theater: {
            id: '$theater._id',
            name: '$theater.name',
            address: '$theater.address',
          },
          showtimes: 1,
        },
      },
      { $skip: (pageNum - 1) * pageSize }, // Bỏ qua các bản ghi trước trang hiện tại
      { $limit: pageSize }, // Giới hạn số bản ghi trả về
    ]).exec();

    // Tính tổng số trang
    const totalPages = Math.ceil(totalItems / pageSize);

    // Tạo đối tượng phân trang
    const paginationInfo = new PaginationResponseModel(pageNum, pageSize, totalItems, totalPages);

    // Trả về đối tượng SearchPaginationResponseModel
    return new SearchPaginationResponseModel(result, paginationInfo);
  }


  async findOne(id: string) {
    const showtime = await this.showtimeModel.findById(id);

    if (!showtime) {
      throw new CustomHttpException(HttpStatus.NOT_FOUND, 'Showtime not found');
    }

    return showtime;
  }


  update(id: number, updateShowtimeDto: UpdateShowtimeDto) {
    return `This action updates a #${id} showtime`;
  }

}
