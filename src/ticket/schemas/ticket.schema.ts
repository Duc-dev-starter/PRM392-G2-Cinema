import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { COLLECTION_NAME } from '../../constants';

export type TicketDocument = HydratedDocument<Ticket>;

@Schema({ timestamps: true })
export class Ticket {
    @Prop({ type: Types.ObjectId, ref: COLLECTION_NAME.SHOWTIME, required: true })
    showtimeId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: COLLECTION_NAME.SEAT, required: true })
    seatId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: COLLECTION_NAME.USER, required: true })
    userId: Types.ObjectId;

    @Prop({ required: true, default: 'booked' })
    status: string; // 'booked', 'paid', 'cancelled'
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);