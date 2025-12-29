# 🔧 Backend API - Tilded

API REST desarrollada con Fastify y TypeORM para la aplicación de gestión de tareas.

## 🛠️ Tecnologías

- **Fastify 5.6** - Framework web rápido y eficiente
- **TypeORM 0.3** - ORM para TypeScript
- **PostgreSQL 15** - Base de datos relacional
- **JWT** - Autenticación basada en tokens
- **bcrypt** - Hash de contraseñas
- **DiceBear** - Generación de avatares abstractos

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/          # Configuración (data-source, etc.)
│   ├── controllers/     # Controladores de rutas
│   │   ├── auth.controller.ts
│   │   ├── task.controller.ts
│   │   ├── project.controller.ts
│   │   ├── user.controller.ts
│   │   └── ...
│   ├── entities/        # Entidades TypeORM
│   │   ├── User.ts
│   │   ├── Task.ts
│   │   ├── Project.ts
│   │   └── ...
│   ├── routes/          # Definición de rutas
│   ├── services/        # Lógica de negocio
│   ├── plugins/         # Plugins de Fastify
│   ├── utils/           # Utilidades
│   │   └── avatar.ts    # Generación de avatares
│   └── index.ts         # Punto de entrada
├── docker-compose.yml   # Configuración de PostgreSQL
├── package.json
└── tsconfig.json
```

## 🚀 Instalación

1. **Instalar dependencias**
```bash
bun install
```

2. **Configurar variables de entorno**
Crea un archivo `.env` en la raíz del backend:
```env
PORT=8080
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña
DB_DATABASE=todo_app
JWT_SECRET=tu_secreto_jwt_muy_seguro
```

3. **Iniciar PostgreSQL con Docker**
```bash
docker-compose up -d
```

4. **Iniciar el servidor en desarrollo**
```bash
bun run dev
```

El servidor estará disponible en `http://localhost:8080`

## 📝 Scripts Disponibles

- `bun run dev` - Inicia el servidor en modo desarrollo con hot-reload
- `bun run build` - Compila TypeScript a JavaScript
- `bun run start` - Inicia el servidor en modo producción
- `bun run typeorm` - Ejecuta comandos de TypeORM

## 🗄️ Base de Datos

### Entidades Principales

- **User**: Usuarios del sistema (email, password, name, avatar, language)
- **Task**: Tareas (title, description, dueDate, priority, projectId, sectionId)
- **Project**: Proyectos (name, description, isFavorite)
- **Section**: Secciones dentro de proyectos
- **Tag**: Etiquetas para categorizar tareas
- **Category**: Categorías predefinidas

### Configuración de Base de Datos

TypeORM está configurado con `synchronize: true` para desarrollo. En producción, usa migraciones.

## 🔐 Autenticación

El backend usa JWT (JSON Web Tokens) para autenticación:

1. **Registro**: `POST /api/auth/register`
   ```json
   {
     "email": "usuario@example.com",
     "password": "contraseña"
   }
   ```

2. **Login**: `POST /api/auth/login`
   ```json
   {
     "email": "usuario@example.com",
     "password": "contraseña"
   }
   ```
   Respuesta:
   ```json
   {
     "token": "jwt_token_aqui"
   }
   ```

3. **Rutas Protegidas**: Todas las rutas excepto `/api/auth/*` requieren el header:
   ```
   Authorization: Bearer <token>
   ```

## 📡 Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión

### Usuarios
- `GET /api/users/me` - Obtener usuario actual
- `PATCH /api/users/me` - Actualizar usuario (name, avatar, language)

### Tareas
- `GET /api/tasks` - Listar tareas (con filtros opcionales)
- `POST /api/tasks` - Crear tarea
- `PATCH /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea

### Proyectos
- `GET /api/projects` - Listar proyectos
- `POST /api/projects` - Crear proyecto
- `PATCH /api/projects/:id` - Actualizar proyecto
- `DELETE /api/projects/:id` - Eliminar proyecto

### Etiquetas
- `GET /api/tags` - Listar etiquetas
- `POST /api/tags` - Crear etiqueta
- `DELETE /api/tags/:id` - Eliminar etiqueta

### Secciones
- `GET /api/sections?projectId=:id` - Listar secciones de un proyecto
- `POST /api/sections` - Crear sección
- `PATCH /api/sections/:id` - Actualizar sección
- `DELETE /api/sections/:id` - Eliminar sección

## 🎨 Sistema de Avatares

El backend genera avatares abstractos usando DiceBear con la paleta de colores de la aplicación:
- Se genera automáticamente un avatar al registrar un usuario
- Los avatares se guardan como Data URI en la base de datos
- Colores utilizados: `#2d3142`, `#4f5d75`, `#ef8354`, `#bfc0c0`, `#f5a882`

## 🌍 Internacionalización

El backend soporta el guardado del idioma preferido del usuario:
- Campo `language` en la entidad User
- Valor por defecto: `'en'`
- Se actualiza mediante `PATCH /api/users/me`

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt (10 rounds)
- JWT con expiración configurable
- CORS configurado para el frontend
- Validación de datos en controladores

## 🐳 Docker

El proyecto incluye un `docker-compose.yml` para PostgreSQL:

```bash
docker-compose up -d    # Iniciar
docker-compose down     # Detener
docker-compose logs     # Ver logs
```

## 📦 Producción

1. **Compilar el proyecto**
```bash
bun run build
```

2. **Configurar variables de entorno de producción**

3. **Iniciar el servidor**
```bash
bun run start
```

## 📚 Recursos

- [Fastify Documentation](https://www.fastify.io/)
- [TypeORM Documentation](https://typeorm.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

