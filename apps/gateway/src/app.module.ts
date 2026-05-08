import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth/auth.controller';
import { ClientesController } from './clientes/clientes.controller';
import { ProductosController } from './productos/productos.controller';
import { FacturasController } from './facturas/facturas.controller';

@Module({
  imports: [
    ClientsModule.register([
      { name: 'AUTH_SERVICE', transport: Transport.TCP, options: { host: 'localhost', port: 3001 } },
      { name: 'CLIENTES_SERVICE', transport: Transport.TCP, options: { host: 'localhost', port: 3002 } },
      { name: 'PRODUCTOS_SERVICE', transport: Transport.TCP, options: { host: 'localhost', port: 3003 } },
      { name: 'FACTURAS_SERVICE', transport: Transport.TCP, options: { host: 'localhost', port: 3004 } },
    ]),
    JwtModule.register({
      global: true,
      secret: 'facturacion-secret-key-2024',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController, ClientesController, ProductosController, FacturasController],
})
export class AppModule {}