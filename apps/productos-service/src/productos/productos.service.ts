import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { ICreateProducto, IUpdateProducto } from '@facturacion/common';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
  ) {}

  async findAll() {
    return this.productoRepository.find();
  }

  async findOne(id: string) {
    const producto = await this.productoRepository.findOne({ where: { id } });
    if (!producto) {
      throw new NotFoundException(`Producto ${id} no encontrado`);
    }
    return producto;
  }

  async create(data: ICreateProducto): Promise<Producto> {
    const producto = this.productoRepository.create(data as Partial<Producto>);
    return await this.productoRepository.save(producto);
  }

  async update(id: string, data: IUpdateProducto): Promise<Producto> {
    const producto = await this.findOne(id);
    Object.assign(producto, data);
    return await this.productoRepository.save(producto);
  }

  async remove(id: string) {
    const producto = await this.findOne(id);
    await this.productoRepository.remove(producto);
    return { deleted: true, id };
  }
}