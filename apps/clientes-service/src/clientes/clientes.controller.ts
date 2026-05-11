import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ClientesService } from './clientes.service';
import { ICreateCliente, IUpdateCliente } from '@facturacion/common';

@Controller()
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @MessagePattern('find-all-clientes')
  findAll() {
    return this.clientesService.findAll();
  }

  @MessagePattern('find-one-cliente')
  findOne(@Payload() data: { id: string }) {
    return this.clientesService.findOne(data.id);
  }

  @MessagePattern('create-cliente')
  create(@Payload() data: ICreateCliente) {
    return this.clientesService.create(data);
  }

  @MessagePattern('update-cliente')
  update(@Payload() data: { id: string; data: IUpdateCliente }) {
    return this.clientesService.update(data.id, data.data);
  }

  @MessagePattern('delete-cliente')
  remove(@Payload() data: { id: string }) {
    return this.clientesService.remove(data.id);
  }
}