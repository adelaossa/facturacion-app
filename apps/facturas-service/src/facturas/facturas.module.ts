import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';
import { FacturasController } from './facturas.controller';
import { FacturasService } from './facturas.service';
import { Factura } from './entities/factura.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Factura]),
    ClientsModule.register([
      { name: 'CLIENTES_SERVICE', transport: Transport.NATS, options: { servers: ['nats://localhost:4222'] } },
      { name: 'PRODUCTOS_SERVICE', transport: Transport.NATS, options: { servers: ['nats://localhost:4222'] } },
    ]),
  ],
  controllers: [FacturasController],
  providers: [FacturasService],
  exports: [FacturasService],
})
export class FacturasModule {}