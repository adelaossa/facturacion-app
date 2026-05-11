import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
    FacturasModule,
  ],
})
export class AppModule {}