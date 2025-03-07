import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { MovieGenre, MovieRated, MovieStatus } from '../../enums';
import { COLLECTION_NAME } from '../../constants';

export type MovieDocument = HydratedDocument<Movie>;


@Schema({ timestamps: true })
export class Movie {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ type: [String], enum: MovieGenre, required: true })
    genres: MovieGenre[];

    @Prop({ required: true })
    releaseDate: Date;

    @Prop({ required: true })
    duration: number;

    @Prop({ enum: MovieStatus })
    status: MovieStatus;

    @Prop({ enum: MovieRated })
    rated: MovieRated;

    @Prop({ required: true })
    director: string;

    @Prop({ type: [String], default: [] })
    actors: string[];

    @Prop({ default: 0, min: 0, max: 5 })
    rating: number;

    @Prop({ required: true })
    banner: string;

    @Prop({ required: true })
    trailer: string;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
