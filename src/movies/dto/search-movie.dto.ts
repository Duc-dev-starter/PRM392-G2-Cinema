import { IsOptional, IsString, IsEnum, IsArray, IsNumber, Min, Max, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationRequestModel } from '../../models';
import { MovieRated, MovieStatus, MovieGenre } from '../../enums';
import { Transform } from 'class-transformer';

export class SearchMovieDto extends PaginationRequestModel {
    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Keyword to search for in movie titles', required: false })
    title?: string;

    @IsOptional()
    @IsEnum(MovieRated)
    @Transform(({ value }) => parseInt(value, 10)) // Chuyển từ string sang number
    @ApiProperty({ description: 'Rated category of the movie', required: false, enum: MovieRated })
    rated?: MovieRated;

    @IsOptional()
    @IsEnum(MovieStatus)
    @ApiProperty({ 
        description: 'Filter movies by status (Upcoming, Now Showing, Released)', 
        enum: MovieStatus, 
        required: false 
    })
    status?: MovieStatus;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(5)
    @Transform(({ value }) => parseFloat(value)) // Chuyển đổi rating sang số thực
    @ApiProperty({ description: 'Minimum rating for filtering', required: false, minimum: 0, maximum: 5 })
    rating?: number;

    @IsOptional()
    @IsArray()
    @IsEnum(MovieGenre, { each: true })
    @ApiProperty({ 
        description: 'Filter movies by genres', 
        isArray: true, 
        enum: MovieGenre, 
        required: false 
    })
    genres?: MovieGenre[];

    @IsOptional()
    @IsMongoId({ each: true })
    @ApiProperty({
        description: 'Filter movies by theater IDs',
        required: false,
        type: [String],
    })
    theaters?: string[];
}
