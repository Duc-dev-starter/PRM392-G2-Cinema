import { Controller, Get, Post, Body, Param, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto';
import { CustomHttpException } from '../exceptions';
import { formatResponse } from 'src/utils';
import { UserWithoutPassword } from './users.interface';


@ApiTags('Users')
@Controller('api/users')
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
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
}
