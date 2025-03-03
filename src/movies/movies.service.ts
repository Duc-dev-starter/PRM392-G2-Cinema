import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { formatPaginationResult, isEmptyObject } from '../utils';
import { CustomHttpException } from '../exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Movie, MovieDocument } from './schemas/movie.schema';
import { Model } from 'mongoose';
import { SearchMovieDto, SearchWithPaginationDto } from './dto';
import { SearchPaginationResponseModel } from '../models';

@Injectable()
export class MoviesService {
  constructor(@InjectModel(Movie.name) private movieModel: Model<MovieDocument>) { }

  async create(payload: CreateMovieDto): Promise<Movie> {
    if (isEmptyObject(payload)) {
      throw new CustomHttpException(HttpStatus.BAD_REQUEST, 'Movie data is empty');
    }

    const { title } = payload;

    const existingMovie = await this.movieModel.findOne({ title }).exec();
    if (existingMovie) {
      throw new CustomHttpException(HttpStatus.CONFLICT, 'Movie already exists');
    }

    const newMovie = new this.movieModel(payload);
    return await newMovie.save();
  }
  async findAll(payload: SearchWithPaginationDto): Promise<SearchPaginationResponseModel<Movie>> {
    const searchCondition = {
      ...new SearchMovieDto(),
      ...payload.searchCondition,
    };

    console.log(searchCondition);
    const { actors, director, genres, keyword } = searchCondition;
    const { pageNum, pageSize } = payload.pageInfo;

    const query: any = {};

    if (keyword) {
      query.title = { $regex: keyword, $options: 'i' };
    }
    if (genres && genres.length > 0) {
      query.genres = { $in: genres };
    }
    if (director) {
      query.director = director;
    }
    if (actors && actors.length > 0) {
      query.actors = { $in: actors };
    }

    const total = await this.movieModel.countDocuments(query);

    const items = await this.movieModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .exec();

    const data = new SearchPaginationResponseModel<Movie>();
    const result = formatPaginationResult<Movie>(data, items, {
      pageNum,
      pageSize,
      totalItems: total,
      totalPages: Math.ceil(total / pageSize),
    });

    return result;
  }


  async findOne(id: string): Promise<Movie | null> {
    return await this.movieModel.findById(id).exec();
  }

  update(id: number, updateMovieDto: UpdateMovieDto) {
    return `This action updates a #${id} movie`;
  }

  remove(id: number) {
    return `This action removes a #${id} movie`;
  }
}
