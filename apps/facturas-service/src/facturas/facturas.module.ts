import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FacturasController } from './facturas.controller';
import { FacturasService } from './facturas.service';
import { Factura } from './entities/factura.entity';
import { KafkaClientConnector } from './kafka-client-connector.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Factura]),
    ClientsModule.register([
      {
        name: 'CLIENTES_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'facturas-service-clientes',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'facturas-clientes-consumer',
          },
        },
      },
      {
        name: 'PRODUCTOS_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'facturas-service-productos',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'facturas-productos-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [FacturasController],
  providers: [FacturasService, KafkaClientConnector],
  exports: [FacturasService],
})
export class FacturasModule {}