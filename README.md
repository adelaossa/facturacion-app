# Facturación App

Sistema de facturación construido con una arquitectura de microservicios sobre NestJS y RabbitMQ.

## Filosofía

Cada dominio de negocio (autenticación, clientes, productos, facturas) es un microservicio independiente con su propio esquema de base de datos y su propia cola de mensajes. Se comunican exclusivamente a través de RabbitMQ usando el patrón request-response (`{ cmd: 'verb-noun' }`). No hay acoplamiento directo entre servicios: ninguno conoce la ubicación ni los detalles internos de los demás.

Un solo punto de entrada HTTP (el Gateway) expone la API REST y delega toda la lógica a los microservicios. Esto permite escalar, reemplazar o modificar cada servicio sin afectar al resto.

## Stack

| Capa | Tecnología |
|---|---|
| Runtime | Node.js |
| Framework | NestJS v10 |
| Lenguaje | TypeScript |
| Mensajería | RabbitMQ 3 |
| Base de datos | PostgreSQL 16 |
| ORM | TypeORM (`synchronize: true`) |
| Autenticación | JWT + Passport + bcrypt |
| Documentación | Swagger (OpenAPI) |
| Infraestructura | Docker Compose |
| Monorepo | npm workspaces |

## Arquitectura

```
┌──────────────────────────────────────────────────────────┐
│                    GATEWAY (:3000)                        │
│                  HTTP + Swagger                           │
│       JWT Auth · RolesGuard · ValidationPipe              │
└──────┬──────────┬────────────┬────────────┬──────────────┘
       │RMQ       │RMQ         │RMQ         │RMQ
       ▼          ▼            ▼            ▼
┌──────────┐┌──────────┐┌──────────┐┌──────────────┐
│   AUTH   ││ CLIENTES ││PRODUCTOS ││   FACTURAS   │
│auth_queue││clientes_ ││productos_││ facturas_    │
│          ││  queue   ││  queue   ││   queue      │
│          ││          ││          ││              │
│ schema:  ││ schema:  ││ schema:  ││ schema:       │
│  auth    ││ clientes ││productos ││  facturas    │
└──────────┘└──────────┘└──────────┘│              │
                                    │  cliente de──┼──► CLIENTES
                                    │  cliente de──┼──► PRODUCTOS
                                    └──────────────┘
```

- **Gateway** recibe peticiones HTTP, valida DTOs, verifica JWT y roles, y reenvía al microservicio correspondiente.
- **Auth Service** gestiona registro, login y validación de tokens. Es el único que conoce la entidad `Usuario`.
- **Clientes Service** y **Productos Service** son CRUDs independientes con sus propios esquemas.
- **Facturas Service** es el único servicio que consume otros servicios: al crear una factura valida que el cliente y los productos existan consultando a `CLIENTES_SERVICE` y `PRODUCTOS_SERVICE`.

## Requisitos

- Node.js 18+
- Docker y Docker Compose

## Instalación y arranque

```bash
# 1. Infraestructura
docker-compose up -d

# 2. Esperar que RabbitMQ esté listo (~10 segundos)
sleep 10

# 3. Instalar dependencias
npm install

# 4. Compilar
npm run build

# 5. Crear usuario administrador
npm run seed:admin -- --nombre "Admin" --email admin@test.com --password secret123

# 6. Arrancar todos los servicios
npm run start:all
```

La API queda disponible en `http://localhost:3000` y Swagger en `http://localhost:3000/api`.

RabbitMQ Management UI en `http://localhost:15672` (guest/guest).

## API REST

### Auth

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/auth/register` | Pública | Registrar usuario |
| `POST` | `/auth/login` | Pública | Iniciar sesión (devuelve JWT) |

### Productos

| Método | Ruta | Auth | Rol |
|---|---|---|---|
| `GET` | `/productos` | Pública | — |
| `GET` | `/productos/:id` | Pública | — |
| `POST` | `/productos` | JWT | `admin` |
| `PUT` | `/productos/:id` | JWT | `admin` |
| `DELETE` | `/productos/:id` | JWT | `admin` |

### Clientes

| Método | Ruta | Auth | Rol |
|---|---|---|---|
| `GET` | `/clientes` | JWT | cualquiera |
| `GET` | `/clientes/:id` | JWT | cualquiera |
| `POST` | `/clientes` | JWT | `admin` |
| `PUT` | `/clientes/:id` | JWT | `admin` |
| `DELETE` | `/clientes/:id` | JWT | `admin` |

### Facturas

| Método | Ruta | Auth | Rol |
|---|---|---|---|
| `GET` | `/facturas` | JWT | cualquiera |
| `GET` | `/facturas/:id` | JWT | cualquiera |
| `POST` | `/facturas` | JWT | cualquiera |
| `PUT` | `/facturas/:id` | JWT | cualquiera |
| `DELETE` | `/facturas/:id` | JWT | cualquiera |

## Autenticación y roles

La API usa JWT Bearer tokens. Al hacer login o register se obtiene un `accessToken` que debe enviarse en el header `Authorization: Bearer <token>`.

- **Usuarios normales** (`rol: 'user'`): pueden consultar clientes, productos y gestionar facturas.
- **Administradores** (`rol: 'admin'`): además pueden crear, modificar y eliminar clientes y productos.

Para crear el primer administrador:

```bash
npm run seed:admin -- --nombre "Admin" --email admin@test.com --password secret123
```

## Estructura del monorepo

```
apps/
  gateway/             # API HTTP + Swagger + Auth guards
  auth-service/        # Registro, login, validación JWT
  clientes-service/    # CRUD de clientes
  productos-service/   # CRUD de productos
  facturas-service/    # CRUD de facturas + validación inter-servicio
libs/
  common/              # DTOs compartidos + constantes de servicios
scripts/
  seed-admin.js        # Script para crear usuario administrador
```

## Comandos

```bash
npm run build              # Compilar todo
npm run build:gateway      # Compilar solo el gateway
npm run start:all          # Arrancar los 5 servicios
npm run stop:all           # Detener todos los servicios
npm run seed:admin -- ...  # Crear usuario admin
```

## Base de datos

PostgreSQL 16 con un esquema por servicio (`auth`, `clientes`, `productos`, `facturas`). TypeORM sincroniza las tablas automáticamente desde las entidades al iniciar cada servicio. No se usan migraciones.

Las credenciales están hardcodeadas en cada `app.module.ts`: usuario `facturacion`, contraseña `facturacion123`, base de datos `facturacion`.

## Limitaciones

Este proyecto es un prototipo funcional. No incluye tests automatizados, linting, formateo, CI/CD, variables de entorno ni migraciones de base de datos.
