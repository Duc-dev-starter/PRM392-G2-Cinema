import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { ShowtimesService } from './showtimes.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
import { formatResponse } from '../utils';
import { CreateShowtimeDto, SearchShowtimeDto, UpdateShowtimeDto } from './dto';

@Controller('/api/showtimes')
export class ShowtimesController {
  constructor(private readonly showtimesService: ShowtimesService) { }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create showtime' })
  @ApiBody({ type: CreateShowtimeDto })
  async create(@Body() createShowtimeDto: CreateShowtimeDto) {
    const result = await this.showtimesService.create(createShowtimeDto);
    return formatResponse(result);
  }

  @ApiOperation({ summary: 'Find showtimes by movie and date' })
  @Get()
  async findAll(@Query() queryParams: SearchShowtimeDto) {
    const result = await this.showtimesService.findShowtimesByMovieAndDate(queryParams);
    return formatResponse(result);
  }

  @ApiOperation({ summary: 'Find showtime' })
  @ApiParam({ name: 'id', type: String, description: 'Showtime ID', example: '67c919f0d284fdf03469bf48' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.showtimesService.findOne(id);
    return formatResponse(result);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShowtimeDto: UpdateShowtimeDto) {
    return this.showtimesService.update(+id, updateShowtimeDto);
  }

}
