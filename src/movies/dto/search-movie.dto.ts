import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class SearchMovieDto {
    constructor(
        keyword: string = '',
        genres: string[] = [],
        director: string = '',
        actors: string[] = [],
    ) {
        this.keyword = keyword;
        this.genres = genres;
        this.director = director;
        this.actors = actors;
    }

    @ApiProperty({ description: 'Keyword to search for in movie titles', required: false })
    @IsOptional()
    @IsString()
    public keyword?: string;

    @ApiProperty({ description: 'List of movie genres', required: false, type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    public genres?: string[];

    @ApiProperty({ description: 'Director of the movie', required: false })
    @IsOptional()
    @IsString()
    public director?: string;

    @ApiProperty({ description: 'List of actors in the movie', required: false, type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    public actors?: string[];
}
