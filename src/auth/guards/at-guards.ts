import { Reflector } from '@nestjs/core';
import {
    Injectable,
    ExecutionContext,
    UnauthorizedException
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector, private readonly jwService: JwtService) {
        super();
    }

    async canActivate(context: ExecutionContext) {

        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) return true;

        const request = context.switchToHttp().getRequest();
        const token = request.headers['authorization']?.split(' ')[1];

        if (!token) {
            console.error('Token no proporcionado');
            return false;
        }

        try {
            const payload = await this.validateToken(token);

            request.user = payload;
            return true;
        } catch (err) {
            throw err;
        }
    }

    private async validateToken(token: string) {
        const secret = process.env.JWT_SECRET;
        try {
            return await this.jwService.verifyAsync(token, { secret });
        } catch (error) {
            const errorMessages: Record<string, string> = {
                TokenExpiredError: 'El token ha expirado.',
                JsonWebTokenError: 'Token inválido o firma incorrecta.',
            };

            const message = errorMessages[error.name] || 'Error al procesar el token.';
            throw new UnauthorizedException(message);
        }
    }
}