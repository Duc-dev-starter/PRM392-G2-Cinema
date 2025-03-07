import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { COLLECTION_NAME } from '../../constants';

export type TheaterDocument = HydratedDocument<Theater>;

@Schema({ timestamps: true })
export class Theater {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    district: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: COLLECTION_NAME.MOVIE }], default: [] })
    movies: Types.ObjectId[];
}

export const TheaterSchema = SchemaFactory.createForClass(Theater);
