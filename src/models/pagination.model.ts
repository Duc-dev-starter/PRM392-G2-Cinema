import { IsInt, Min } from 'class-validator';
import { PAGINATION } from '../constants';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class PaginationRequestModel {
    @Type(() => Number) 
    @Transform(({ value }) => (value ? Number(value) : 1)) // Nếu không có thì mặc định là 1
    @IsInt()
    @Min(1)
    @ApiProperty({ description: 'Current page number', example: 1, minimum: 1 })
    public pageNum: number = 1; // Giá trị mặc định

    @Type(() => Number) 
    @Transform(({ value }) => (value ? Number(value) : 10)) // Nếu không có thì mặc định là 10
    @IsInt()
    @Min(1)
    @ApiProperty({ description: 'Number of items per page', example: 10, minimum: 1 })
    public pageSize: number = 10; // Giá trị mặc định
}

export class PaginationResponseModel {
    constructor(
        pageNum: number = PAGINATION.pageNum,
        pageSize: number = PAGINATION.pageSize,
        totalItems: number = PAGINATION.totalItems,
        totalPages: number = PAGINATION.totalPages,
    ) {
        this.pageNum = pageNum;
        this.pageSize = pageSize;
        this.totalItems = totalItems;
        this.totalPages = totalPages;
    }

    public pageNum: number;
    public pageSize: number;
    public totalItems: number;
    public totalPages: number;
}