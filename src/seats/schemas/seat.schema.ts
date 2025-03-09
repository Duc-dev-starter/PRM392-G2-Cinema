import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { COLLECTION_NAME } from '../../constants';

export type SeatDocument = HydratedDocument<Seat>;

@Schema({ timestamps: true })
export class Seat {
    @Prop({ type: Types.ObjectId, ref: COLLECTION_NAME.SCREEN, required: true })
    screenId: Types.ObjectId;

    @Prop({ required: true })
    row: string; // Ví dụ: A, B, C

    @Prop({ required: true })
    number: number; // Ví dụ: 1, 2, 3
}

export const SeatSchema = SchemaFactory.createForClass(Seat);