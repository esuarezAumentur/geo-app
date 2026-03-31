# geo-admin-backend

Backend API para la **Plataforma de Mapas Interactivos 3D** del Ayuntamiento de Lugo.

Stack: Node.js · Express · MongoDB · Docker

---

## Requisitos previos

- Docker y Docker Compose instalados
- Node.js >= 20.19.0 (solo para desarrollo local sin Docker)

---

## Arranque rápido con Docker

```bash
# Ejecutar desde la raiz del monorepo
cp apps/backend/.env.example apps/backend/.env
# Editar apps/backend/.env con tus valores (JWT secrets obligatorios)

docker compose -f infra/docker/docker-compose.yml up --build -d

# API disponible en:
#   http://localhost:3000/api
#   http://localhost/api  (vía nginx)
```

---

## Desarrollo local (sin Docker)

```bash
# Desde la raiz del monorepo
pnpm install
cp apps/backend/.env.example apps/backend/.env
# Ajustar MONGO_URI a mongodb://localhost:27017/geo-admin

pnpm --filter geo-admin-backend dev
```

---

## Variables de entorno requeridas

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto del servidor | `3000` |
| `NODE_ENV` | Entorno | `development` |
| `MONGO_URI` | Cadena de conexión a MongoDB | `mongodb://mongo:27017/geo-admin` |
| `JWT_SECRET` | Secreto para access tokens | cadena aleatoria larga |
| `JWT_EXPIRES_IN` | Expiración del access token | `15m` |
| `JWT_REFRESH_SECRET` | Secreto para refresh tokens | cadena aleatoria larga |
| `JWT_REFRESH_EXPIRES_IN` | Expiración del refresh token | `7d` |
| `UPLOAD_DIR` | Ruta donde se guardan los archivos | `/data/uploads` |
| `PUBLIC_BASE_URL` | URL base pública de la API | `http://localhost:3000` |
| `CORS_ORIGIN` | Origen permitido para CORS | `http://localhost:5173` |

---

## Endpoints de la API

### Auth

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/auth/register` | Registrar nuevo usuario |
| `POST` | `/api/auth/login` | Login, devuelve `accessToken` y `refreshToken` |
| `POST` | `/api/auth/refresh` | Renovar access token con refresh token |

### Users _(solo Admin)_

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/users` | Listar usuarios |
| `POST` | `/api/users` | Crear usuario |
| `GET` | `/api/users/:id` | Obtener usuario |
| `PUT` | `/api/users/:id` | Actualizar rol / estado |
| `DELETE` | `/api/users/:id` | Eliminar usuario |

### Maps

| Método | Ruta | Auth requerida | Descripción |
|---|---|---|---|
| `GET` | `/api/maps` | Opcional | Listar mapas (públicos sin auth, todos con auth) |
| `GET` | `/api/maps/:id` | Opcional | Obtener mapa |
| `POST` | `/api/maps` | Admin | Crear mapa |
| `PUT` | `/api/maps/:id` | Admin / Editor | Actualizar mapa |
| `DELETE` | `/api/maps/:id` | Admin | Eliminar mapa |

### POIs

| Método | Ruta | Auth requerida | Descripción |
|---|---|---|---|
| `GET` | `/api/maps/:mapId/pois` | Opcional | Listar POIs de un mapa |
| `GET` | `/api/maps/:mapId/pois/:poiId` | Opcional | Obtener POI |
| `POST` | `/api/maps/:mapId/pois` | Admin / Editor | Crear POI |
| `PUT` | `/api/maps/:mapId/pois/:poiId` | Admin / Editor | Actualizar POI |
| `DELETE` | `/api/maps/:mapId/pois/:poiId` | Admin / Editor | Eliminar POI |
| `POST` | `/api/maps/:mapId/pois/reorder` | Admin / Editor | Reordenar POIs |

### Storage

| Método | Ruta | Auth requerida | Descripción |
|---|---|---|---|
| `POST` | `/api/storage/upload` | Admin / Editor | Subir archivo (form-data, campo `file`) |
| `DELETE` | `/api/storage/:filename` | Admin / Editor | Eliminar archivo |

**Tipos de archivo permitidos:** `.jpg`, `.png`, `.webp`, `.pdf`, `.kml`  
**Tamaño máximo:** 25 MB

---

## Roles de usuario

| Rol | Permisos |
|---|---|
| `admin` | Acceso completo |
| `editor` | Editar POIs y configuración de mapas, subir archivos |
| `viewer` | Acceso a mapas privados |

---

## Estructura del proyecto

```
apps/backend/
├── src/
│   ├── config/         # Conexión DB y variables de entorno
│   ├── middlewares/    # authenticate, authorize, optionalAuth, errorHandler
│   ├── models/         # User, Map, POI (Mongoose schemas)
│   └── modules/
│       ├── auth/       # register, login, refresh
│       ├── users/      # CRUD usuarios
│       ├── maps/       # CRUD visores
│       ├── pois/       # CRUD puntos de interés
│       └── storage/    # Subida y eliminación de archivos
infra/docker/
├── api.Dockerfile
├── nginx.conf
└── docker-compose.yml
```

---

## Healthcheck

```bash
curl http://localhost:3000/health
# {"status":"ok"}
```
