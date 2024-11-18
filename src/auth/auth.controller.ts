import { AuthService } from './auth.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthDto } from './dto';
import { Tokens } from './types';
import { AtGuard } from './guards';
import { RtGuard } from './guards/rt-guards';
import { GetCurrentUser, GetCurrentUserId, Public } from './decorators';

@Controller({
    path: 'auth',
    version: '1',
})
export class AuthController {

    constructor(private authService: AuthService) { }

    @Public()
    @Post('signup')
    async signup(@Body() dto: AuthDto): Promise<Tokens> {
        return await this.authService.signup(dto)
    }

    @Public()
    @Post('signin')
    async signin() {
        await this.authService.signin()
    }

    @UseGuards(AtGuard)
    @Post('logout')
    async logout(@GetCurrentUserId() userId: number) {
        await this.authService.logout(userId)
    }


    @Public()
    @UseGuards(RtGuard)
    @Post('refresh')
    async refreshToken(
        @GetCurrentUserId() userId: number,
        @GetCurrentUser('refreshToken') refreshToken: string
    ) {
        console.log(refreshToken)
        await this.authService.refreshToken(userId, refreshToken)
    }

}
