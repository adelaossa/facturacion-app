# Facturacion App

Sistema de facturacion construido con una arquitectura de microservicios en NestJS, donde un API Gateway expone endpoints REST y delega la logica de negocio a microservicios especializados que se comunican entre si mediante NATS.

## Filosofia

El proyecto sigue el patron **API Gateway + Microservicios**, donde:

- El **Gateway** es el unico punto de entrada HTTP. Recibe las peticiones del cliente, orquesta la autenticacion y enruta cada request al microservicio correspondiente via NATS.
- Cada **microservicio** es responsable de un dominio especifico (auth, clientes, productos, facturas) y posee su propia base de datos aislada por schema en PostgreSQL.
- La comunicacion entre servicios usa el patron **request/response** con NATS como broker de mensajes, lo que permite desacoplar los servicios sin dependencias punto a punto.
- Los microservicios no exponen HTTP; solo escuchan mensajes NATS a traves de `@MessagePattern`.

## Arquitectura

```
                    ┌──────────────────┐
                    │   Cliente HTTP   │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │     Gateway       │  Express (port 3000)
                    │   REST + Swagger  │
                    └────────┬─────────┘
                             │ NATS
              ┌──────────────┼──────────────┬──────────────┐
              │              │              │              │
     ┌────────▼────┐ ┌──────▼──────┐ ┌────▼──────┐ ┌────▼────────┐
     │ Auth Service│ │  Clientes   │ │ Productos │ │  Facturas   │
     │  (NATS)     │ │  Service    │ │  Service  │ │  Service    │
     └─────────────┘ │  (NATS)     │ │  (NATS)   │ │  (NATS)     │
                     └─────────────┘ └───────────┘ └──────┬──────┘
                                                           │
                                              NATS ───────┤
                                              (valida cliente y producto)
```

## Monorepo

```
apps/
  gateway/           HTTP API (Express, port 3000)
  auth-service/      Microservicio NATS
  clientes-service/   Microservicio NATS
  productos-service/  Microservicio NATS
  facturas-service/   Microservicio NATS
libs/
  common/            DTOs e interfaces compartidas + constantes de servicio
```

Gestionado con **npm workspaces**. La libreria compartida `@facturacion/common` se resuelve via `paths` en el `tsconfig` raiz.

## Comunicacion entre servicios

Todos los servicios usan **NATS** como transporte. El Gateway y el servicio de Facturas actuan como clientes que envian mensajes a los demás microservicios.

### Patrones de mensaje (`{ cmd: 'verb-noun' }`)

| Servicio | Patron | Descripcion |
|---|---|---|
| auth-service | `auth-login` | Inicio de sesion |
| auth-service | `auth-register` | Registro de usuario |
| auth-service | `auth-validate` | Validacion de token |
| clientes-service | `find-all-clientes` | Listar clientes |
| clientes-service | `find-one-cliente` | Buscar cliente por ID |
| clientes-service | `create-cliente` | Crear cliente |
| clientes-service | `update-cliente` | Actualizar cliente |
| clientes-service | `delete-cliente` | Eliminar cliente |
| productos-service | `find-all-productos` | Listar productos |
| productos-service | `find-one-producto` | Buscar producto por ID |
| productos-service | `create-producto` | Crear producto |
| productos-service | `update-producto` | Actualizar producto |
| productos-service | `delete-producto` | Eliminar producto |
| facturas-service | `find-all-facturas` | Listar facturas |
| facturas-service | `find-one-factura` | Buscar factura por ID |
| facturas-service | `create-factura` | Crear factura |
| facturas-service | `update-factura` | Actualizar factura |
| facturas-service | `delete-factura` | Eliminar factura |

### Llamadas cross-service

El servicio de **Facturas** valida la existencia de clientes y productos antes de crear una factura, llamando via NATS a:

- `CLIENTES_SERVICE` → `{ cmd: 'find-one-cliente' }` con `{ id: clienteId }`
- `PRODUCTOS_SERVICE` → `{ cmd: 'find-one-producto' }` con `{ id: productoId }` (por cada linea de factura)

## Autenticacion y autorizacion

- **JWT** con `@nestjs/jwt` + `passport-jwt`. Secreto: configurado en `apps/gateway/src/auth/auth.module.ts`.
- `JwtAuthGuard` aplica por controlador. El decorador `@Public()` bypasa la autenticacion en rutas publicas (login, registro, GET /productos).
- **Roles**: `RolesGuard` + decorador `@Roles('admin')`. Los usuarios nuevos tienen `rol='user'` por defecto.
- Crear un usuario admin: `npm run seed:admin -- --nombre <name> --email <email> --password <pass>`
- El payload JWT contiene `{ sub, email, rol }`.

## Base de datos

- **PostgreSQL 16** via Docker (`docker-compose up -d`).
- Cada servicio usa su propio schema: `auth`, `clientes`, `productos`, `facturas`.
- **TypeORM** con `synchronize: true`: las tablas se crean/modifican automaticamente desde las entidades al iniciar.
- Credenciales: user=`facturacion`, pass=`facturacion123`, db=`facturacion`.
- No hay migraciones.

## Inicio rapido

```bash
# Levantar PostgreSQL y NATS
docker-compose up -d

# Instalar dependencias
npm install

# Compilar
npm run build

# Iniciar todos los servicios
npm run start:all

# Detener todos los servicios
npm run stop:all
```

El gateway estara disponible en `http://localhost:3000` y Swagger en `http://localhost:3000/api`.

## Comandos disponibles

| Comando | Descripcion |
|---|---|
| `npm run build` | Compila todos los workspaces |
| `npm run build:gateway` | Compila solo el gateway |
| `npm run build:auth` | Compila solo auth-service |
| `npm run build:clientes` | Compila solo clientes-service |
| `npm run build:productos` | Compila solo productos-service |
| `npm run build:facturas` | Compila solo facturas-service |
| `npm run start:all` | Inicia los 5 servicios en paralelo |
| `npm run stop:all` | Detiene todos los servicios |
| `npm run seed:admin` | Crea un usuario admin |

## Swagger

Disponible en `http://localhost:3000/api`. Todos los controladores y DTOs estan decorados con `@ApiTags`, `@ApiOperation`, `@ApiProperty`. Autenticacion Bearer configurada via `@ApiBearerAuth()`.