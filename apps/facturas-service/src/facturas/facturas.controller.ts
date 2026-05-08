import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FacturasService } from './facturas.service';
import { ICreateFactura, IUpdateFactura } from '@facturacion/common';

@Controller()
export class FacturasController {
  constructor(private readonly facturasService: FacturasService) {}

  @MessagePattern({ cmd: 'find-all-facturas' })
  findAll() {
    return this.facturasService.findAll();
  }

  @MessagePattern({ cmd: 'find-one-factura' })
  findOne(@Payload() data: { id: string }) {
    return this.facturasService.findOne(data.id);
  }

  @MessagePattern({ cmd: 'create-factura' })
  create(@Payload() data: ICreateFactura) {
    return this.facturasService.create(data);
  }

  @MessagePattern({ cmd: 'update-factura' })
  update(@Payload() data: { id: string; data: IUpdateFactura }) {
    return this.facturasService.update(data.id, data.data);
  }

  @MessagePattern({ cmd: 'delete-factura' })
  remove(@Payload() data: { id: string }) {
    return this.facturasService.remove(data.id);
  }
}