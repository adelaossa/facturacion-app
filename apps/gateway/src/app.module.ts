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
      { name: 'AUTH_SERVICE', transport: Transport.NATS, options: { servers: ['nats://localhost:4222'] } },
      { name: 'CLIENTES_SERVICE', transport: Transport.NATS, options: { servers: ['nats://localhost:4222'] } },
      { name: 'PRODUCTOS_SERVICE', transport: Transport.NATS, options: { servers: ['nats://localhost:4222'] } },
      { name: 'FACTURAS_SERVICE', transport: Transport.NATS, options: { servers: ['nats://localhost:4222'] } },
    ]),
  ],
  controllers: [AuthController, ClientesController, ProductosController, FacturasController],
})
export class AppModule {}