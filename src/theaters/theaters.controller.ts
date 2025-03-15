import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { TheatersService } from './theaters.service';
import { CreateTheaterDto } from './dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';
import { SearchTheaterDto } from './dto/search-theater.dto';
import { formatResponse } from '../utils';

@Controller('/api/theaters')
export class TheatersController {
  constructor(private readonly theatersService: TheatersService) { }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create theater' })
  @ApiBody({ type: CreateTheaterDto })
  create(@Body() createTheaterDto: CreateTheaterDto) {
    return this.theatersService.create(createTheaterDto);
  }

  @ApiOperation({ summary: 'Find theaters' })
  @Get()
  async findAll(@Query() queryParams: SearchTheaterDto) {
    const result = await this.theatersService.findAll(queryParams);
    return formatResponse(result);
  }

  @ApiOperation({ summary: 'Find theater' })
  @ApiParam({ name: 'id', type: String, description: 'Theater ID', example: '67c919f0d284fdf03469bf48' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    const result = this.theatersService.findOne(id);
    return formatResponse(result);
  }
}
