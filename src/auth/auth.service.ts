import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  // VALIDATE USER
  async validateUser(email: string, pass: string) {
    const user = await this.authRepository.findUserByEmail(email);
    if (user && (await argon2.verify(user.password, pass))) {
      return user;
    }
    return null;
  }

  // LOGIN
  async login(user: any) {
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.authRepository.saveRefreshToken(
      user.id,
      user.email,
      hashedRefreshToken,
    );

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return { accessToken, refreshToken, user: userData };
  }

  // REGISTER
  async register(name: string, email: string, password: string) {
    if (await this.authRepository.findUserByEmail(email)) {
      throw new Error('User already exists');
    }

    const hashedPassword = await argon2.hash(password);
    const newUser = await this.authRepository.createUser(
      name,
      email,
      hashedPassword,
    );

    return this.login(newUser);
  }

  // REFRESH TOKEN
  async refreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.authRepository.findUserById(decoded.id);
      if (!user) throw new UnauthorizedException('User not found');

      const tokenRecord = await this.authRepository.findTokenByUserId(user.id);
      if (!tokenRecord) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isValidToken = await argon2.verify(tokenRecord.token, refreshToken);
      if (!isValidToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (new Date(tokenRecord.expiresAt) < new Date()) {
        throw new UnauthorizedException('Refresh token has expired');
      }

      const newAccessToken = this.jwtService.sign(
        { id: user.id, email: user.email, role: user.role },
        { expiresIn: '1h' },
      );
      const newRefreshToken = this.jwtService.sign(
        { id: user.id, email: user.email, role: user.role },
        { expiresIn: '7d' },
      );

      const hashedNewRefreshToken = await argon2.hash(newRefreshToken);
      await this.authRepository.saveRefreshToken(
        user.id,
        user.email,
        hashedNewRefreshToken,
      );

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  // LOGOUT
  async logout(userId: string) {
    await this.authRepository.clearRefreshToken(userId);
  }
}
