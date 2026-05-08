import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'auth-login' })
  async login(@Payload() data: { email: string; password: string }) {
    return this.authService.login(data.email, data.password);
  }

  @MessagePattern({ cmd: 'auth-register' })
  async register(@Payload() data: { nombre: string; email: string; password: string }) {
    return this.authService.register(data.nombre, data.email, data.password);
  }

  @MessagePattern({ cmd: 'auth-validate' })
  async validateToken(@Payload() data: { token: string }) {
    return this.authService.validateToken(data.token);
  }
}