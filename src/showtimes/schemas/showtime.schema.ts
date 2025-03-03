import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { COLLECTION_NAME } from "../../constants";

export type ShowtimeDocument = HydratedDocument<Showtime>;


@Schema({ timestamps: true })
export class Showtime {
    @Prop({ type: [{ type: Types.ObjectId, ref: COLLECTION_NAME.MOVIE }], default: [] })
    movieId: Types.ObjectId[];

    @Prop({ type: [{ type: Types.ObjectId, ref: COLLECTION_NAME.THEATHER }], default: [] })
    theatherId: Types.ObjectId[];

    @Prop({ type: [{ type: Types.ObjectId, ref: COLLECTION_NAME.SCREEN }], default: [] })
    screenId: Types.ObjectId[];

    @Prop({ required: true })
    startTime: Date;

    @Prop({ required: true })
    endTime: Date;

}

export const ShowtimeSchema = SchemaFactory.createForClass(Showtime);
