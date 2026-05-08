import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IUpdateCliente } from '@facturacion/common';

export class UpdateClienteDto implements IUpdateCliente {
  @ApiPropertyOptional({ example: 'Empresa ABC' })
  @IsString()
  @IsOptional()
  nombre?: string;

  @ApiPropertyOptional({ example: 'ABC123456' })
  @IsString()
  @IsOptional()
  rfc?: string;

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