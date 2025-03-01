import { Controller, Get, Post, Body, Param, HttpStatus, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { RegisterUserDto, UpdateUserDto } from './dto';
import { CustomHttpException } from '../exceptions';
import { formatResponse } from '../utils';
import { UserWithoutPassword } from './users.interface';
import { User } from './schemas/users.schema';
import { API, COLLECTION_NAME } from '../constants';


@ApiTags(COLLECTION_NAME.USER)
@Controller(API.USERS)
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Post()
  @ApiOperation({ summary: 'Register User' })
  @ApiBody({ type: RegisterUserDto })
  async create(@Body() payload: RegisterUserDto) {
    if (!payload) {
      throw new CustomHttpException(HttpStatus.NOT_FOUND, 'You need to send data');
    }
    const item = await this.userService.create(payload);

    return formatResponse<UserWithoutPassword>(item);
  }

  @Get()
  @ApiOperation({ summary: 'Get users' })
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user' })
  async findOne(@Param('id') id: string) {
    const item = await this.userService.findOne(id);
    return formatResponse<User>(item);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  async updateUser(@Param('id') id: string, @Body() payload: UpdateUserDto) {
    const item = await this.userService.updateUser(id, payload);
    return formatResponse<User>(item);
  }
}
