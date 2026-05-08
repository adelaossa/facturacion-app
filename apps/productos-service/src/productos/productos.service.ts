import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';

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

  async create(data: Partial<Producto>) {
    const producto = this.productoRepository.create(data);
    return this.productoRepository.save(producto);
  }

  async update(id: string, data: Partial<Producto>) {
    const producto = await this.findOne(id);
    Object.assign(producto, data);
    return this.productoRepository.save(producto);
  }

  async remove(id: string) {
    const producto = await this.findOne(id);
    await this.productoRepository.remove(producto);
    return { deleted: true, id };
  }
}