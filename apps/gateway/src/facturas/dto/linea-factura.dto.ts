import { IsString, IsNotEmpty, IsNumber, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ILineaFactura } from '@facturacion/common';

export class LineaFacturaDto implements ILineaFactura {
  @ApiProperty({ example: 'uuid-del-producto' })
  @IsString()
  @IsNotEmpty()
  productoId: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsPositive()
  cantidad: number;

  @ApiProperty({ example: 25000 })
  @IsNumber()
  @IsPositive()
  precioUnitario: number;
}