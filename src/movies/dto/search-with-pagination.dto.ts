import { Type } from 'class-transformer';
import { PaginationRequestModel, SearchPaginationRequestModel } from '../../models';
import { SearchMovieDto } from './search-movie.dto';
import { ApiProperty } from '@nestjs/swagger';


export class SearchWithPaginationDto extends SearchPaginationRequestModel<SearchMovieDto> {
    constructor(
        pageInfo: PaginationRequestModel,
        searchCondition: SearchMovieDto,
    ) {
        super(pageInfo, searchCondition);
    }

    @ApiProperty({ description: 'Pagination details', type: PaginationRequestModel })
    @Type(() => PaginationRequestModel)
    declare public pageInfo: PaginationRequestModel;

    @ApiProperty({ description: 'Search conditions', type: SearchMovieDto })
    @Type(() => SearchMovieDto)
    declare public searchCondition: SearchMovieDto;
}