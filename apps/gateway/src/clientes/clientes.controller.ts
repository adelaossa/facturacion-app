import { Controller, Get, Post, Put, Delete, Body, Param, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('clientes')
export class ClientesController {
  constructor(@Inject('CLIENTES_SERVICE') private clientesClient: ClientProxy) {}

  @Get()
  findAll() {
    return this.clientesClient.send({ cmd: 'find-all-clientes' }, {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientesClient.send({ cmd: 'find-one-cliente' }, { id });
  }

  @Post()
  create(@Body() data: any) {
    return this.clientesClient.send({ cmd: 'create-cliente' }, data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.clientesClient.send({ cmd: 'update-cliente' }, { id, data });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientesClient.send({ cmd: 'delete-cliente' }, { id });
  }
}