const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'topic-setup',
  brokers: ['localhost:9092'],
});

const admin = kafka.admin();

const requestTopics = [
  'auth-login',
  'auth-register',
  'auth-validate',
  'find-all-clientes',
  'find-one-cliente',
  'create-cliente',
  'update-cliente',
  'delete-cliente',
  'find-all-productos',
  'find-one-producto',
  'create-producto',
  'update-producto',
  'delete-producto',
  'find-all-facturas',
  'find-one-factura',
  'create-factura',
  'update-factura',
  'delete-factura',
];

// Reply topics used by NestJS ClientKafka for request/response
const replyTopics = requestTopics.map((t) => `${t}.reply`);
const allTopics = [...requestTopics, ...replyTopics];

async function setup() {
  console.log('Waiting for Kafka to be ready...');

  let connected = false;
  for (let i = 0; i < 30; i++) {
    try {
      await admin.connect();
      connected = true;
      break;
    } catch (e) {
      process.stdout.write('.');
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  if (!connected) {
    console.error('\nCould not connect to Kafka after 30 attempts');
    process.exit(1);
  }

  console.log('\nConnected to Kafka');

  const existingTopics = await admin.listTopics();
  const topicsToCreate = allTopics.filter((t) => !existingTopics.includes(t));

  if (topicsToCreate.length > 0) {
    console.log('Creating topics:', topicsToCreate.join(', '));
    await admin.createTopics({
      topics: topicsToCreate.map((topic) => ({
        topic,
        numPartitions: 1,
        replicationFactor: 1,
      })),
    });
    console.log('Topics created successfully');
  } else {
    console.log('All topics already exist');
  }

  console.log('Waiting for GroupCoordinator to be ready...');
  await new Promise((r) => setTimeout(r, 5000));

  await admin.disconnect();
  console.log('Kafka setup complete');
}

setup().catch((err) => {
  console.error(err);
  process.exit(1);
});
