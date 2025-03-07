import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsDate,
    IsArray,
    IsNumber,
    Min,
    Max,
    IsUrl,
    IsEnum,
} from 'class-validator';
import { MovieGenre, MovieRated, MovieStatus } from '../../enums';

export class CreateMovieDto {
    constructor(
        title: string = '',
        description: string = '',
        genres: MovieGenre[] = [],
        releaseDate: Date = new Date(),
        duration: number = 0,
        director: string = '',
        actors: string[] = [],
        rating: number = 0,
        banner: string = '',
        trailer: string = '',
        status: MovieStatus = MovieStatus.UPCOMING, 
        rated: MovieRated = MovieRated.GENERAL,
    ) {
        this.title = title;
        this.description = description;
        this.genres = genres;
        this.releaseDate = releaseDate;
        this.duration = duration;
        this.director = director;
        this.actors = actors;
        this.rated = rated;
        this.rating = rating;
        this.banner = banner;
        this.trailer = trailer;
        this.status = status;
    }

    @ApiProperty({ example: 'Inception', description: 'Movie title' })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ example: 'A mind-bending thriller...', description: 'Movie description' })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({
        example: [MovieGenre.ACTION, MovieGenre.SCIFI],
        enum: MovieGenre,
        isArray: true,
        description: 'List of movie genres',
    })
    @IsArray()
    @IsEnum(MovieGenre, { each: true }) // Kiểm tra từng phần tử trong mảng
    @IsNotEmpty()
    genres: MovieGenre[];
    

    @ApiProperty({ example: '2010-07-16T00:00:00.000Z', description: 'Release date' })
    @IsDate()
    @Type(() => Date)
    @IsNotEmpty()
    releaseDate: Date;

    @ApiProperty({ example: 148, description: 'Duration in minutes' })
    @IsNumber()
    @IsNotEmpty()
    duration: number;

    @ApiProperty({ example: 'Christopher Nolan', description: 'Director of the movie' })
    @IsNotEmpty()
    @IsString()
    director: string;

    @ApiProperty({
        example: MovieRated.TEEN,
        enum: MovieRated,
        description: 'Movie rated (0: General, 13: Teen, 18: Adult)',
    })
    @IsEnum(MovieRated)
    @IsNotEmpty()
    rated: MovieRated;

    @ApiProperty({ example: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'], description: 'List of actors' })
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    actors: string[];

    @ApiProperty({ example: 4.5, description: 'Movie rating (0-5)' })
    @IsNumber()
    @Min(0)
    @Max(5)
    @IsOptional()
    rating: number;

    @ApiProperty({ example: 'https://example.com/banner.jpg', description: 'Movie banner image URL' })
    @IsNotEmpty()
    @IsString()
    @IsUrl()
    banner: string;

    @ApiProperty({ example: 'https://www.youtube.com/embed/GyqGP4ul9xw?si=n0FRrACRBEVx8kmh', description: 'Movie trailer URL' })
    @IsNotEmpty()
    @IsString()
    @IsUrl()
    trailer: string;

    @ApiProperty({
        example: MovieStatus.UPCOMING,
        enum: MovieStatus,
        description: 'Movie status (Chưa chiếu, Đang chiếu, Đã chiếu)',
    })
    @IsEnum(MovieStatus)
    @IsOptional()
    status: MovieStatus;

    @ApiProperty({ example: ['60d5f8f4b4a5a71d3c4e8f4b', '60d5f8f4b4a5a71d3c4e8f4c'], description: 'List of Cinema IDs where the movie is available' })
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    theaters: string[];
}
