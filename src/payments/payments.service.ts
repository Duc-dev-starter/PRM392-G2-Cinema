/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import * as crypto from 'crypto';
import { Model } from 'mongoose';
import { Booking } from 'src/bookings/schemas';
import { Payment } from './schemas/payment.schema';

interface ZaloPayParams {
  app_id: string;
  app_user: string;
  app_time: number;
  app_trans_id: string;
  amount: number;
  description: string;
  embed_data: string;
  item: string;
  bank_code: string;
  callback_url?: string;
  mac: string;
}

@Injectable()
export class PaymentsService {
  private readonly appId = '2554'; // App ID từ ZaloPay sandbox
  private readonly key1 = 'sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn'; // Khóa HMAC từ ZaloPay (thay bằng key thật)
  private readonly endpoint = 'https://sb-openapi.zalopay.vn/v2/create';
  private readonly key2 = 'trMrHtvjo6myautxDUiAcYsVtaeQ8nhf';

  constructor(
    @InjectModel('Payment') private paymentModel: Model<Payment>,
    @InjectModel('Booking') private bookingModel: Model<Booking>,
  ) { }

  async createZaloPayOrder(bookingId: string, email: string, amount: number): Promise<string> {
    const now = new Date();
    const appTransId = `${now.getFullYear().toString().slice(2)}${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${bookingId}`;

    const params: ZaloPayParams = {
      app_id: this.appId,
      app_user: email,
      app_time: Date.now(),
      app_trans_id: appTransId,
      amount: amount * 1000,
      description: `Thanh toán đặt vé cho booking ${bookingId}`,
      embed_data: JSON.stringify({ bookingId }), // Dữ liệu bổ sung để nhận diện booking
      item: JSON.stringify([{ bookingId, amount }]), // Thông tin chi tiết đơn hàng
      bank_code: '', // Để trống nếu không chỉ định ngân hàng
      // callback_url: 'https://your-server.com/payment/zalopay/callback', // URL công khai để nhận callback
      mac: '', // Sẽ được tính toán sau
    };

    // Tính toán mã MAC
    const data = `${params.app_id}|${params.app_trans_id}|${params.app_user}|${params.amount}|${params.app_time}|${params.embed_data}|${params.item}`;
    params.mac = crypto.createHmac('sha256', this.key1).update(data).digest('hex');

    console.log(params)
    try {
      const response = await axios.post(this.endpoint, null, { params })

      console.log(response.data);

      if (response.data.return_code === 1) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        return response.data.order_url; // Trả về URL để người dùng thanh toán
      } else {
        throw new Error(`ZaloPay error: ${response.data.return_message}`);
      }
    } catch (error) {
      throw new Error(`Không thể tạo yêu cầu thanh toán ZaloPay: ${error.message}`);
    }
  }


}