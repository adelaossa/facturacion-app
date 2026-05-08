import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'facturacion',
      password: 'facturacion123',
      database: 'facturacion',
      schema: 'auth',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    JwtModule.register({
      global: true,
      secret: 'facturacion-secret-key-2024',
      signOptions: { expiresIn: '7d' },
    }),
    AuthModule,
  ],
})
export class AppModule {}