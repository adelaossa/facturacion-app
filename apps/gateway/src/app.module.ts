import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { ClientesController } from './clientes/clientes.controller';
import { ProductosController } from './productos/productos.controller';
import { FacturasController } from './facturas/facturas.controller';
import { KafkaClientConnector } from './kafka-client-connector.service';

@Module({
  imports: [
    AuthModule,
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'gateway',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'auth-gateway-consumer',
          },
        },
      },
      {
        name: 'CLIENTES_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'gateway',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'clientes-gateway-consumer',
          },
        },
      },
      {
        name: 'PRODUCTOS_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'gateway',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'productos-gateway-consumer',
          },
        },
      },
      {
        name: 'FACTURAS_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'gateway',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'facturas-gateway-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [AuthController, ClientesController, ProductosController, FacturasController],
  providers: [KafkaClientConnector],
})
export class AppModule {}