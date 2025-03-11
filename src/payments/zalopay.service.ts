// import * as crypto from 'crypto';
// import axios from 'axios';
// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class ZaloPayService {
//     private readonly app_id = '553'; // Thay bằng APP_ID của bạn
//     private readonly key1 = 'your_key1'; // Thay bằng Key1 từ ZaloPay
//     private readonly endpoint = 'https://sandbox.zalopay.vn/v001/tpe/createorder';

//     async createPayment(orderId: string, amount: number, description: string) {
//         const embedData = {}; // Thêm thông tin nếu cần
//         const items = []; // Thêm thông tin chi tiết đơn hàng nếu có

//         const order = {
//             app_id: this.app_id,
//             app_trans_id: `${new Date().getFullYear()}${(Date.now() % 1e6).toString()}`, // ID đơn hàng
//             app_user: 'user123', // Có thể để userId
//             app_time: Date.now(),
//             amount: amount,
//             item: JSON.stringify(items),
//             description: description,
//             embed_data: JSON.stringify(embedData),
//         };

//         // Tạo checksum SHA256
//         const data = `${this.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
//         order.mac = crypto.createHmac('sha256', this.key1).update(data).digest('hex');

//         // Gọi API ZaloPay để tạo đơn hàng
//         try {
//             const response = await axios.post(this.endpoint, order);
//             return response.data;
//         } catch (error) {
//             console.error('Error creating ZaloPay order:', error);
//             throw new Error('Failed to create payment');
//         }
//     }
// }
