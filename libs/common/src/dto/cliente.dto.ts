import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  rfc: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsOptional()
  direccion?: string;
}

export class UpdateClienteDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  rfc?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsString()
  @IsOptional()
  direccion?: string;
}

export class ClienteResponseDto {
  id: string;
  nombre: string;
  rfc: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  createdAt: Date;
  updatedAt: Date;
}