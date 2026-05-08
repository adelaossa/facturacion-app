import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private authClient: ClientProxy) {}

  @Post('login')
  async login(@Body() data: { email: string; password: string }) {
    return this.authClient.send({ cmd: 'auth-login' }, data);
  }

  @Post('register')
  async register(@Body() data: { nombre: string; email: string; password: string }) {
    return this.authClient.send({ cmd: 'auth-register' }, data);
  }
}