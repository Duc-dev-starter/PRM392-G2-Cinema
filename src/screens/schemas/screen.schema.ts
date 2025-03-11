import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { COLLECTION_NAME } from '../../constants';

export type ScreenDocument = HydratedDocument<Screen>;

interface Seat {
    row: string;
    number: number;
    status: string;
    price: number;
}

@Schema({ timestamps: true })
export class Screen {
    @Prop({ type: Types.ObjectId, ref: COLLECTION_NAME.THEATER, required: true })
    theaterId: Types.ObjectId;

    @Prop({ required: true })
    name: string; // Ví dụ: Phòng 1, Phòng 2

    @Prop({ required: true })
    capacity: number; // Tổng số ghế

    @Prop({ type: [{ row: String, number: Number, status: String, price: Number }], default: [] })
    seats: Seat[];
}

export const ScreenSchema = SchemaFactory.createForClass(Screen);

// Middleware tự động tạo ghế trước khi lưu vào DB
ScreenSchema.pre<ScreenDocument>('save', function (next) {
    if (this.seats.length === 0) { // Chỉ tạo ghế nếu chưa có
        const totalSeats = this.capacity;
        const seatsPerRow = 10; // Mỗi hàng có 10 ghế
        const totalRows = Math.ceil(totalSeats / seatsPerRow); // Tính số hàng thực tế

        const rows = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice(0, totalRows).split(''); // Chuyển thành mảng

        // Xác định các nhóm hàng
        const cheapRange = Math.floor(totalRows * 0.2); // 20% hàng đầu & cuối
        const mediumRange = Math.floor(totalRows * 0.3); // 30% hàng gần giữa

        // Ánh xạ hàng vào giá vé
        const priceMapping: { [key: string]: number } = {};
        [...rows].forEach((row, index) => {
            if (index < cheapRange || index >= totalRows - cheapRange) {
                priceMapping[row] = 50; // Rẻ nhất
            } else if (index < cheapRange + mediumRange || index >= totalRows - (cheapRange + mediumRange)) {
                priceMapping[row] = 75; // Trung bình
            } else {
                priceMapping[row] = 100; // Đắt nhất
            }
        });

        const generatedSeats: Seat[] = [];
        for (let i = 0; i < totalSeats; i++) {
            const row = rows[Math.floor(i / seatsPerRow)];
            const number = (i % seatsPerRow) + 1;
            const price = priceMapping[row]; // Lấy giá từ mapping

            generatedSeats.push({ row, number, status: 'available', price });
        }
        this.seats = generatedSeats;
    }
    next();
});
