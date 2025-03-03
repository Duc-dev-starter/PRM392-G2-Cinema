import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { COLLECTION_NAME } from "../../constants";
import { HydratedDocument, Types } from "mongoose";

export type BookingDocument = HydratedDocument<Booking>;


@Schema({ timestamps: true })
export class Booking {
    @Prop({ type: [{ type: Types.ObjectId, ref: COLLECTION_NAME.USER }], default: [] })
    userId: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: COLLECTION_NAME.MOVIE }], default: [] })
    showtimeId: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: COLLECTION_NAME.SEAT }], default: [] })
    seatIds: string[];

    @Prop({ required: true })
    totalPrice: number;

    @Prop({ required: true, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' })
    status: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
