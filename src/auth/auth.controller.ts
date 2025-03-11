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
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in',
    type: Object,
  })
  @ApiBody({
    description: 'User login credentials',
    type: LoginUserDto,
  })
  @Post('login')
  async login(@Req() req: RequestWithUser, @Res() res: Response) {
    const { accessToken, refreshToken, user } = await this.authService.login(
      req.user,
    );

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/auth/refresh',
    });

    return res.json({ accessToken, user });
  }

  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: 201,
    description: 'Successfully registered',
    type: Object,
  })
  @Post('register')
  async register(@Body() body: RegisterUserDto, @Res() res: Response) {
    const { email, password, name } = body;
    const { accessToken, refreshToken, user } = await this.authService.register(
      name,
      email,
      password,
    );

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/auth/refresh',
    });

    return res.json({ accessToken, user });
  }

  @ApiOperation({ summary: 'Refresh user access token' })
  @ApiResponse({
    status: 200,
    description: 'Successfully refreshed token',
    type: Object,
  })
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
      secure: true,
      sameSite: 'lax',
      path: '/auth/refresh',
    });

    return res.json({ accessToken, user });
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Successfully logged out' })
  @Post('logout')
  async logout(@Req() req: RequestWithUser, @Res() res: Response) {
    await this.authService.logout(req.user.id);
    res.clearCookie('refresh_token', { path: '/auth/refresh' });
    return res.json({ message: 'Logged out' });
  }
}
