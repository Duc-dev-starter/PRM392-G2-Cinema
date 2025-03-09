import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { COLLECTION_NAME } from '../../constants';

export type ShowtimeDocument = HydratedDocument<Showtime>;

@Schema({ timestamps: true })
export class Showtime {
    @Prop({ type: Types.ObjectId, ref: COLLECTION_NAME.MOVIE, required: true })
    movieId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: COLLECTION_NAME.THEATER, required: true })
    theaterId: Types.ObjectId;

    @Prop({ type: Date, required: true })
    showingDate: Date;

    @Prop({ required: true })
    startTime: Date;

    @Prop({ required: true })
    endTime: Date;

    @Prop({ type: Types.ObjectId, ref: COLLECTION_NAME.SCREEN, required: true })
    screenId: Types.ObjectId;
}

export const ShowtimeSchema = SchemaFactory.createForClass(Showtime);