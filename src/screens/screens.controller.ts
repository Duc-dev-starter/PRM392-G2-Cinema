import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ScreensService } from './screens.service';
import { UpdateScreenDto } from './dto/update-screen.dto';
import { ApiOperation } from '@nestjs/swagger';
import { CreateScreenDto, SearchScreensDto } from './dto';
import { formatResponse } from '../utils';

@Controller('api/screens')
export class ScreensController {
  constructor(private readonly screensService: ScreensService) { }

  @Post()
  create(@Body() createScreenDto: CreateScreenDto) {
    return this.screensService.create(createScreenDto);
  }

  @ApiOperation({ summary: 'Find theaters' })
  @Get()
  async findAll(@Query() queryParams: SearchScreensDto) {
    const result = await this.screensService.findAll(queryParams);
    return formatResponse(result);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.screensService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScreenDto: UpdateScreenDto) {
    return this.screensService.update(+id, updateScreenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.screensService.remove(+id);
  }
}
