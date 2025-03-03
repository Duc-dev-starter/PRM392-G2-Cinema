import { HttpStatus } from '@nestjs/common';
import { CustomHttpException } from '../exceptions';
import { PaginationResponseModel, SearchPaginationResponseModel } from 'src/models';


export const formatResponse = <T>(data: T, success: boolean = true) => {
    return {
        success,
        data,
    };
};

export const formatPaginationResult = <T>(
    result: SearchPaginationResponseModel<T>,
    items: any[],
    paginationInfo: PaginationResponseModel,
) => {
    result.pageInfo.pageNum = paginationInfo.pageNum;
    result.pageInfo.pageSize = paginationInfo.pageSize;
    if (paginationInfo.totalItems > 0) {
        result.pageData = items;
        result.pageInfo.totalItems = paginationInfo.totalItems;
        result.pageInfo.totalPages = Math.ceil(
            paginationInfo.totalItems / paginationInfo.pageSize,
        );
    }

    return result;
};

export const isEmptyObject = (obj: any): boolean => {
    return !Object.keys(obj).length;
};

export const validateInput = (payload: any) => {
    if (!payload) {
        throw new CustomHttpException(HttpStatus.BAD_REQUEST, 'You need to send data');
    }

    if (payload.pageInfo) {
        if (!payload.pageInfo.pageNum || !payload.pageInfo.pageSize) {
            throw new CustomHttpException(
                HttpStatus.BAD_REQUEST,
                'Page num and page size are required in pageInfo',
            );
        }

        if (payload.pageInfo.pageNum <= 0 || payload.pageInfo.pageSize <= 0) {
            throw new CustomHttpException(
                HttpStatus.BAD_REQUEST,
                'Page num and page size must be equal or greater than 1',
            );
        }
    }
};