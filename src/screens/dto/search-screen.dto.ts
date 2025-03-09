
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { PaginationRequestModel } from '../../models';
import { ApiProperty } from '@nestjs/swagger';


export class SearchScreensDto extends PaginationRequestModel {
    @IsNotEmpty()
    @IsMongoId()
    @ApiProperty({ description: 'ID của rạp', required: true, example: '67cb9b3e84cc1b59cedbb31b' })
    theaterId: string;
}
