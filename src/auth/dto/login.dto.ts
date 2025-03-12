import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  @ApiProperty({ example: 'leminhduck@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @MinLength(6)
  public password: string;
}
