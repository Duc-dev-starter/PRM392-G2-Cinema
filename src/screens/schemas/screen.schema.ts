import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { COLLECTION_NAME } from '../../constants';

export type ScreenDocument = HydratedDocument<Screen>;

@Schema({ timestamps: true })
export class Screen {
    @Prop({ type: Types.ObjectId, ref: COLLECTION_NAME.THEATER, required: true })
    theaterId: Types.ObjectId;

    @Prop({ required: true })
    name: string; // Ví dụ: Phòng 1, Phòng 2

    @Prop({ required: true })
    capacity: number; // Số ghế tối đa trong phòng
}

export const ScreenSchema = SchemaFactory.createForClass(Screen);