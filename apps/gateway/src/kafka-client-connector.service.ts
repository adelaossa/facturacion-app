import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class KafkaClientConnector implements OnModuleInit {
  constructor(
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
    @Inject('CLIENTES_SERVICE') private clientesClient: ClientProxy,
    @Inject('PRODUCTOS_SERVICE') private productosClient: ClientProxy,
    @Inject('FACTURAS_SERVICE') private facturasClient: ClientProxy,
  ) {}

  async onModuleInit() {
    // Pre-subscribe all reply topics before connect()
    this.subscribeToResponseOf(this.authClient, [
      'auth-login',
      'auth-register',
    ]);
    this.subscribeToResponseOf(this.clientesClient, [
      'find-all-clientes',
      'find-one-cliente',
      'create-cliente',
      'update-cliente',
      'delete-cliente',
    ]);
    this.subscribeToResponseOf(this.productosClient, [
      'find-all-productos',
      'find-one-producto',
      'create-producto',
      'update-producto',
      'delete-producto',
    ]);
    this.subscribeToResponseOf(this.facturasClient, [
      'find-all-facturas',
      'find-one-factura',
      'create-factura',
      'update-factura',
      'delete-factura',
    ]);

    await Promise.all([
      this.authClient.connect(),
      this.clientesClient.connect(),
      this.productosClient.connect(),
      this.facturasClient.connect(),
    ]);

    // Wait for GROUP_JOIN and partition assignments
    await Promise.all([
      this.waitForAssignments(this.authClient, ['auth-login', 'auth-register']),
      this.waitForAssignments(this.clientesClient, [
        'find-all-clientes',
        'find-one-cliente',
        'create-cliente',
        'update-cliente',
        'delete-cliente',
      ]),
      this.waitForAssignments(this.productosClient, [
        'find-all-productos',
        'find-one-producto',
        'create-producto',
        'update-producto',
        'delete-producto',
      ]),
      this.waitForAssignments(this.facturasClient, [
        'find-all-facturas',
        'find-one-factura',
        'create-factura',
        'update-factura',
        'delete-factura',
      ]),
    ]);

    console.log('All Kafka clients connected and reply topics assigned');
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
