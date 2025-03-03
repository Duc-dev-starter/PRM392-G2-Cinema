import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { COLLECTION_NAME } from '../../constants';

export type ScreenDocument = HydratedDocument<Screen>;

@Schema({ timestamps: true })
export class Screen {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    capacity: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: COLLECTION_NAME.SEAT }], default: [] })
    seatIds: Types.ObjectId[];
}

export const ScreenSchema = SchemaFactory.createForClass(Screen);
