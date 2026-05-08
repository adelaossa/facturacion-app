import { IsString, IsOptional, IsNumber, IsPositive, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IUpdateProducto } from '@facturacion/common';

export class UpdateProductoDto implements IUpdateProducto {
  @ApiPropertyOptional({ example: 'Laptop Dell XPS 15' })
  @IsString()
  @IsOptional()
  nombre?: string;

  @ApiPropertyOptional({ example: 'Laptop 15 pulgadas' })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiPropertyOptional({ example: 25000 })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  precio?: number;

  @ApiPropertyOptional({ example: 'pieza' })
  @IsString()
  @IsOptional()
  unidad?: string;

  @ApiPropertyOptional({ example: 10 })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}