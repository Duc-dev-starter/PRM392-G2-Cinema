import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateScreenDto {
    @ApiProperty({ description: 'ID của bộ rạp', example: '67cab12d4a14be2b62d0e479' })
    @IsMongoId()
    @IsNotEmpty()
    theaterId: string;

    @ApiProperty({ description: 'Tên rạp', example: 'Screen 1' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: 'Số lượng ghế', example: 150 })
    @IsNotEmpty()
    @IsNumber()
    capacity: number;

}
