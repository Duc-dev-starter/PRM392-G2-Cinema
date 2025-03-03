import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { formatResponse } from 'src/utils';

@Controller('/api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() payload: LoginDto) {
        const token = await this.authService.login(payload);
        return formatResponse<string>(token);
    }
}
