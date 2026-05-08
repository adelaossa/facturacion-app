import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { ICreateCliente, IUpdateCliente } from '@facturacion/common';

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

  async create(data: ICreateCliente): Promise<Cliente> {
    const cliente = this.clienteRepository.create(data as Partial<Cliente>);
    return await this.clienteRepository.save(cliente);
  }

  async update(id: string, data: IUpdateCliente): Promise<Cliente> {
    const cliente = await this.findOne(id);
    Object.assign(cliente, data);
    return await this.clienteRepository.save(cliente);
  }

  async remove(id: string) {
    const cliente = await this.findOne(id);
    await this.clienteRepository.remove(cliente);
    return { deleted: true, id };
  }
}