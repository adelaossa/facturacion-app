import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
  ) {}

  async findAll() {
    return this.clienteRepository.find();
  }

  async findOne(id: string) {
    const cliente = await this.clienteRepository.findOne({ where: { id } });
    if (!cliente) {
      throw new NotFoundException(`Cliente ${id} no encontrado`);
    }
    return cliente;
  }

  async create(data: Partial<Cliente>) {
    const cliente = this.clienteRepository.create(data);
    return this.clienteRepository.save(cliente);
  }

  async update(id: string, data: Partial<Cliente>) {
    const cliente = await this.findOne(id);
    Object.assign(cliente, data);
    return this.clienteRepository.save(cliente);
  }

  async remove(id: string) {
    const cliente = await this.findOne(id);
    await this.clienteRepository.remove(cliente);
    return { deleted: true, id };
  }
}