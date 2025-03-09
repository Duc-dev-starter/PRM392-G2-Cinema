import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateShowtimeDto {
    @ApiProperty({ description: 'ID của bộ phim', example: '67cab12d4a14be2b62d0e479' })
    @IsNotEmpty()
    @IsMongoId()
    movieId: string;

    @ApiProperty({ description: 'ID của rạp chiếu', example: '67c919f0d284fdf03469bf48' })
    @IsNotEmpty()
    @IsMongoId()
    theaterId: string;

    @ApiProperty({ description: 'ID của phòng chiếu', example: '67c919f0d284fdf03469bf48' })
    @IsNotEmpty()
    @IsMongoId()
    screenId: string;

    @ApiProperty({ description: 'Ngày chiếu phim (ISO 8601)', example: '2025-03-07T00:00:00.000Z' })
    @IsISO8601()
    @IsNotEmpty()
    @IsString()
    showingDate: string;  // Chấp nhận kiểu string từ FE

    @ApiProperty({ description: 'Giờ bắt đầu chiếu phim (ISO 8601)', example: '2025-03-07T09:00:00.000Z' })
    @IsISO8601()
    @IsNotEmpty()
    @IsString()
    startTime: string;  // FE gửi ISO string
}
