import { HttpException, HttpStatus } from '@nestjs/common';

export class HashingException extends HttpException {
    constructor(originalError?: string) {
        super(
            `An error occurred while hashing the data. ${originalError || 'Please try again later.'}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
}
