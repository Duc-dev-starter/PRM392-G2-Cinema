import { HttpStatus, Injectable } from '@nestjs/common';
import {  isEmptyObject } from '../utils';
import { CustomHttpException } from '../exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Movie, MovieDocument } from './schemas/movie.schema';
import { Model } from 'mongoose';
import { CreateMovieDto, SearchMovieDto } from './dto';
import { PaginationResponseModel, SearchPaginationResponseModel } from '../models';
import { UpdateMovieDto } from './dto/update-movie.dto';

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

  async findAll(params: SearchMovieDto) {
    const { genres, rated, rating, status, title,pageNum, pageSize } = params;
    console.log(params);
    
    const query: any = {};

    if (title) query.title = new RegExp(title, 'i'); 
    if (rated) query.rated = rated; 
    if (status) query.status = status; 
    if (rating) query.rating = { $gte: rating }; 
    if (genres && genres.length > 0) query.genres = { $in: genres }; 

    const totalItems = await this.movieModel.countDocuments(query);
    const items = await this.movieModel
        .find(query)
        .skip((pageNum - 1) * pageSize)
        .select('-createdAt -updatedAt -__v') 
        .limit(pageSize)
        .lean()
        .exec();
    const paginationInfo = new PaginationResponseModel(
        pageNum, 
        pageSize, 
        totalItems, 
        Math.ceil(totalItems / pageSize)
    );

    return new SearchPaginationResponseModel(items, paginationInfo);
}


  async findOne(id: string): Promise<Movie | null> {
    const item = await this.movieModel
    .findById(id)
    .select('-createdAt -updatedAt -__v')
    .exec();

    if(!item){
      throw new CustomHttpException(HttpStatus.NOT_FOUND, 'Movie not found');
    }
    return item;
  }

  update(id: number, updateMovieDto: UpdateMovieDto) {
    return `This action updates a #${id} movie`;
  }

}
