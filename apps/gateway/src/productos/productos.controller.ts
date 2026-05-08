import { Controller, Get, Post, Put, Delete, Body, Param, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('productos')
export class ProductosController {
  constructor(@Inject('PRODUCTOS_SERVICE') private productosClient: ClientProxy) {}

  @Get()
  findAll() {
    return this.productosClient.send({ cmd: 'find-all-productos' }, {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productosClient.send({ cmd: 'find-one-producto' }, { id });
  }

  @Post()
  create(@Body() data: any) {
    return this.productosClient.send({ cmd: 'create-producto' }, data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.productosClient.send({ cmd: 'update-producto' }, { id, data });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productosClient.send({ cmd: 'delete-producto' }, { id });
  }
}