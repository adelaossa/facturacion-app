# Facturación App

Sistema de facturación basado en arquitectura de microservicios con NestJS, Kafka y PostgreSQL.

## Filosofía

El proyecto sigue un diseño de **monorepo** usando **npm workspaces**, donde la Gateway actúa como único punto de entrada HTTP (REST + Swagger) y delega todas las operaciones a microservicios especializados a través de un bus de eventos basado en **Apache Kafka**.

### Principios clave

- **Gateway única**: Toda la API HTTP pasa por `apps/gateway` en el puerto 3000. Los microservicios no exponen puertos propios.
- **Comunicación asíncrona**: Los microservicios se comunican exclusivamente a través de Kafka (`localhost:9092`) usando patrones de mensaje tipo `'verb-noun'` (ej. `'create-factura'`, `'find-one-cliente'`).
- **Bases de datos independientes**: Cada microservicio tiene su propio esquema PostgreSQL (`auth`, `clientes`, `productos`, `facturas`), con `synchronize: true` de TypeORM (sin migraciones).
- **Seguridad JWT**: Autenticación stateless vía JWT con roles (`admin`/`user`).
- **Desarrollo simple**: Kafka corre en modo KRaft (sin Zookeeper) en un único contenedor Docker. No hay tests, lint, ni CI.

## Estructura

```
facturacion-app/
├── apps/
│   ├── gateway/           # API HTTP (Express, puerto 3000)
│   ├── auth-service/      # Microservicio de autenticación (Kafka)
│   ├── clientes-service/  # Microservicio de clientes (Kafka)
│   ├── productos-service/ # Microservicio de productos (Kafka)
│   └── facturas-service/  # Microservicio de facturas (Kafka)
├── libs/
│   └── common/            # DTOs e interfaces compartidos
├── scripts/
│   ├── setup-kafka.js     # Creación proactiva de tópicos Kafka
│   └── seed-admin.js      # Script para crear usuario admin
├── docker-compose.yml     # PostgreSQL 16 + Kafka (KRaft)
└── package.json           # npm workspaces
```

## Comunicación Kafka

### Patrones de mensaje

Los microservicios usan strings simples como patrones:

```typescript
// Controller del microservicio
@MessagePattern('find-all-productos')
findAll() { ... }

// Controller del Gateway (HTTP)
return this.productosClient.send('find-all-productos', {});
```

### Reply topics

NestJS usa automáticamente tópicos con sufijo `.reply` para correlacionar requests y responses (ej. `find-all-productos.reply`). El script `setup-kafka.js` los crea proactivamente para evitar errores de carrera en KRaft.

### Serialización

El serializer por defecto de NestJS (`KafkaRequestSerializer`) usa `isPlainObject()` para decidir si aplica `JSON.stringify()`. Como TypeORM retorna instancias de clase, `isPlainObject()` retorna `false` y usa `toString()`, produciendo `"[object Object]"`.

**Solución**: Cada microservicio registra un `KafkaJsonSerializer` personalizado que usa `JSON.stringify()` para cualquier objeto, independientemente de si es instancia de clase o plain object.

```typescript
// main.ts de cada microservicio
const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  transport: Transport.KAFKA,
  options: {
    // ...
    serializer: new KafkaJsonSerializer(),
  },
});
```

## Requisitos

- Node.js 18+
- Docker + Docker Compose
- Kafka broker accesible en `localhost:9092`

## Inicio rápido

```bash
# 1. Levantar infraestructura (PostgreSQL + Kafka KRaft)
docker-compose up -d

# 2. Instalar dependencias
npm install

# 3. Compilar TypeScript
npm run build

# 4. Crear tópicos Kafka (incluyendo reply topics)
npm run setup:kafka

# 5. Iniciar todos los servicios
npm run start:all
```

### Swagger UI

Disponible en: `http://localhost:3000/api`

### Crear usuario admin

```bash
npm run seed:admin -- --nombre Admin --email admin@test.com --password admin123
```

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run build` | Compila todos los workspaces |
| `npm run build:gateway` | Compila solo el Gateway |
| `npm run build:auth` | Compila solo auth-service |
| `npm run build:clientes` | Compila solo clientes-service |
| `npm run build:productos` | Compila solo productos-service |
| `npm run build:facturas` | Compila solo facturas-service |
| `npm run start:all` | Inicia todos los servicios con delays entre ellos |
| `npm run stop:all` | Detiene todos los procesos Node.js |
| `npm run setup:kafka` | Crea los tópicos Kafka necesarios |
| `npm run seed:admin` | Crea un usuario admin en la base de datos |

## Decisiones arquitectónicas

### ¿Por qué Kafka en vez de TCP?

La migración de TCP a Kafka elimina la dependencia de puertos fijos (3001-3004), permite escalar consumidores horizontalmente y proporciona un bus de eventos robusto para desarrollo y producción.

### ¿Por qué KRaft en vez de Zookeeper?

Para desarrollo local, KRaft es más simple: un solo contenedor Kafka sin Zookeeper. Reduce la complejidad de infraestructura manteniendo toda la funcionalidad necesaria.

### ¿Por qué crear tópicos proactivamente?

Kafka en modo KRaft tiene `auto.create.topics.enable`, pero la creación es asíncrona. Cuando múltiples servicios NestJS se inician simultáneamente, intentan suscribirse a tópicos que aún no existen, generando errores de `UNKNOWN_TOPIC_OR_PARTITION` y `GroupCoordinator not available`. Crear los tópicos explícitamente antes de iniciar los servicios elimina esta carrera.

### ¿Por qué `KafkaJsonSerializer`?

Los microservicios usan TypeORM con `synchronize: true`. Las entidades retornadas por `repository.save()` o `repository.find()` son instancias de clase, no objetos planos. El serializer por defecto de NestJS no serializa instancias de clase correctamente a JSON para Kafka. `KafkaJsonSerializer` fuerza `JSON.stringify()` en todos los objetos no-primitivos.

### ¿Por qué no `transform: true` en `ValidationPipe`?

`ValidationPipe` con `transform: true` convierte los objetos planos del request HTTP en instancias de clase (ej. `new LoginDto()`). Estas instancias de clase luego pasan por el serializer Kafka y sufren el mismo problema de serialización que las entidades TypeORM. Eliminando `transform: true`, los DTOs permanecen como objetos planos que se serializan correctamente.

## Notas

- No hay tests (`jest`), lint (`eslint`), ni format (`prettier`).
- No hay CI/CD ni GitHub Actions.
- Las credenciales de PostgreSQL están hardcodeadas en cada `app.module.ts`.
- El secret JWT está hardcodeado en `apps/gateway/src/auth/auth.module.ts`.
