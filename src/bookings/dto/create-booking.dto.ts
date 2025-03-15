import { IsArray, IsMongoId, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SeatDto {
    @IsMongoId()
    seatId: string; // Nhận _id của ghế
}

export class CreateBookingDto {
    @IsMongoId()
    showtimeId: string;

    @IsMongoId()
    screenId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SeatDto)
    seats: SeatDto[];
}