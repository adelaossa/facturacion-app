import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const usuario = await this.usuarioRepository.findOne({ where: { email } });
    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, usuario.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: usuario.id, email: usuario.email };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
      },
    };
  }

  async register(nombre: string, email: string, password: string) {
    const existingUser = await this.usuarioRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const usuario = this.usuarioRepository.create({
      nombre,
      email,
      password: hashedPassword,
    });

    await this.usuarioRepository.save(usuario);

    const payload = { sub: usuario.id, email: usuario.email };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
      },
    };
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const usuario = await this.usuarioRepository.findOne({ where: { id: payload.sub } });
      if (!usuario) {
        throw new UnauthorizedException('Usuario no encontrado');
      }
      return {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
      };
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}