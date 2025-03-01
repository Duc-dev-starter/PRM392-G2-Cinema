import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { RegisterUserDto, UpdateUserDto } from './dto';
import { isEmptyObject } from '../utils';
import { CustomHttpException } from '../exceptions';
import * as bcrypt from 'bcrypt';
import { UserWithoutPassword } from './users.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }


  async create(payload: RegisterUserDto): Promise<UserWithoutPassword> {
    if (isEmptyObject(payload)) {
      throw new CustomHttpException(HttpStatus.NOT_FOUND, 'Model data is empty',);
    }

    const { name, email, password, phoneNumber, role } = payload;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new CustomHttpException(HttpStatus.CONFLICT, 'Email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo user mới
    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
    });

    console.log(newUser);
    await newUser.save();

    const { password: _password, ...userObj } = newUser.toObject();

    return userObj as UserWithoutPassword;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    if (!id) {
      throw new CustomHttpException(HttpStatus.BAD_REQUEST, 'User ID is required');
    }

    // Tìm user theo ID
    const user = await this.userModel.findById(id).select('-password');

    if (!user) {
      throw new CustomHttpException(HttpStatus.NOT_FOUND, 'User not exists');
    }

    return user;
  }

  async updateUser(id: string, updateData: UpdateUserDto): Promise<User> {
    if (!id) {
      throw new CustomHttpException(HttpStatus.BAD_REQUEST, 'User ID is required');
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    ).select('-password');

    if (!updatedUser) {
      throw new CustomHttpException(HttpStatus.NOT_FOUND, 'User not exists');
    }

    return updatedUser;
  }
}
