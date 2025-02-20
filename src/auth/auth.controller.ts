import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { RequestWithUser } from '@common/interfaces/request.interface';
import { LocalAuthGuard } from './jwt/local-auth.guard';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: RequestWithUser, @Res() res: Response) {
    const { accessToken, refreshToken, user } = await this.authService.login(
      req.user,
    );

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/auth/refresh',
    });

    return res.json({ accessToken, user });
  }

  @Post('register')
  async register(@Body() body, @Res() res: Response) {
    const { name, email, password } = body;
    const { accessToken, refreshToken, user } = await this.authService.register(
      name,
      email,
      password,
    );

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/auth/refresh',
    });

    return res.json({ accessToken, user });
  }

  @Post('refresh')
  async refresh(@Req() req: RequestWithUser, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) throw new UnauthorizedException('No refresh token');

    const {
      accessToken,
      refreshToken: newRefreshToken,
      user,
    } = await this.authService.refreshToken(refreshToken);

    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/auth/refresh',
    });

    return res.json({ accessToken, user });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: RequestWithUser, @Res() res: Response) {
    await this.authService.logout(req.user.id);
    res.clearCookie('refresh_token', { path: '/auth/refresh' });
    return res.json({ message: 'Logged out' });
  }
}
