import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsMongoId } from 'class-validator';

export class CreateShowtimeDto {
    @ApiProperty({ description: 'ID của bộ phim', example: '67cab12d4a14be2b62d0e479' })
    @IsMongoId()
    movieId: string;

    @ApiProperty({ description: 'ID của rạp chiếu', example: '67c919f0d284fdf03469bf48' })
    @IsMongoId()
    theaterId: string;

    @ApiProperty({ description: 'Ngày chiếu phim (YYYY-MM-DD)', example: '2025-03-07' })
    @IsDateString()
    showingDate: Date;

    @ApiProperty({ description: 'Giờ bắt đầu chiếu phim (ISO 8601)', example: '2025-03-07T09:00:00.000Z' })
    @IsDateString()
    startTime: Date;

    @ApiProperty({ description: 'Giờ kết thúc chiếu phim (ISO 8601)', example: '2025-03-07T11:00:00.000Z' })
    @IsDateString()
    endTime: Date;
}
