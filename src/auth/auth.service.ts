import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async login(payload: LoginDto): Promise<string> {
        const { email, password } = payload;

        // Kiểm tra user có tồn tại không
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }
        // Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Tạo token JWT
        const token = this.jwtService.sign({ userId: user._id, email: user.email, role: user.role });

        return token;
    }
}
