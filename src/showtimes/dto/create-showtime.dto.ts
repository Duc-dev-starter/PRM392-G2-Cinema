import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsMongoId, IsString } from 'class-validator';

export class CreateShowtimeDto {
    @ApiProperty({ description: 'ID của bộ phim', example: '67cab12d4a14be2b62d0e479' })
    @IsMongoId()
    movieId: string;

    @ApiProperty({ description: 'ID của rạp chiếu', example: '67c919f0d284fdf03469bf48' })
    @IsMongoId()
    theaterId: string;

    @ApiProperty({ description: 'Ngày chiếu phim (ISO 8601)', example: '2025-03-07T00:00:00.000Z' })
    @IsISO8601()
    @IsString()
    showingDate: string;  // Chấp nhận kiểu string từ FE

    @ApiProperty({ description: 'Giờ bắt đầu chiếu phim (ISO 8601)', example: '2025-03-07T09:00:00.000Z' })
    @IsISO8601()
    @IsString()
    startTime: string;  // FE gửi ISO string
}
