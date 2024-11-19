import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
@Injectable()
export class RtGuard extends AuthGuard('jwt-refresh') {
    constructor(private readonly jwService: JwtService) {
        super()
    }

    async canActivate(
        context: ExecutionContext,
    ) {
        const request = context.switchToHttp().getRequest();
        const token = request.headers?.refreshtoken?.split(' ')[1];
        const payload = await this.validateToken(token);
        request.user = payload;
        request.refreshToken = token;
        return true
    }

    private async validateToken(token: string) {
        const secret = process.env.RT;
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