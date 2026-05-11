import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { ClientesController } from './clientes/clientes.controller';
import { ProductosController } from './productos/productos.controller';
import { FacturasController } from './facturas/facturas.controller';

@Module({
  imports: [
    AuthModule,
    ClientsModule.register([
      { name: 'AUTH_SERVICE', transport: Transport.RMQ, options: { urls: ['amqp://localhost:5672'], queue: 'auth_queue', queueOptions: { durable: false } } },
      { name: 'CLIENTES_SERVICE', transport: Transport.RMQ, options: { urls: ['amqp://localhost:5672'], queue: 'clientes_queue', queueOptions: { durable: false } } },
      { name: 'PRODUCTOS_SERVICE', transport: Transport.RMQ, options: { urls: ['amqp://localhost:5672'], queue: 'productos_queue', queueOptions: { durable: false } } },
      { name: 'FACTURAS_SERVICE', transport: Transport.RMQ, options: { urls: ['amqp://localhost:5672'], queue: 'facturas_queue', queueOptions: { durable: false } } },
    ]),
  ],
  controllers: [AuthController, ClientesController, ProductosController, FacturasController],
})
export class AppModule {}