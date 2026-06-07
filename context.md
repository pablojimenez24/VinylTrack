	# VinylTrack — Archivo de Contexto del Agente

> Este archivo es la fuente de verdad del proyecto. Léelo completo antes de escribir
> cualquier código. Al final de cada sesión, actualiza la sección "Estado actual".

---

## 1. Qué es el proyecto
SPA (Single Page Application) llamada VinylTrack. Gestor de catálogo de discos de vinilo
para una tienda independiente de Sevilla. Especializada en Rock, Soul, R&B, Blues y Salsa
de los años 60, 70 y 80.

Proyecto académico . NO tiene backend propio. El frontend conecta
directamente a Firebase Firestore desde React.

---

## 2. Stack tecnológico
- Frontend: React + Vite + TypeScript + Tailwind CSS + shadcn/ui
- Base de datos: Firebase Firestore (SDK directo en cliente, sin backend)
- Autenticación: ninguna (no requerida)
- Contenedores: Docker + Docker Compose (solo frontend)
- Package manager: pnpm

---

## 3. Estructura de carpetas objetivo
vinyltrack/
├── src/
│   ├── components/
│   │   ├── VinylCard.tsx      ← adaptado de Figma Make
│   │   ├── VinylForm.tsx      ← adaptado de Figma Make
│   │   ├── Navbar.tsx
│   │   ├── GenreFilter.tsx
│   │   └── Toast.tsx
│   ├── services/
│   │   └── vinylService.ts    ← CRUD con Firebase SDK
│   ├── lib/
│   │   └── firebase.ts        ← inicialización Firebase
│   ├── types/
│   │   └── vinyl.ts           ← interfaz TypeScript Vinyl
│   ├── App.tsx
│   └── main.tsx
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── package.json
├── vite.config.ts
└── CONTEXT.md

---

## 4. Modelo de datos — Vinyl

```typescript
interface Vinyl {
  id?: string
  title: string        // requerido
  artist: string       // requerido
  genre: 'Rock' | 'Soul' | 'R&B' | 'Blues' | 'Salsa'  // requerido
  year: number         // requerido, entre 1960 y 1989
  coverUrl?: string    // opcional
  condition: 'Mint' | 'VG+' | 'VG' | 'Good'           // requerido
  createdAt?: Date
}
```

---

## 5. Firebase — Operaciones CRUD

Colección en Firestore: `vinyls`

| Operación | Método Firebase |
|-----------|----------------|
| Listar todos | `getDocs(collection(db, 'vinyls'))` |
| Filtrar por género | `query(..., where('genre', '==', genre))` |
| Crear | `addDoc(collection(db, 'vinyls'), data)` |
| Actualizar | `updateDoc(doc(db, 'vinyls', id), data)` |
| Eliminar | `deleteDoc(doc(db, 'vinyls', id))` |

---

## 6. Variables de entorno (.env)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

Todas con prefijo VITE_ para que Vite las exponga al cliente.

---

## 7. Decisiones de diseño tomadas (no cambiar)
- Tema oscuro: bg #0D0D0D, superficie #1A1A1A, acento amber #F5A623
- Tipografía: Playfair Display (headings) + Inter (body)
- Badges de género: Rock=#E05252, Soul=#9B59B6, R&B=#3498DB, Blues=#1ABC9C, Salsa=#F39C12
- Validaciones inline en formulario (al salir del campo, no al submit)
- Delete con doble confirmación en la propia card (sin window.confirm)
- Toast de éxito/error top-right tras operaciones
- VinylCard.tsx y VinylForm.tsx vienen adaptados de Figma Make — respetar estructura visual

---

## 8. Docker — solo frontend

```dockerfile
# Dockerfile: build estático de Vite servido con nginx
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm install -g pnpm && pnpm install && pnpm build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

```yaml
# docker-compose.yml
services:
  frontend:
    build: .
    ports:
      - "3000:80"
```

Compatible con Windows 11. Sin volúmenes problemáticos de permisos.

---

## 9. Comandos útiles

```bash
# Levantar con Docker
docker-compose up --build

# Desarrollo local
pnpm dev

# Build estático
pnpm build
```

---

## 10. Estado actual ← ACTUALIZAR EN CADA SESIÓN

**Última actualización:** 2026-06-07T13:45
**Sesión anterior terminó en:** Scaffolding completo — estructura de carpetas creada, placeholders generados, firebase instalado

### ✅ Completado
- [x] Diseño en Figma Make
- [x] Exportación de VinylCard.tsx y VinylForm.tsx desde Figma
- [ ] Proyecto Firebase creado y credenciales obtenidas
- [x] Scaffolding del proyecto
- [x] lib/firebase.ts (placeholder con config comentada)
- [x] types/vinyl.ts (interfaz Vinyl definida)
- [x] services/vinylService.ts (placeholder con stubs CRUD)
- [x] VinylCard.tsx adaptado (movido a src/components/, pendiente conectar con Vinyl type)
- [x] VinylForm.tsx adaptado (movido a src/components/, pendiente conectar con Firebase)
- [x] Navbar.tsx (placeholder)
- [x] GenreFilter.tsx (placeholder)
- [x] Toast.tsx (placeholder)
- [x] App.tsx (layout SPA funcional — pendiente conectar Firebase)
- [x] Dockerfile
- [x] docker-compose.yml
- [ ] Prueba Docker en Windows 11
- [ ] Memoria PDF

### 🔄 En progreso
- Prueba Docker en Windows 11

### ⏳ Pendiente
- Todo lo demás ya ha sido implementado, a falta de prueba Docker en Windows 11 y Memoria PDF.

---

## 11. Instrucciones para el agente

1. Lee este archivo completo antes de cualquier acción
2. No cambies decisiones marcadas en la sección 7
3. No añadas backend — todo el CRUD va directo a Firebase desde React
4. Cuando termines una tarea indica qué checkboxes marcar en la sección 10
5. Pregunta antes de instalar dependencias no listadas en el stack
6. Al final de cada respuesta escribe: "**Actualiza CONTEXT.md:** marca como ✅ [items]"