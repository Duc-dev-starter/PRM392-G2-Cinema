import { HttpStatus, Injectable } from '@nestjs/common';
import { isEmptyObject } from '../utils';
import { CustomHttpException } from '../exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Theater, TheaterDocument } from './schemas';
import { CreateTheaterDto } from './dto';
import { SearchTheaterDto } from './dto/search-theater.dto';
import { PaginationResponseModel, SearchPaginationResponseModel } from 'src/models';

@Injectable()
export class TheatersService {
  constructor(@InjectModel(Theater.name) private theaterModel: Model<TheaterDocument>) { }

  async create(payload: CreateTheaterDto): Promise<Theater> {
    if (isEmptyObject(payload)) {
      throw new CustomHttpException(HttpStatus.BAD_REQUEST, 'Theater data is empty');
    }

    const { name } = payload;

    const existingTheater = await this.theaterModel.findOne({ name }).exec();
    if (existingTheater) {
      throw new CustomHttpException(HttpStatus.CONFLICT, 'Theater already exists');
    }

    const newTheather = new this.theaterModel(payload);
    return await newTheather.save();
  }

  async findAll(params: SearchTheaterDto) {
    const { name, address, district, pageNum, pageSize } = params;
    console.log(params);
    const query: any = {};
    if (name) query.name = new RegExp(name, 'i');
    if (address) query.address = new RegExp(address, 'i');
    if (district) query.district = district;
  
    const totalItems = await this.theaterModel.countDocuments(query);
    const items = await this.theaterModel
        .find(query)
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)
        .exec();
  
    const paginationInfo = new PaginationResponseModel(pageNum, pageSize, totalItems, Math.ceil(totalItems / pageSize));
    return new SearchPaginationResponseModel(items, paginationInfo);
}

  


  async findOne(id: string): Promise<Theater | null> {
    return await this.theaterModel.findById(id).exec();
  }

}
