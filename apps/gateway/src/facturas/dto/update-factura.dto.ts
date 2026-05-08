import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IUpdateFactura } from '@facturacion/common';

export class UpdateFacturaDto implements IUpdateFactura {
  @ApiPropertyOptional({ example: 'uuid-del-cliente' })
  @IsString()
  @IsOptional()
  clienteId?: string;

  @ApiPropertyOptional({ example: '2026-05-08' })
  @IsDateString()
  @IsOptional()
  fecha?: string;

  @ApiPropertyOptional({ example: 'Observaciones actualizadas' })
  @IsString()
  @IsOptional()
  observaciones?: string;

  @ApiPropertyOptional({ example: 'pagada' })
  @IsString()
  @IsOptional()
  estado?: string;
}