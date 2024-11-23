import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AbilitiesGuard } from './guards/abilities.guard';

@Module({
    providers: [
        {
            provide: APP_GUARD,
            useClass: AbilitiesGuard
        }
    ]
})
export class CaslModule { }