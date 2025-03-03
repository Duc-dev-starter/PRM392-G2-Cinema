import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, HttpCode } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { formatResponse, validateInput } from '../utils';
import { Movie } from './schemas/movie.schema';
import { API, COLLECTION_NAME } from '../constants';
import { Public } from '../decorators/public.decorator';
import { SearchMovieDto, SearchWithPaginationDto } from './dto';
import { SearchPaginationResponseModel } from '../models';

@ApiTags(COLLECTION_NAME.MOVIE)
@Controller(API.MOVIES)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create movie' })
  @ApiBody({ type: CreateMovieDto })
  async create(@Body() payload: CreateMovieDto) {
    validateInput(payload);
    const item = await this.moviesService.create(payload);
    return formatResponse<Movie>(item);
  }

  @Public()
  @ApiBody({ type: SearchMovieDto })
  @HttpCode(HttpStatus.OK)
  @Post('search')
  async findAll(@Body() model: SearchWithPaginationDto) {
    validateInput(model);
    const result: SearchPaginationResponseModel<Movie> =
      await this.moviesService.findAll(model);
    return formatResponse<SearchPaginationResponseModel<Movie>>(result);
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
