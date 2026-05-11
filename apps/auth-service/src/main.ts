import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { KafkaJsonSerializer } from './kafka-json.serializer';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'auth-service',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'auth-consumer',
      },
      serializer: new KafkaJsonSerializer(),
    },
  });
  await app.listen();
  console.log('Auth Service is running with Kafka');
}
bootstrap();