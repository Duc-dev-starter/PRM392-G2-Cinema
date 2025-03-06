import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { COLLECTION_NAME } from "../../constants";

export type SeatDocument = HydratedDocument<Seat>;

@Schema({ timestamps: true })
export class Seat {
    @Prop({ type: Types.ObjectId, ref: COLLECTION_NAME.THEATHER, required: true })
    theatherId: Types.ObjectId;

    @Prop({ required: true })
    seatNumber: string;

    @Prop({ required: true, default: true })
    isAvailable: boolean;

    @Prop({ type: Types.ObjectId, ref: COLLECTION_NAME.USER })
    bookedBy?: Types.ObjectId;
}

export const SeatSchema = SchemaFactory.createForClass(Seat);

