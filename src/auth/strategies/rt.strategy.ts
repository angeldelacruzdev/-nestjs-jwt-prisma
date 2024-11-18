import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { FastifyRequest } from 'fastify';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            scretOrKey: process.env.RT,
            passReqToCallback: true
        })
    }
    async validate(req: FastifyRequest, payload: any) {
        console.log(req, 'Hola')
        // const refreshToken = req.get('authorization').replace('Bearer', '').trim();
        return {
            ...payload,
            // refreshToken,
        };
    }
}