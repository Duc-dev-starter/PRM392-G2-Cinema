import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, IsDate, IsArray, IsNumber, Min, Max, IsUrl, IsBoolean } from 'class-validator';

export class CreateMovieDto {
    constructor(
        title: string = '',
        description: string = '',
        genres: string[] = [],
        releaseDate: Date = new Date(),
        duration: number = 0,
        director: string = '',
        actors: string[] = [],
        rating: number = 0,
        banner: string = '',
        trailer: string = '',
    ) {
        this.title = title;
        this.description = description;
        this.genres = genres;
        this.releaseDate = releaseDate;
        this.duration = duration;
        this.director = director;
        this.actors = actors;
        this.rating = rating;
        this.banner = banner;
        this.trailer = trailer;
    }

    @ApiProperty({ example: 'Inception', description: 'Movie title' })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({ example: 'A mind-bending thriller...', description: 'Movie description' })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ example: ['Sci-Fi', 'Thriller'], description: 'List of genres' })
    @IsArray()
    @IsNotEmpty()
    @IsString({ each: true })
    genres: string[];

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

}
