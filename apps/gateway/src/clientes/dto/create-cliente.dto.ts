import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ICreateCliente } from '@facturacion/common';

export class CreateClienteDto implements ICreateCliente {
  @ApiProperty({ example: 'Empresa ABC' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'ABC123456' })
  @IsString()
  @IsNotEmpty()
  rfc: string;

  @ApiPropertyOptional({ example: 'contacto@empresa.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: '5551234567' })
  @IsString()
  @IsOptional()
  telefono?: string;

  @ApiPropertyOptional({ example: 'Calle Principal 123' })
  @IsString()
  @IsOptional()
  direccion?: string;
}