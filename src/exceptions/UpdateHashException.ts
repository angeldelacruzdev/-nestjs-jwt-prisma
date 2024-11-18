import { HttpException, HttpStatus } from '@nestjs/common';

export class UpdateHashException extends HttpException {
    constructor(userId: number, error?: string) {
        super(
            `Failed to update refresh token hash for user ID ${userId}. ${error || 'Please try again later.'}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
}
