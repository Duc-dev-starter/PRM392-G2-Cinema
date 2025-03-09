import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Model, Types } from 'mongoose';
import { ScreensService } from 'src/screens/screens.service';
import { CustomHttpException } from 'src/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { ScreenDocument } from 'src/screens/schemas';
import { Booking, BookingDocument } from './schemas/booking.schema';

@Injectable()
export class BookingsService {
  constructor(@InjectModel(Screen.name) private screenModel: Model<ScreenDocument>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>
  ) { }
  async bookSeats(userId: Types.ObjectId, showtimeId: Types.ObjectId, screenId: Types.ObjectId, selectedSeats: { row: string; number: number }[]) {
    // Lấy danh sách ghế từ phòng chiếu
    const screen = await this.screenModel.findById(screenId);
    if (!screen) {
      throw new CustomHttpException(HttpStatus.NOT_FOUND, 'Screen not found');
    }

    // Kiểm tra ghế có khả dụng không
    for (const seat of selectedSeats) {
      const seatIndex = screen.seats.findIndex(s => s.row === seat.row && s.number === seat.number);
      if (seatIndex === -1 || screen.seats[seatIndex].status !== 'available') {
        throw new CustomHttpException(HttpStatus.BAD_REQUEST, `Seat ${seat.row}${seat.number} is not available`);
      }
    }

    // Cập nhật trạng thái ghế thành 'booked'
    screen.seats = screen.seats.map(seat =>
      selectedSeats.some(s => s.row === seat.row && s.number === seat.number)
        ? { ...seat, status: 'booked' }
        : seat
    );

    await screen.save();

    // Tính tổng giá vé
    const totalPrice = selectedSeats.length * 100000; // Ví dụ: 100k/ghế

    // Tạo booking
    const booking = await this.bookingModel.create({
      userId,
      showtimeId,
      screenId,
      seats: selectedSeats,
      totalPrice,
      status: 'pending'
    });

    return booking;
  }


  findAll() {
    return `This action returns all bookings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
