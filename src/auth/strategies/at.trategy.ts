import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() { }

    
}