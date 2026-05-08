import { IsString, IsNotEmpty, IsOptional, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ICreateFactura } from '@facturacion/common';
import { LineaFacturaDto } from './linea-factura.dto';

export class CreateFacturaDto implements ICreateFactura {
  @ApiProperty({ example: 'uuid-del-cliente' })
  @IsString()
  @IsNotEmpty()
  clienteId: string;

  @ApiPropertyOptional({ example: '2026-05-08' })
  @IsDateString()
  @IsOptional()
  fecha?: string;

  @ApiProperty({ type: [LineaFacturaDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LineaFacturaDto)
  lineas: LineaFacturaDto[];

  @ApiPropertyOptional({ example: 'Factura de prueba' })
  @IsString()
  @IsOptional()
  observaciones?: string;
}