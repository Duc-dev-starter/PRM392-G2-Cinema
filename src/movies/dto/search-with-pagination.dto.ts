import { Type } from 'class-transformer';
import { PaginationRequestModel, SearchPaginationRequestModel } from '../../models';
import { SearchMovieDto } from './search-movie.dto';


export class SearchWithPaginationDto extends SearchPaginationRequestModel<SearchMovieDto> {
    constructor(
        pageInfo: PaginationRequestModel,
        searchCondition: SearchMovieDto,
    ) {
        super(pageInfo, searchCondition);
    }

    @Type(() => SearchMovieDto)
    declare public searchCondition: SearchMovieDto;
}