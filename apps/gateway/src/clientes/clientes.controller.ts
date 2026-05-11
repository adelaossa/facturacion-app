import { Controller, Get, Post, Put, Delete, Body, Param, Inject, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@ApiTags('Clientes')
@Controller('clientes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ClientesController {
  constructor(@Inject('CLIENTES_SERVICE') private clientesClient: ClientProxy) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los clientes' })
  findAll() {
    return this.clientesClient.send('find-all-clientes', {});
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un cliente por ID' })
  findOne(@Param('id') id: string) {
    return this.clientesClient.send('find-one-cliente', { id });
  }

  @Post()
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Crear un nuevo cliente' })
  create(@Body() dto: CreateClienteDto) {
    return this.clientesClient.send('create-cliente', dto);
  }

  @Put(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Actualizar un cliente' })
  update(@Param('id') id: string, @Body() dto: UpdateClienteDto) {
    return this.clientesClient.send('update-cliente', { id, data: dto });
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Eliminar un cliente' })
  remove(@Param('id') id: string) {
    return this.clientesClient.send('delete-cliente', { id });
  }
}