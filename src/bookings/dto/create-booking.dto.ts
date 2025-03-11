import { IsArray, IsMongoId, IsNumber, IsNotEmpty, MaxLength, ArrayMaxSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// Định nghĩa DTO cho từng ghế
class SeatDto {
    @IsNotEmpty()
    @MaxLength(1) // Hàng chỉ có 1 ký tự (A, B, C, ...)
    row: string;

    @IsNumber()
    @IsNotEmpty()
    number: number;
}

export class CreateBookingDto {
    @IsMongoId()
    @IsNotEmpty()
    userId: string;

    @IsMongoId()
    @IsNotEmpty()
    showtimeId: string;

    @IsMongoId()
    @IsNotEmpty()
    screenId: string;

    @IsArray()
    @ArrayMaxSize(5) // Giới hạn tối đa 5 ghế
    @ValidateNested({ each: true }) // Kiểm tra từng phần tử của mảng
    @Type(() => SeatDto) // Biến đổi dữ liệu JSON thành instance của SeatDto
    seats: SeatDto[];

    @IsNumber()
    @IsNotEmpty()
    totalPrice: number;
}
