import { Controller, Get, Post, Put, Delete, Body, Param, Inject, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';

@ApiTags('Facturas')
@Controller('facturas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FacturasController {
  constructor(@Inject('FACTURAS_SERVICE') private facturasClient: ClientProxy) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las facturas' })
  findAll() {
    return this.facturasClient.send({ cmd: 'find-all-facturas' }, {});
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una factura por ID' })
  findOne(@Param('id') id: string) {
    return this.facturasClient.send({ cmd: 'find-one-factura' }, { id });
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva factura' })
  create(@Body() dto: CreateFacturaDto) {
    return this.facturasClient.send({ cmd: 'create-factura' }, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una factura' })
  update(@Param('id') id: string, @Body() dto: UpdateFacturaDto) {
    return this.facturasClient.send({ cmd: 'update-factura' }, { id, data: dto });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una factura' })
  remove(@Param('id') id: string) {
    return this.facturasClient.send({ cmd: 'delete-factura' }, { id });
  }
}