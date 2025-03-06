import { IsInt, Min } from 'class-validator';
import { PAGINATION } from '../constants';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginationRequestModel {
    constructor(pageNum: number = 1, pageSize: number = 10) {
        this.pageNum = pageNum;
        this.pageSize = pageSize;
    }

    @Type(() => Number) // Ép kiểu từ string sang number
    @IsInt()
    @Min(1)
    @ApiProperty({ description: 'Current page number', example: 1, minimum: 1 })
    public pageNum: number;

    @Type(() => Number) // Ép kiểu từ string sang number
    @IsInt()
    @Min(1)
    @ApiProperty({ description: 'Number of items per page', example: 10, minimum: 1 })
    public pageSize: number;
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