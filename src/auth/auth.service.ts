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

  async validateUser(email: string, pass: string) {
    const user = await this.authRepository.findUserByEmail(email);
    if (user && (await argon2.verify(user.password, pass))) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.authRepository.saveRefreshToken(user.id, hashedRefreshToken);

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return { accessToken, refreshToken, user: userData };
  }

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

  async refreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken);
      const user = await this.authRepository.findUserById(decoded.id);

      if (!user || !user.refreshToken)
        throw new UnauthorizedException('Invalid token');

      const isValid = await argon2.verify(user.refreshToken, refreshToken);
      if (!isValid) throw new UnauthorizedException('Invalid token');

      if (decoded.exp < Date.now() / 1000) {
        throw new UnauthorizedException('Token has expired');
      }

      return this.login(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async logout(userId: string) {
    await this.authRepository.clearRefreshToken(userId);
  }
}
