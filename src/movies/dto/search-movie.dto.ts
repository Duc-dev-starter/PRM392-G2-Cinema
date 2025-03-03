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

    @IsOptional()
    @IsString()
    public keyword?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    public genres?: string[];

    @IsOptional()
    @IsString()
    public director?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    public actors?: string[];
}
