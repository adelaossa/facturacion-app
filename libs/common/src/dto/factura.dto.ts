import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class LineaFacturaDto {
  @IsString()
  @IsNotEmpty()
  productoId: string;

  @IsNumber()
  @IsPositive()
  cantidad: number;

  @IsNumber()
  @IsPositive()
  precioUnitario: number;
}

export class CreateFacturaDto {
  @IsString()
  @IsNotEmpty()
  clienteId: string;

  @IsDateString()
  @IsOptional()
  fecha?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LineaFacturaDto)
  lineas: LineaFacturaDto[];

  @IsString()
  @IsOptional()
  observaciones?: string;
}

export class UpdateFacturaDto {
  @IsString()
  @IsOptional()
  clienteId?: string;

  @IsDateString()
  @IsOptional()
  fecha?: string;

  @IsString()
  @IsOptional()
  observaciones?: string;

  @IsString()
  @IsOptional()
  estado?: string;
}

export class FacturaResponseDto {
  id: string;
  numero: string;
  clienteId: string;
  fecha: Date;
  subtotal: number;
  iva: number;
  total: number;
  estado: string;
  observaciones?: string;
  lineas: any[];
  createdAt: Date;
  updatedAt: Date;
}