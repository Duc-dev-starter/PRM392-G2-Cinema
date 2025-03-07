import { Controller, Get, Post, Body, Patch, Param, HttpStatus, HttpCode, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { formatResponse, validateInput } from '../utils';
import { Movie } from './schemas/movie.schema';
import { API, COLLECTION_NAME } from '../constants';
import { Public } from '../decorators/public.decorator';
import { CreateMovieDto, SearchMovieDto } from './dto';

@ApiTags(COLLECTION_NAME.MOVIE)
@Controller(API.MOVIES)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) { }

  @Post()
  // @ApiBearerAuth()
  @Public()
  @ApiOperation({ summary: 'Create movie' })
  @ApiBody({ type: CreateMovieDto })
  async create(@Body() payload: CreateMovieDto) {
    validateInput(payload);
    const item = await this.moviesService.create(payload);
    return formatResponse<Movie>(item);
  }

  @Public()
    @ApiOperation({ summary: 'Find theaters' })
    @Get()
  async findAll(@Query() queryParams: SearchMovieDto) {
      const result = await this.moviesService.findAll(queryParams);
      return formatResponse(result);
  }

  @Public()
  @ApiOperation({ summary: 'Search movie' })
  @ApiParam({ name: 'id', type: String, description: 'Movie ID', example: '67cab12d4a14be2b62d0e479' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.moviesService.findOne(id);
    return formatResponse(result);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(+id, updateMovieDto);
  }

}
