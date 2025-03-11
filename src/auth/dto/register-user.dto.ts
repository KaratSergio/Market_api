import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: 'John Doe', description: 'User name' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'securePassword',
    description: 'Password',
    minLength: 4,
  })
  @IsNotEmpty()
  @MinLength(4)
  password: string;
}
