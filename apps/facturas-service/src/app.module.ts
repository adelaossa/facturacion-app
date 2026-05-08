import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { FacturasModule } from './facturas/facturas.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'facturacion',
      password: 'facturacion123',
      database: 'facturacion',
      schema: 'facturas',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ClientsModule.register([
      { name: 'CLIENTES_SERVICE', transport: Transport.TCP, options: { host: 'localhost', port: 3002 } },
      { name: 'PRODUCTOS_SERVICE', transport: Transport.TCP, options: { host: 'localhost', port: 3003 } },
    ]),
    FacturasModule,
  ],
})
export class AppModule {}