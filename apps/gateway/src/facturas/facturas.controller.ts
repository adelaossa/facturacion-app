import { Controller, Get, Post, Put, Delete, Body, Param, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('facturas')
export class FacturasController {
  constructor(@Inject('FACTURAS_SERVICE') private facturasClient: ClientProxy) {}

  @Get()
  findAll() {
    return this.facturasClient.send({ cmd: 'find-all-facturas' }, {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.facturasClient.send({ cmd: 'find-one-factura' }, { id });
  }

  @Post()
  create(@Body() data: any) {
    return this.facturasClient.send({ cmd: 'create-factura' }, data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.facturasClient.send({ cmd: 'update-factura' }, { id, data });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.facturasClient.send({ cmd: 'delete-factura' }, { id });
  }
}