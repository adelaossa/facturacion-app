# AGENTS.md

## Monorepo structure (npm workspaces)

```
apps/
  gateway/          HTTP API (Express, port 3000)
  auth-service/     TCP microservice (port 3001)
  clientes-service/ TCP microservice (port 3002)
  productos-service/TCP microservice (port 3003)
  facturas-service/ TCP microservice (port 3004)
libs/
  common/           Shared DTO interfaces + service name constants
```

NestJS everywhere. Gateway exposes REST + Swagger; microservices use `Transport.TCP` with `{ cmd: 'verb-noun' }` message patterns.

## Startup

```bash
docker-compose up -d       # PostgreSQL 16
npm install                # from repo root (workspaces)
npm run build              # tsc all workspaces
npm run start:all          # start all 5 services in parallel
```

Stop: `npm run stop:all` (pkill by process name).

## Build single package

```bash
npm run build:gateway     # -w @facturacion/gateway
npm run build:auth        # -w @facturacion/auth-service
npm run build:clientes    # -w @facturacion/clientes-service
npm run build:productos   # -w @facturacion/productos-service
npm run build:facturas    # -w @facturacion/facturas-service
```

## No tests, lint, format, or CI

No jest, no eslint, no prettier, no `.github/workflows/`. There are no `*.spec.ts` or `*.test.ts` files anywhere. The only verification step is `tsc` (via `npm run build`).

## Database

- PostgreSQL 16 via Docker, container name `facturacion-db`.
- Each service uses its own PostgreSQL **schema** (`auth`, `clientes`, `productos`, `facturas`).
- `synchronize: true` on every service — TypeORM auto-creates/alters tables from entity classes on startup. No migrations.
- DB credentials are **hardcoded** in each service's `app.module.ts`: user=`facturacion`, pass=`facturacion123`, db=`facturacion`. No `.env` files.

## Architecture notes

- **Gateway is the single HTTP entrypoint.** It imports `ClientsModule.register()` with 4 named TCP proxies (`AUTH_SERVICE`, `CLIENTES_SERVICE`, `PRODUCTOS_SERVICE`, `FACTURAS_SERVICE`) and delegates all requests via `client.send(pattern, data)`.
- **Service name constants** live in `libs/common/src/interfaces/index.ts`. Use them for `@Inject()` or `ClientsModule.register()` — never use raw strings.
- **Facturas-service calls CLIENTES_SERVICE and PRODUCTOS_SERVICE** during factura creation to validate referenced entities. It uses `.toPromise()` (NestJS v10 Observable API).
- Controllers sit in subdirectories matching the domain (e.g. `clientes/clientes.controller.ts`), wired via per-domain modules (`clientes.module.ts`). DTOs are in `src/<domain>/dto/`.

## Auth

- JWT via `@nestjs/jwt` + `passport-jwt`. Secret (`facturacion-secret-key-2024`) and expiry (`7d`) are hardcoded in `apps/gateway/src/auth/auth.module.ts`.
- `JwtAuthGuard` applies per-controller. Use `@Public()` decorator (defined in the guard file) to bypass auth on specific routes (e.g. login, register, GET /productos).
- Passwords hashed with `bcrypt` (10 rounds).
- **Role-based authorization**: `RolesGuard` + `@Roles('admin')` decorator. New users default to `rol='user'` in the `Usuario` entity. Create an admin account with `npm run seed:admin -- --nombre <name> --email <email> --password <pass>`. `@Roles()` guards POST/PUT/DELETE on `/productos` and `/clientes` — only admin tokens can mutate these resources.
- The JWT payload carries `{ sub, email, rol }`; `JwtStrategy` extracts all three into `request.user`.

## Shared library (`@facturacion/common`)

TS path alias in root tsconfig: `@facturacion/common` → `libs/common/src`.

Exports:
- DTO interfaces (`IAuthLogin`, `ICreateCliente`, `ICreateFactura`, etc.) from `src/interfaces/dto.interface.ts`
- Service interfaces and string constants from `src/interfaces/index.ts`

## Swagger

Available at `http://localhost:3000/api`. All controllers and DTOs decorated with `@ApiTags`, `@ApiOperation`, `@ApiProperty`. Bearer auth configured via `@ApiBearerAuth()`.

## tsconfig quirks

`strictNullChecks: false`, `noImplicitAny: false`, `forceConsistentCasingInFileNames: false`. The shared lib `@facturacion/common` is resolved via `paths` in the root tsconfig, not via built output — each workspace must extend the root tsconfig.
