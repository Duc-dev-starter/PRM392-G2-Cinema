import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { COLLECTION_NAME } from "src/constants";

export type SeatDocument = HydratedDocument<Seat>;

@Schema({ timestamps: true })
export class Seat {

    @Prop({ type: [{ type: Types.ObjectId, ref: COLLECTION_NAME.THEATHER }], default: [] })
    theatherId: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: COLLECTION_NAME.SCREEN }], default: [] })
    screenId: string;

    @Prop({ required: true })
    seatNumber: string;

    @Prop({ required: true, default: true })
    isAvailable: boolean;

    @Prop({ type: [{ type: Types.ObjectId, ref: COLLECTION_NAME.USER }], default: [] })
    bookedBy?: string;
}

export const SeatSchema = SchemaFactory.createForClass(Seat);
