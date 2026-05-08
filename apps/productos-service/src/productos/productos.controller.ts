import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductosService } from './productos.service';
import { ICreateProducto, IUpdateProducto } from '@facturacion/common';

@Controller()
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @MessagePattern({ cmd: 'find-all-productos' })
  findAll() {
    return this.productosService.findAll();
  }

  @MessagePattern({ cmd: 'find-one-producto' })
  findOne(@Payload() data: { id: string }) {
    return this.productosService.findOne(data.id);
  }

  @MessagePattern({ cmd: 'create-producto' })
  create(@Payload() data: ICreateProducto) {
    return this.productosService.create(data);
  }

  @MessagePattern({ cmd: 'update-producto' })
  update(@Payload() data: { id: string; data: IUpdateProducto }) {
    return this.productosService.update(data.id, data.data);
  }

  @MessagePattern({ cmd: 'delete-producto' })
  remove(@Payload() data: { id: string }) {
    return this.productosService.remove(data.id);
  }
}