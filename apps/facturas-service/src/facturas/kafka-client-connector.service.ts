import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class KafkaClientConnector implements OnModuleInit {
  constructor(
    @Inject('CLIENTES_SERVICE') private clientesClient: ClientProxy,
    @Inject('PRODUCTOS_SERVICE') private productosClient: ClientProxy,
  ) {}

  async onModuleInit() {
    // Pre-subscribe all reply topics before connect()
    this.subscribeToResponseOf(this.clientesClient, ['find-one-cliente']);
    this.subscribeToResponseOf(this.productosClient, ['find-one-producto']);

    await Promise.all([
      this.clientesClient.connect(),
      this.productosClient.connect(),
    ]);

    // Wait for GROUP_JOIN and partition assignments
    await Promise.all([
      this.waitForAssignments(this.clientesClient, ['find-one-cliente']),
      this.waitForAssignments(this.productosClient, ['find-one-producto']),
    ]);

    console.log('Facturas service Kafka clients connected and reply topics assigned');
  }

  private subscribeToResponseOf(client: ClientProxy, patterns: string[]) {
    const kafkaClient = client as any;
    if (typeof kafkaClient.subscribeToResponseOf === 'function') {
      for (const pattern of patterns) {
        kafkaClient.subscribeToResponseOf(pattern);
      }
    }
  }

  private async waitForAssignments(client: ClientProxy, patterns: string[]) {
    const kafkaClient = client as any;
    if (!kafkaClient.consumerAssignments) return;

    const replyTopics = patterns.map((p) => `${p}.reply`);
    const maxWait = 30000;
    const start = Date.now();

    while (Date.now() - start < maxWait) {
      const assignments = kafkaClient.consumerAssignments || {};
      const allAssigned = replyTopics.every(
        (topic) => topic in assignments && assignments[topic] !== undefined,
      );
      if (allAssigned) {
        return;
      }
      await new Promise((r) => setTimeout(r, 300));
    }

    console.warn('Timeout waiting for Kafka reply topic assignments');
  }
}
