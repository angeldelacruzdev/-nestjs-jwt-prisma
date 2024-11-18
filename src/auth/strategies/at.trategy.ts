import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, } from 'passport-jwt';
import { Strategy } from 'passport-local';

type JwtPayload = {
    sub: number;
    email: string;
};

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            scretOrKey: process.env.JWT_SECRET
        })
    }

    validate(payload: JwtPayload) {
        console.log(payload,  'Hola')
        return payload;
    }
}