import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Factura } from './entities/factura.entity';

@Injectable()
export class FacturasService {
  constructor(
    @InjectRepository(Factura)
    private facturaRepository: Repository<Factura>,
    @Inject('CLIENTES_SERVICE')
    private clientesClient: ClientProxy,
    @Inject('PRODUCTOS_SERVICE')
    private productosClient: ClientProxy,
  ) {}

  async findAll() {
    return this.facturaRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const factura = await this.facturaRepository.findOne({ where: { id } });
    if (!factura) {
      throw new NotFoundException(`Factura ${id} no encontrada`);
    }
    return factura;
  }

  async create(data: any) {
    try {
      const cliente = await this.clientesClient.send({ cmd: 'find-one-cliente' }, { id: data.clienteId }).toPromise();
      if (!cliente) {
        throw new NotFoundException('Cliente no encontrado');
      }
    } catch (e) {
      throw new NotFoundException('Cliente no encontrado');
    }

    let subtotal = 0;
    for (const linea of data.lineas) {
      try {
        const producto = await this.productosClient.send({ cmd: 'find-one-producto' }, { id: linea.productoId }).toPromise();
        if (!producto) {
          throw new NotFoundException(`Producto ${linea.productoId} no encontrado`);
        }
        subtotal += linea.cantidad * linea.precioUnitario;
      } catch (e) {
        throw new NotFoundException(`Producto ${linea.productoId} no encontrado`);
      }
    }

    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    const numero = await this.generarNumeroFactura();

    const factura = this.facturaRepository.create({
      numero,
      clienteId: data.clienteId,
      fecha: data.fecha ? new Date(data.fecha) : new Date(),
      lineas: data.lineas,
      subtotal,
      iva,
      total,
      estado: 'emitida',
      observaciones: data.observaciones,
    });

    return this.facturaRepository.save(factura);
  }

  async update(id: string, data: any) {
    const factura = await this.findOne(id);
    Object.assign(factura, data);
    return this.facturaRepository.save(factura);
  }

  async remove(id: string) {
    const factura = await this.findOne(id);
    await this.facturaRepository.remove(factura);
    return { deleted: true, id };
  }

  private async generarNumeroFactura(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.facturaRepository.count();
    return `FAC-${year}-${String(count + 1).padStart(5, '0')}`;
  }
}