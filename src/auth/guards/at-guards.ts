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
            // Validar el token (puedes usar JwtService u otro mecanismo)
            const payload = await this.validateToken(token);

            request.user = payload; // Adjuntar usuario decodificado a la solicitud
            return true;
        } catch (err) {
            console.error(err)
            console.error('Error al validar el token:', err.message);
            return false;
        }
    }

    private async validateToken(token: string) {
        const secret = process.env.JWT_SECRET;
        try {
            return await this.jwService.verifyAsync(token, { secret });
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('El token ha expirado.');
            } else if (error.name === 'JsonWebTokenError') {
                throw new UnauthorizedException('Token inválido o firma incorrecta.');
            } else {
                throw new UnauthorizedException('Error al procesar el token.');
            }
        }
    }
}