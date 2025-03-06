import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTheaterDto {
    constructor(
        name: string = '',
        address: string = '',
        district: string = '',
    ) {
        this.name = name;
        this.address = address;
        this.district = district;
    }

    @ApiProperty({ example: 'CGV Cresent Mall', description: 'Movie title' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'A mind-bending thriller...', description: 'Theather address' })
    @IsNotEmpty()
    @IsString()
    address: string;

    @ApiProperty({ example: '7', description: 'Theather district' })
    @IsNotEmpty()
    @IsString()
    district: string;

}
