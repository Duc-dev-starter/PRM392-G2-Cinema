import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Model, Types, Connection } from 'mongoose';
import { CustomHttpException } from '../exceptions';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Screen, ScreenDocument } from '../screens/schemas';
import { PaymentsService } from '../payments/payments.service';
import { Booking, BookingDocument } from './schemas';
import { UsersService } from '../users/users.service';

@Injectable()
export class BookingsService {
  constructor(@InjectModel(Screen.name) private screenModel: Model<ScreenDocument>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectConnection() private readonly mongooseConnection: Connection,
    private readonly paymentService: PaymentsService,
    private readonly usersService: UsersService
  ) { }
  async bookSeats(payload: CreateBookingDto, userId: string) {
    const { screenId, seats, showtimeId } = payload;
    let totalPrice = 0;

    console.log(payload);
    if (seats.length > 5) {
      throw new CustomHttpException(HttpStatus.BAD_REQUEST, 'A user can book a maximum of 5 seats per booking');
    }

    const session = await this.mongooseConnection.startSession();
    session.startTransaction();

    try {
      const screen = await this.screenModel.findById(screenId).session(session);
      if (!screen) {
        throw new CustomHttpException(HttpStatus.NOT_FOUND, 'Screen not found');
      }

      const currentTime = new Date();
      const reservationTimeout = 10 * 60 * 1000; // 10 minutes

      const allAvailable = seats.every(selectedSeat => {
        const seat = screen.seats.find(s => s._id.toString() === selectedSeat.seatId);
        return seat && (
          seat.status === 'available' ||
          (seat.status === 'reserved' && seat.reservedUntil !== undefined && seat.reservedUntil < currentTime)
        );
      });

      if (!allAvailable) {
        throw new CustomHttpException(HttpStatus.BAD_REQUEST, 'Some seats are not available');
      }

      const bookingSeats = seats.map(selectedSeat => {
        const seat = screen.seats.find(s => s._id.toString() === selectedSeat.seatId);
        if (!seat) {
          throw new CustomHttpException(HttpStatus.BAD_REQUEST, `Seat with id ${selectedSeat.seatId} not found in screen`);
        }
        return {
          _id: new Types.ObjectId(selectedSeat.seatId),
          row: seat.row,
          number: seat.number
        };
      });

      // Create a booking with 'pending' status
      const booking = new this.bookingModel({
        userId,
        showtimeId,
        screenId,
        totalPrice,
        seats: bookingSeats,
        status: 'pending',
      });
      await booking.save({ session });
      console.log('Before calculating price');

      // Reserve the selected seats
      screen.seats = screen.seats.map(seat => {
        const isSelected = seats.some(s => s.seatId === seat._id.toString());
        if (isSelected) {
          totalPrice += seat.price;
          return {
            ...seat,
            status: 'reserved',
            reservedUntil: new Date(currentTime.getTime() + reservationTimeout),
            reservedBy: booking._id,
          };
        }
        return seat;
      });
      booking.totalPrice = totalPrice;
      await booking.save({ session });
      await screen.save({ session });
      console.log(booking);

      // Commit the transaction
      await session.commitTransaction();
      const user = await this.usersService.findOne(userId);
      const email = user?.email;
      // Create ZaloPay payment request
      const paymentUrl = await this.paymentService.createZaloPayOrder(booking._id.toString(), email, totalPrice);
      return { booking, paymentUrl };
    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      throw error;
    } finally {
      session.endSession();
    }
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

}
