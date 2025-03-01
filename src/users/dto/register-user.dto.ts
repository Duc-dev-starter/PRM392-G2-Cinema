import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsDate, IsIn, MinLength, IsBoolean, IsEmail } from 'class-validator';
import { Role } from 'src/enums';
import { UserRole, UserRoles } from '../users.interface';

export default class RegisterUserDto {
    constructor(
        name: string = '',
        email: string = '',
        password: string = '',
        phoneNumber: string = '',
        role: UserRole = Role.User,
        createdAt: Date = new Date(),
        updatedAt: Date = new Date(),
        isDeleted: boolean = false,
    ) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.phoneNumber = phoneNumber;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isDeleted = isDeleted;
    }

    @ApiProperty({ example: 'Electronics', description: 'Category name' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'Category for electronic devices' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: '123456' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'user' })
    @IsOptional()
    @IsIn(UserRoles)
    public role: UserRole;


    @ApiProperty({ example: '123456' })
    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @IsDate()
    @IsOptional()
    public createdAt: Date;

    @IsDate()
    @IsOptional()
    public updatedAt: Date;

    @ApiProperty({ example: false })
    @IsOptional()
    @IsBoolean()
    isDeleted?: boolean;
}
