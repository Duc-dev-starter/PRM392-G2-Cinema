import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payment')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Post('zalopay/callback')
  handleZaloPayCallback() {
    return "hello";
  }
}