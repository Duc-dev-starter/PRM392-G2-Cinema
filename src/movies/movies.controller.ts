import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomHttpException } from 'src/exceptions';
import { formatResponse } from '../utils';
import { Movie } from './schemas/movie.schema';
import { API, COLLECTION_NAME } from '../constants';
import { AuthGuard } from '@nestjs/passport';

@ApiTags(COLLECTION_NAME.MOVIE)
@Controller(API.MOVIES)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create movie' })
  @ApiBody({ type: CreateMovieDto })
  async create(@Body() payload: CreateMovieDto) {
    if (!payload) {
      throw new CustomHttpException(HttpStatus.NOT_FOUND, 'You need to send data');
    }
    const item = await this.moviesService.create(payload);

    return formatResponse<Movie>(item);
  }

  @Get()
  findAll() {
    return this.moviesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(+id, updateMovieDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moviesService.remove(+id);
  }
}
