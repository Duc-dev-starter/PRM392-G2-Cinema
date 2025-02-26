import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async createUser(name: string, email: string, password: string): Promise<User> {
    const user = new this.userModel({ name, email, password });
    return user.save();
  }

  async getUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
