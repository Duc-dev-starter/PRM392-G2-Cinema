import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationRequestModel } from '../../models';

export class SearchTheaterDto extends PaginationRequestModel {
    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Keyword to search for in movie titles', required: false })
    name?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Keyword to search for in movie addresses', required: false })
    address?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Keyword to search for in movie districts', required: false })
    district?: string;
}
