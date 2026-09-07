import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthServiceService } from './auth-service.service.js';
import { LoginDto, RegisterDto } from '@app/common';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthServiceService) { }


  @Post('login')
  async login(@Body() body: LoginDto) {
    return await this.authServiceService.login(body);
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authServiceService.register(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req: { user: { userId: string } }) {
    return this.authServiceService.getProfile(req.user.userId)
  }
}
