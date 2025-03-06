import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MovieDocument = HydratedDocument<Movie>;

@Schema({ timestamps: true })
export class Movie {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true, type: [String] })
    genres: string[];

    @Prop({ required: true })
    releaseDate: Date;

    @Prop({ required: true })
    duration: number;

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
