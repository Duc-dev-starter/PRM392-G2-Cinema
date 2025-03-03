import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { formatResponse, validateInput } from '../utils';
import { Movie } from './schemas/movie.schema';
import { API, COLLECTION_NAME } from '../constants';
import { Public } from '../decorators/public.decorator';
import { CreateMovieDto, SearchWithPaginationDto } from './dto';
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
  @ApiBody({ type: SearchWithPaginationDto })
  @ApiOperation({ summary: 'Search movies with condition' })
  @HttpCode(HttpStatus.OK)
  @Post('search')
  async findAll(@Body() model: SearchWithPaginationDto) {
    validateInput(model);
    const result: SearchPaginationResponseModel<Movie> =
      await this.moviesService.findAll(model);
    return formatResponse<SearchPaginationResponseModel<Movie>>(result);
  }

  @Public()
  @ApiOperation({ summary: 'Search movie' })
  @ApiParam({ name: 'id', type: String, description: 'Movie ID', example: '67c55f33bb935ad781b1a309' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.moviesService.findOne(id);
    return formatResponse(result);
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
