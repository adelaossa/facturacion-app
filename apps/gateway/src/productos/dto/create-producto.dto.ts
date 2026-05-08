import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ICreateProducto } from '@facturacion/common';

export class CreateProductoDto implements ICreateProducto {
  @ApiProperty({ example: 'Laptop Dell XPS 15' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiPropertyOptional({ example: 'Laptop 15 pulgadas' })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiProperty({ example: 25000 })
  @IsNumber()
  @IsPositive()
  precio: number;

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