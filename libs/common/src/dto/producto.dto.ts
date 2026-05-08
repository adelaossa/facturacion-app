import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, IsBoolean } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @IsPositive()
  precio: number;

  @IsString()
  @IsOptional()
  unidad?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}

export class UpdateProductoDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  precio?: number;

  @IsString()
  @IsOptional()
  unidad?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}

export class ProductoResponseDto {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  unidad?: string;
  stock: number;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}