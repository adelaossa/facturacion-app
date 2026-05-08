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
      { name: 'CLIENTES_SERVICE', transport: Transport.TCP, options: { host: 'localhost', port: 3002 } },
      { name: 'PRODUCTOS_SERVICE', transport: Transport.TCP, options: { host: 'localhost', port: 3003 } },
    ]),
  ],
  controllers: [FacturasController],
  providers: [FacturasService],
  exports: [FacturasService],
})
export class FacturasModule {}