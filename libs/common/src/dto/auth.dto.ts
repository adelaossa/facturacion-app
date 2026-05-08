import { IsString, IsNotEmpty, MinLength, IsEmail } from 'class-validator';

export class AuthLoginDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AuthRegisterDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class AuthResponseDto {
  accessToken: string;
  user: {
    id: string;
    email: string;
    nombre: string;
  };
}

export class PayloadJwtDto {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}