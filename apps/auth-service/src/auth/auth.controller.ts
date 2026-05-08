import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { IAuthLogin, IAuthRegister } from '@facturacion/common';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'auth-login' })
  async login(@Payload() data: IAuthLogin) {
    return this.authService.login(data);
  }

  @MessagePattern({ cmd: 'auth-register' })
  async register(@Payload() data: IAuthRegister) {
    return this.authService.register(data);
  }

  @MessagePattern({ cmd: 'auth-validate' })
  async validateToken(@Payload() data: { token: string }) {
    return this.authService.validateToken(data.token);
  }
}