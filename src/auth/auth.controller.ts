/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import { Controller, Post, Body, Get, Req, Query, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { formatResponse } from 'src/utils';
import { Public } from '../decorators/public.decorator';
import { Request } from 'express';
import { ApiQuery, ApiOperation } from '@nestjs/swagger';

@Controller('/api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('login')
    @ApiOperation({ summary: 'Login with email and password' })
    async login(@Body() payload: LoginDto) {
        const token = await this.authService.login(payload);
        return formatResponse<string>(token);
    }

    @Public()
    @Get('/loginWithGoogle')
    @ApiOperation({ summary: 'Login with Google Firebase token' })
    @ApiQuery({ name: 'token', required: true, description: 'Firebase ID token from Android client' })
    async getLogin(@Query('token') token: string, @Req() request: Request): Promise<any> {
        if (!token) {
            throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
        }
        
        if (!request['user']) {
            throw new HttpException('Invalid or expired token', HttpStatus.UNAUTHORIZED);
        }
        
        const jwtToken = await this.authService.loginWithGoogle(request['user']);
        
        return formatResponse({
            token: jwtToken,
            user: {
                email: request['user']?.email,
                name: request['user']?.name,
                picture: request['user']?.picture,
                uid: request['user']?.uid
            }
        });
    }
}
