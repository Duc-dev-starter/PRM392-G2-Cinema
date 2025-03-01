import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import CustomHttpException from './http.exception';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        if (exception instanceof CustomHttpException) {
            response.status(exception.status).json({
                success: false,
                message: exception.message,
                errors: exception.errors || [],
            });
        }
        else if (exception instanceof BadRequestException) {
            const errorResponse = exception.getResponse() as any;
            response.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: null,
                errors: errorResponse.message || [],
            });
        }
        else {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message:
                    exception instanceof Error
                        ? exception.message
                        : 'An unknown error occurred',
                errors: [],
            });
        }
    }


}