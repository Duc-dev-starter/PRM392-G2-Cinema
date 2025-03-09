import { IsISO8601, IsNotEmpty, IsString, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationRequestModel } from '../../models';

export class SearchShowtimeDto extends PaginationRequestModel {
    @IsNotEmpty()
    @IsMongoId()
    @ApiProperty({ description: 'ID của phim', required: true, example: '67cac5a53a7cf444632df566' })
    movieId: string;

    @IsNotEmpty()
    @IsISO8601()
    @IsString()
    @ApiProperty({ description: 'Ngày chiếu (ISO 8601)', required: true, example: '2025-03-07T00:00:00.000Z' })
    date: string;  // FE gửi dạng string ISO
}
