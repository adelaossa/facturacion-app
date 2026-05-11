import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FacturasService } from './facturas.service';
import { ICreateFactura, IUpdateFactura } from '@facturacion/common';

@Controller()
export class FacturasController {
  constructor(private readonly facturasService: FacturasService) {}

  @MessagePattern('find-all-facturas')
  findAll() {
    return this.facturasService.findAll();
  }

  @MessagePattern('find-one-factura')
  findOne(@Payload() data: { id: string }) {
    return this.facturasService.findOne(data.id);
  }

  @MessagePattern('create-factura')
  create(@Payload() data: ICreateFactura) {
    return this.facturasService.create(data);
  }

  @MessagePattern('update-factura')
  update(@Payload() data: { id: string; data: IUpdateFactura }) {
    return this.facturasService.update(data.id, data.data);
  }

  @MessagePattern('delete-factura')
  remove(@Payload() data: { id: string }) {
    return this.facturasService.remove(data.id);
  }
}