import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto';
import { Role } from '../enums';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

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
        const token = this.jwtService.sign({
            userId: user._id,
            email: user.email,
            role: user.role,
        });

        return token;
    }

    async loginWithGoogle(userData: any): Promise<string> {
        // Find user by email, if not, create new user. 
        try {
            let dbUser = await this.usersService.findByEmail(userData.email);
            
            if (!dbUser) {
                const password = Math.random().toString(36).slice(-8);
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                
                const newUser = {
                    email: userData.email,
                    name: userData.name || userData.email.split('@')[0],
                    password: hashedPassword,
                    phoneNumber: '',
                    role: Role.User,
                    uid: userData.uid,
                    picture: userData.picture,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                
                await this.usersService.create(newUser);
                dbUser = await this.usersService.findByEmail(userData.email);
                
                if (!dbUser) {
                    throw new UnauthorizedException('Failed to create user');
                }
            }
            
            return this.jwtService.sign({
                userId: dbUser._id,
                email: dbUser.email,
                role: dbUser.role,
                uid: userData.uid
            });
        } catch (error) {
            console.error('Google login error:', error);
            throw new UnauthorizedException('Authentication failed');
        }
    }
}
