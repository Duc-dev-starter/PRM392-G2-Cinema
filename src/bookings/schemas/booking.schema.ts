import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { COLLECTION_NAME } from "../../constants";
import { HydratedDocument, Types } from "mongoose";

export type BookingDocument = HydratedDocument<Booking>;


@Schema({ timestamps: true })
export class Booking {
    @Prop({ type: Types.ObjectId, ref: COLLECTION_NAME.USER, required: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: COLLECTION_NAME.SHOWTIME, required: true })
    showtimeId: Types.ObjectId;

    @Prop({ type: [Types.ObjectId], ref: COLLECTION_NAME.SEAT, required: true })
    seatIds: Types.ObjectId[];

    @Prop({ required: true })
    totalPrice: number;

    @Prop({ required: true, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' })
    status: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

