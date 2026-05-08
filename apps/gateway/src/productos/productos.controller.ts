import { Controller, Get, Post, Put, Delete, Body, Param, Inject, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@ApiTags('Productos')
@Controller('productos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductosController {
  constructor(@Inject('PRODUCTOS_SERVICE') private productosClient: ClientProxy) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los productos' })
  findAll() {
    return this.productosClient.send({ cmd: 'find-all-productos' }, {});
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  findOne(@Param('id') id: string) {
    return this.productosClient.send({ cmd: 'find-one-producto' }, { id });
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  create(@Body() dto: CreateProductoDto) {
    return this.productosClient.send({ cmd: 'create-producto' }, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un producto' })
  update(@Param('id') id: string, @Body() dto: UpdateProductoDto) {
    return this.productosClient.send({ cmd: 'update-producto' }, { id, data: dto });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un producto' })
  remove(@Param('id') id: string) {
    return this.productosClient.send({ cmd: 'delete-producto' }, { id });
  }
}