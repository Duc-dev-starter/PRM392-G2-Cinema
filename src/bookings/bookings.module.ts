import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { Screen, ScreenSchema } from 'src/screens/schemas/screen.schema';
import { ScreensModule } from 'src/screens/screens.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: Screen.name, schema: ScreenSchema }, // Thêm dòng này để đăng ký ScreenModel
    ]),
    ScreensModule, // Đảm bảo ScreensModule đã được import
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule { }
