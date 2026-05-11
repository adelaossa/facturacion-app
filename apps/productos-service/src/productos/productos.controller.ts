import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductosService } from './productos.service';
import { ICreateProducto, IUpdateProducto } from '@facturacion/common';

@Controller()
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @MessagePattern('find-all-productos')
  findAll() {
    return this.productosService.findAll();
  }

  @MessagePattern('find-one-producto')
  findOne(@Payload() data: { id: string }) {
    return this.productosService.findOne(data.id);
  }

  @MessagePattern('create-producto')
  create(@Payload() data: ICreateProducto) {
    return this.productosService.create(data);
  }

  @MessagePattern('update-producto')
  update(@Payload() data: { id: string; data: IUpdateProducto }) {
    return this.productosService.update(data.id, data.data);
  }

  @MessagePattern('delete-producto')
  remove(@Payload() data: { id: string }) {
    return this.productosService.remove(data.id);
  }
}