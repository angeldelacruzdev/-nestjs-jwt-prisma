import { AuthService } from './auth.service';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from './dto';
import { Tokens } from './types';

@Controller({
    path: 'auth',
    version: '1',
})
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('signup')
    async signup(@Body() dto: AuthDto): Promise<Tokens> {
        return await this.authService.signup(dto)
    }

    @Post('signin')
    async signin() {
        await this.authService.signin()
    }

    @Post('logout')
    async logout() {
        await this.authService.logout()
    }

    @Post('refresh-token')
    async refreshToken() {
        await this.authService.refreshToken()
    }

}
