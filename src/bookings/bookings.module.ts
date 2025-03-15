import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking, BookingSchema } from './schemas';
import { Screen, ScreenSchema } from '../screens/schemas';
import { ScreensModule } from '../screens/screens.module';
import { PaymentsModule } from '../payments/payments.module';
import { Payment, PaymentSchema } from '../payments/schemas';
import { User, UserSchema } from '../users/schemas';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: Screen.name, schema: ScreenSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: User.name, schema: UserSchema }
    ]),
    ScreensModule, // Đảm bảo ScreensModule đã được import
    PaymentsModule,
    UsersModule
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule { }
