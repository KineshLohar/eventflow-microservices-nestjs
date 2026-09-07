import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginDto, RegisterDto } from '@app/common';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @Post('register')
    async register(@Body() body: RegisterDto){
        return this.authService.register(body)
    }

    @Post('login')
    async login(@Body() body: LoginDto){
        return this.authService.login(body);
    }

    @Get('profile')
    getProfile(@Headers("authorization") authorization: string){
        return this.authService.getProfile(authorization)
    }

}
