<div align="center">
  <img src="https://i.ibb.co/rKB6Smh0/logo.jpg" alt="Tilded Logo" width="600"/>
</div>

# Tilded

Una aplicación moderna de gestión de tareas desarrollada con React y Fastify. Sistema completo para organizar tareas, proyectos, etiquetas y más, con soporte multiidioma y avatares personalizados.

## 🚀 Características Principales

### Gestión de Tareas

- ✅ Crear, editar, completar y eliminar tareas
- 📅 Fechas de vencimiento con indicadores visuales (rojo para fechas pasadas)
- 🎯 Sistema de prioridades (Baja, Media, Alta, Urgente)
- 🏷️ Etiquetas personalizadas con colores
- 📝 Descripciones y notas
- 🔄 Input rápido para crear tareas rápidamente

### Vistas y Organización

- **Today**: Tareas del día actual
- **Inbox**: Todas las tareas sin proyecto
- **Upcoming**: Vista de calendario con próximas tareas (3 días)
- **Proyectos**: Vista de lista o board (Kanban) por proyecto
- 📑 Secciones dentro de proyectos para mejor organización

### Perfil y Personalización

- 👤 Información personal editable
- 🎨 Selección de avatar entre 20 opciones pregeneradas
- 🌍 Configuración de idioma (se guarda y restaura automáticamente)
- 🏷️ Gestión completa de etiquetas
- 📁 Gestión de proyectos y secciones

### Interfaz

- 📱 Diseño completamente responsive
- 🎨 Paleta de colores consistente
- 🌍 Soporte para 10 idiomas
- 🔔 Sistema de notificaciones (toasts)
- 🎭 Modales con temas claro/oscuro según contexto

## 🛠️ Stack Tecnológico

### Frontend

- **React 19** con **TypeScript**
- **Vite** como bundler
- **Zustand** para gestión de estado
- **Wouter** para enrutamiento
- **Tailwind CSS** + **HeroUI** para estilos
- **i18next** para internacionalización
- **Axios** para peticiones HTTP

### Backend

- **Fastify** como framework web
- **TypeORM** para ORM
- **PostgreSQL** como base de datos
- **JWT** para autenticación
- **bcrypt** para hash de contraseñas
- **DiceBear** para generación de avatares

## 📁 Estructura del Proyecto

```
tilded/
├── frontend/              # Aplicación React
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   │   ├── avatar/    # Sistema de avatares
│   │   │   ├── calendar/  # Vistas de calendario
│   │   │   ├── projects/  # Componentes de proyectos
│   │   │   ├── sidebar/   # Barra lateral
│   │   │   ├── tasks/     # Componentes de tareas
│   │   │   └── ui/        # Componentes UI base
│   │   ├── pages/         # Páginas principales
│   │   ├── store/         # Estado global (Zustand)
│   │   ├── services/      # Cliente API
│   │   ├── hooks/         # Custom hooks
│   │   ├── contexts/      # React Contexts
│   │   ├── i18n/          # Internacionalización
│   │   └── utils/         # Utilidades
│   └── package.json
├── backend/               # API REST
│   ├── src/
│   │   ├── config/        # Configuración
│   │   ├── entities/      # Entidades TypeORM
│   │   ├── controllers/   # Controladores de rutas
│   │   ├── services/      # Lógica de negocio
│   │   ├── routes/        # Definición de rutas
│   │   ├── plugins/       # Plugins Fastify
│   │   └── utils/         # Utilidades (avatares)
│   ├── docker-compose.yml # PostgreSQL
│   └── package.json
└── README.md
```

## 🚀 Inicio Rápido

### Prerrequisitos

- **Node.js** 18+ o **Bun** 1.0+
- **PostgreSQL** 15+ (o Docker para usar docker-compose)
- **Git**

### Configuración de Git

Este proyecto usa un único repositorio Git en la raíz. Si necesitas inicializar el repositorio:

```bash
# En la raíz del proyecto
git init
git add .
git commit -m "Initial commit"
```

### Instalación

1. **Clonar el repositorio**

```bash
git clone <repository-url>
cd to-do-app
```

2. **Configurar Backend**

```bash
cd backend
bun install
```

Crea un archivo `.env` con las siguientes variables:

```env
PORT=8080
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña
DB_DATABASE=todo_app
JWT_SECRET=tu_secreto_jwt_muy_seguro
```

3. **Configurar Frontend**

```bash
cd ../frontend
bun install
```

Opcional: Crea un archivo `.env` si necesitas cambiar la URL del API:

```env
VITE_API_URL=http://localhost:8080
```

4. **Iniciar Base de Datos (con Docker)**

```bash
cd backend
docker-compose up -d
```

5. **Iniciar Backend**

```bash
cd backend
bun run dev
```

6. **Iniciar Frontend**

```bash
cd frontend
bun run dev
```

La aplicación estará disponible en:

- Frontend: http://localhost:5173
- Backend: http://localhost:8080

## 📝 Scripts Disponibles

### Backend

- `bun run dev` - Inicia el servidor en modo desarrollo con hot-reload
- `bun run build` - Compila TypeScript a JavaScript
- `bun run start` - Inicia el servidor en modo producción

### Frontend

- `bun run dev` - Inicia el servidor de desarrollo (Vite)
- `bun run build` - Compila para producción
- `bun run preview` - Previsualiza el build de producción
- `bun run lint` - Ejecuta ESLint

## 🎨 Paleta de Colores

La aplicación usa una paleta de colores consistente:

- **Jet Black**: `#2d3142` - Color oscuro principal
- **Blue Slate**: `#4f5d75` - Color secundario
- **Coral Glow**: `#ef8354` - Color primario
- **Silver**: `#bfc0c0` - Color neutro
- **Primary Light**: `#f5a882` - Variante clara del primario

## 🌍 Idiomas Soportados

- 🇪🇸 Español
- 🇬🇧 English
- 🇫🇷 Français
- 🇩🇪 Deutsch
- 🇵🇹 Português
- 🇨🇳 中文
- 🇮🇳 हिन्दी
- 🇸🇦 العربية
- 🇯🇵 日本語
- 🇷🇺 Русский

## 🔌 API Endpoints Principales

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

Ver [Backend README](./backend/README.md) para documentación completa de la API.

## 📚 Documentación Adicional

- [Backend README](./backend/README.md) - Documentación detallada del backend, endpoints y configuración
- [Frontend README](./frontend/README.md) - Documentación detallada del frontend, componentes y características

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 👨‍💻 Autor

Desarrollado por krushodev.
