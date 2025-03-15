import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { COLLECTION_NAME } from '../../constants';

export type ScreenDocument = HydratedDocument<Screen>;

interface Seat {
    _id: Types.ObjectId;
    row: string;
    number: number;
    status: string; // 'available', 'reserved', hoặc 'booked'
    price: number;
    reservedUntil?: Date; // Thời gian hết hạn giữ chỗ
    reservedBy?: Types.ObjectId; // ID của booking giữ chỗ
}

@Schema({ timestamps: true })
export class Screen {
    @Prop({ type: Types.ObjectId, ref: COLLECTION_NAME.THEATER, required: true })
    theaterId: Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    capacity: number;

    @Prop({
        type: [{
            row: String,
            number: Number,
            status: String,
            price: Number,
            reservedUntil: Date,
            reservedBy: { type: Types.ObjectId, ref: COLLECTION_NAME.BOOKING }
        }], default: []
    })
    seats: Seat[];
}

export const ScreenSchema = SchemaFactory.createForClass(Screen);

// Middleware giữ nguyên như code của bạn
ScreenSchema.pre<ScreenDocument>('save', function (next) {
    if (this.seats.length === 0) {
        const totalSeats = this.capacity;
        const seatsPerRow = 10;
        const totalRows = Math.ceil(totalSeats / seatsPerRow);
        const rows = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice(0, totalRows).split('');

        const cheapRange = Math.floor(totalRows * 0.2);
        const mediumRange = Math.floor(totalRows * 0.3);

        const priceMapping: { [key: string]: number } = {};
        [...rows].forEach((row, index) => {
            if (index < cheapRange || index >= totalRows - cheapRange) {
                priceMapping[row] = 50;
            } else if (index < cheapRange + mediumRange || index >= totalRows - (cheapRange + mediumRange)) {
                priceMapping[row] = 75;
            } else {
                priceMapping[row] = 100;
            }
        });

        const generatedSeats: Seat[] = [];
        for (let i = 0; i < totalSeats; i++) {
            const row = rows[Math.floor(i / seatsPerRow)];
            const number = (i % seatsPerRow) + 1;
            const price = priceMapping[row];
            generatedSeats.push({
                row, number, status: 'available', price,
                _id: new Types.ObjectId
            });
        }
        this.seats = generatedSeats;
    }
    next();
});