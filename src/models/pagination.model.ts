import { IsInt, Min } from 'class-validator';
import { PAGINATION } from '../constants';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationRequestModel {
    constructor(pageNum: number = PAGINATION.pageNum, pageSize: number = PAGINATION.pageSize) {
        this.pageNum = pageNum;
        this.pageSize = pageSize;
    }

    @IsInt()
    @ApiProperty({ description: 'Current page number', example: 1, minimum: 1 })
    @Min(PAGINATION.pageNum)
    public pageNum: number;

    @IsInt()
    @ApiProperty({ description: 'Number of items per page', example: 10, minimum: 1 })
    @Min(PAGINATION.pageNum)
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