import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { COLLECTION_NAME } from '../../constants';

export type ScreenDocument = HydratedDocument<Screen>;

interface Seat {
    row: string;
    number: number;
    status: string;
}

@Schema({ timestamps: true })
export class Screen {
    @Prop({ type: Types.ObjectId, ref: COLLECTION_NAME.THEATER, required: true })
    theaterId: Types.ObjectId;

    @Prop({ required: true })
    name: string; // Ví dụ: Phòng 1, Phòng 2

    @Prop({ required: true })
    capacity: number; // Tổng số ghế

    @Prop({ type: [{ row: String, number: Number, status: String }], default: [] })
    seats: Seat[];
}

export const ScreenSchema = SchemaFactory.createForClass(Screen);

// Middleware tự động tạo ghế trước khi lưu vào DB
ScreenSchema.pre<ScreenDocument>('save', function (next) {
    if (this.seats.length === 0) { // Chỉ tạo ghế nếu chưa có
        const totalSeats = this.capacity;
        const seatsPerRow = 10; // Mỗi hàng có 10 ghế
        const rows = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Giới hạn 26 hàng

        // Khai báo kiểu dữ liệu rõ ràng cho mảng ghế
        const generatedSeats: Seat[] = [];
        for (let i = 0; i < totalSeats; i++) {
            const row = rows[Math.floor(i / seatsPerRow)];
            const number = (i % seatsPerRow) + 1;
            generatedSeats.push({ row, number, status: 'available' }); // Mặc định ghế trống
        }
        this.seats = generatedSeats; // Gán danh sách ghế đã tạo
    }
    next();
});
