import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TheaterDocument = HydratedDocument<Theater>;

@Schema({ timestamps: true })
export class Theater {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    district: string;

}

export const TheaterSchema = SchemaFactory.createForClass(Theater);
