# ⚛️ Frontend - To-Do App

Aplicación web moderna desarrollada con React 19, TypeScript y Vite para gestión de tareas.

## 🛠️ Tecnologías

- **React 19** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite 7** - Bundler y dev server
- **Zustand** - Gestión de estado global
- **Wouter** - Enrutamiento ligero
- **Tailwind CSS** - Estilos utility-first
- **HeroUI** - Componentes UI
- **i18next** - Internacionalización
- **Axios** - Cliente HTTP
- **DiceBear** - Generación de avatares

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/      # Componentes reutilizables
│   │   ├── avatar/      # Componentes de avatar
│   │   ├── calendar/    # Vistas de calendario
│   │   ├── projects/    # Componentes de proyectos
│   │   ├── sidebar/     # Barra lateral
│   │   ├── tasks/       # Componentes de tareas
│   │   └── ui/          # Componentes UI base
│   ├── pages/           # Páginas de la aplicación
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── ProfilePage.tsx
│   ├── store/           # Estado global (Zustand)
│   │   ├── auth.store.ts
│   │   ├── task.store.ts
│   │   ├── project.store.ts
│   │   └── ...
│   ├── services/        # Servicios API
│   │   └── api.ts       # Cliente Axios configurado
│   ├── hooks/           # Custom hooks
│   ├── contexts/        # React Contexts
│   ├── i18n/            # Configuración de idiomas
│   │   ├── config.ts
│   │   ├── languages.ts
│   │   └── locales/     # Traducciones
│   ├── types/           # Definiciones TypeScript
│   └── utils/           # Utilidades
├── public/              # Archivos estáticos
├── package.json
└── vite.config.ts
```

## 🚀 Instalación

1. **Instalar dependencias**
```bash
bun install
```

2. **Configurar variables de entorno (opcional)**
Crea un archivo `.env`:
```env
VITE_API_URL=http://localhost:8080
```

3. **Iniciar servidor de desarrollo**
```bash
bun run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📝 Scripts Disponibles

- `bun run dev` - Inicia el servidor de desarrollo
- `bun run build` - Compila para producción
- `bun run preview` - Previsualiza el build de producción
- `bun run lint` - Ejecuta ESLint

## 🎨 Características Principales

### Gestión de Tareas
- ✅ Crear, editar, completar y eliminar tareas
- 📅 Fechas de vencimiento con indicadores visuales
- 🎯 Sistema de prioridades (Baja, Media, Alta, Urgente)
- 🏷️ Etiquetas personalizadas
- 📝 Descripciones y notas

### Vistas
- **Today**: Tareas del día actual
- **Inbox**: Todas las tareas sin proyecto
- **Upcoming**: Vista de calendario con próximas tareas
- **Proyectos**: Vista de lista o board por proyecto

### Proyectos y Secciones
- 📁 Crear y gestionar proyectos
- 📑 Secciones dentro de proyectos
- ⭐ Proyectos favoritos
- 📊 Vista de lista o board

### Perfil de Usuario
- 👤 Información personal
- 🎨 Selección de avatar (20 opciones)
- 🌍 Configuración de idioma
- 🏷️ Gestión de etiquetas
- 📁 Gestión de proyectos

## 🌍 Internacionalización

La aplicación soporta 10 idiomas:
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

El idioma se guarda en el perfil del usuario y se restaura automáticamente al iniciar sesión.

## 🎨 Paleta de Colores

La aplicación usa una paleta consistente definida en `tailwind.config.js`:
- **Jet Black** (`#2d3142`) - Color oscuro principal
- **Blue Slate** (`#4f5d75`) - Color secundario
- **Coral Glow** (`#ef8354`) - Color primario
- **Silver** (`#bfc0c0`) - Color neutro
- **Primary Light** (`#f5a882`) - Variante clara

## 🗂️ Gestión de Estado

El estado se gestiona con **Zustand** en stores separados:
- `auth.store` - Autenticación y tokens
- `user.store` - Información del usuario
- `task.store` - Tareas
- `project.store` - Proyectos
- `tag.store` - Etiquetas
- `category.store` - Categorías
- `section.store` - Secciones

## 🔌 API Integration

El cliente API está configurado en `src/services/api.ts`:
- Interceptores para agregar tokens JWT
- Base URL configurable
- Manejo de errores centralizado

## 🎨 Componentes Principales

### Avatar
- `Avatar.tsx` - Muestra avatar del usuario o genera uno por defecto
- `AvatarSelector.tsx` - Modal para seleccionar avatar

### Tareas
- `TaskItem.tsx` - Item individual de tarea
- `TaskFormModal.tsx` - Modal para crear/editar tarea
- `TaskDetailModal.tsx` - Vista detallada de tarea
- `QuickTaskInput.tsx` - Input rápido para crear tareas
- `DatePicker.tsx` - Selector de fecha con tema claro/oscuro

### Calendario
- `UpcomingView.tsx` - Vista de próximas tareas
- `CalendarView.tsx` - Vista de calendario completo

### Proyectos
- `SectionListView.tsx` - Vista de lista de secciones
- `SectionBoardView.tsx` - Vista de board (Kanban)

## 📱 Responsive Design

La aplicación es completamente responsive:
- Sidebar colapsable
- Adaptación a diferentes tamaños de pantalla
- Componentes que se ajustan automáticamente

## 🔔 Sistema de Notificaciones

Sistema de toasts implementado con:
- `useToast` hook personalizado
- 4 tipos: success, error, warning, info
- Z-index alto para aparecer sobre modales
- Auto-cierre configurable

## 🚀 Build para Producción

```bash
bun run build
```

El build se genera en la carpeta `dist/` y está optimizado para producción.

## 📚 Recursos

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [HeroUI Documentation](https://www.heroui.com/)
