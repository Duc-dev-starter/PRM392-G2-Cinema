import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Theater, TheaterDocument } from '../theaters/schemas';
import { CustomHttpException } from '../exceptions';
import { Screen, ScreenDocument } from './schemas';
import { CreateScreenDto, SearchScreensDto } from './dto';
import { PaginationResponseModel, SearchPaginationResponseModel } from '../models';
import { UpdateScreenDto } from './dto/update-screen.dto';

@Injectable()
export class ScreensService {
  constructor(@InjectModel(Screen.name) private screenModel: Model<ScreenDocument>,
    @InjectModel(Theater.name) private theaterModel: Model<TheaterDocument>,
  ) { }
  async create(payload: CreateScreenDto) {
    const { capacity, name, theaterId } = payload;
    const theater = await this.theaterModel.findById(theaterId).exec();
    if (!theater) {
      throw new CustomHttpException(HttpStatus.NOT_FOUND, 'Theater not found')
    }
    const existingScreen = await this.screenModel.findOne({ name }).exec();
    if (existingScreen) {
      throw new CustomHttpException(HttpStatus.CONFLICT, 'Screen already exists')
    }
    const newScreen = new this.screenModel({ name, capacity, theaterId: new Types.ObjectId(theaterId) });
    console.log('Converted ObjectId:', new Types.ObjectId(theaterId));
    console.log('Created Screen:', newScreen);
    return await newScreen.save();
  }

  async findAll(params: SearchScreensDto) {
    const { theaterId, pageNum, pageSize } = params;
    console.log(params);

    const query: any = {};

    // Kiểm tra nếu theaterId tồn tại và convert sang ObjectId
    if (theaterId) {
      query.theaterId = new Types.ObjectId(theaterId);
    }

    const totalItems = await this.screenModel.countDocuments(query);
    const items = await this.screenModel
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

  findOne(id: number) {
    return `This action returns a #${id} screen`;
  }

  update(id: number, updateScreenDto: UpdateScreenDto) {
    return `This action updates a #${id} screen`;
  }

  remove(id: number) {
    return `This action removes a #${id} screen`;
  }
}
