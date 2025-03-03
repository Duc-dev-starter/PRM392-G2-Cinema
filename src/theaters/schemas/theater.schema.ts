import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { COLLECTION_NAME } from '../../constants';

export type TheatherDocument = HydratedDocument<Theather>;

@Schema({ timestamps: true })
export class Theather {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    address: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: COLLECTION_NAME.SCREEN }], default: [] })
    screenIds: Types.ObjectId[];
}

export const TheatherSchema = SchemaFactory.createForClass(Theather);
