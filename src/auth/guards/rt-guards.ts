import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

export class RtGuard extends AuthGuard('jwt-refresh') {
    constructor(private readonly jwService: JwtService) {
        super()
    }


    anActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers?.refreshtoken?.split(' ')[1]
        console.log(token)
        const payload = this.validateToken(token);
        console.log(payload)
        return false
    }

    private async validateToken(token: string) {
        const secret = process.env.RT;
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