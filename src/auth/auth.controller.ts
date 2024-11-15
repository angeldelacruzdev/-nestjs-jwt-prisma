import { AuthService } from './auth.service';
import { Controller, Post } from '@nestjs/common';

@Controller({
    path: 'auth',
    version: '1',
})
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('signup')
    async signup() {
        await this.authService.signup()
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
