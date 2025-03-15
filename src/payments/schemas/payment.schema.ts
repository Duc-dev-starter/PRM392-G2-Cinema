import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema()
export class Payment extends Document {
    @Prop({ required: true })
    amount: number;

    @Prop({ required: true })
    method: string;

    @Prop({ required: true, enum: ['pending', 'completed', 'failed'] })
    status: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
