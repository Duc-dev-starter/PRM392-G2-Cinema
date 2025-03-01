import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { RegisterUserDto } from './dto';
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

  findOne(id: number) {
    return `This action returns a #${id} movie`;
  }
}
