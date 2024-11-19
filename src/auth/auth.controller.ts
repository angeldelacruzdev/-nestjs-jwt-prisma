import { AuthService } from './auth.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthDto, SigninDto } from './dto';
import { Tokens } from './types';
import { AtGuard } from './guards';
import { RtGuard } from './guards/rt-guards';
import { GetCurrentUser, GetCurrentUserId, GetRefreshToken, Public } from './decorators';

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
    async signin(@Body() dto: SigninDto) {
        return await this.authService.signin(dto)
    }

    @UseGuards(AtGuard)
    @Post('logout')
    async logout(@GetCurrentUserId() userId: number) {
        const result = await this.authService.logout(userId);
        return result
    }


    @Public()
    @UseGuards(RtGuard)
    @Post('refresh')
    async refreshToken(
        @GetCurrentUserId() userId: number,
        @GetRefreshToken() refreshToken: string
    ) {
        return await this.authService.refreshToken(userId, refreshToken)
    }

}
