# Memoria del Proyecto: VinylTrack

## 1. Introducción
VinylTrack es una Single Page Application (SPA) diseñada para gestionar el catálogo de discos de vinilo de una tienda independiente en Sevilla. La tienda está especializada en géneros clásicos (Rock, Soul, R&B, Blues y Salsa) de los años 60, 70 y 80.

## 2. Stack Tecnológico
- **Frontend**: React + Vite + TypeScript
- **Estilos**: Tailwind CSS + componentes base inspirados en shadcn/ui
- **Base de Datos**: Firebase Firestore (SDK en cliente)
- **Contenedorización**: Docker (Dockerfile con Nginx estático) + Docker Compose

## 3. Arquitectura y Componentes
La estructura de carpetas ha sido refactorizada para una separación lógica de responsabilidades:
- `src/types/vinyl.ts`: Fuente de verdad del modelo de datos (`Vinyl`, `Genre`, `Condition`).
- `src/lib/firebase.ts`: Inicialización de la conexión con Firebase usando variables de entorno `VITE_FIREBASE_*`.
- `src/services/vinylService.ts`: Capa de servicios que abstrae todas las operaciones CRUD (Crear, Leer, Actualizar, Borrar) contra Firestore.
- `src/components/`: Componentes UI reutilizables como `VinylCard`, `VinylForm`, `Navbar`, `GenreFilter` y utilidades de `Toast`.

## 4. Decisiones de Diseño Implementadas
- **Tema Oscuro**: Se ha mantenido una paleta oscura y elegante con acentos ámbar (`#F5A623`), ideal para el nicho vintage.
- **Formularios**: Integración con `react-hook-form` para validaciones inline fluidas y previsualización en vivo (`VinylForm`).
- **Feedback Visual**: Uso de notificaciones estilo *toast* (librería `sonner`) e interfaz optimista para mejorar la percepción de velocidad en borrados.
- **Responsive**: Grid adaptable a diferentes tamaños de pantalla (4 columnas en escritorio, 1 en móviles).

## 5. Pruebas y Despliegue
- La aplicación compila correctamente libre de errores de TypeScript (`pnpm build`).
- Se ha generado un `Dockerfile` en dos etapas (compilación con Node y servido con Nginx) y su respectivo `docker-compose.yml` para facilitar el despliegue.
- *(Nota: La prueba local de Docker en el entorno del agente fue omitida por no disponer del binario de Docker, pero la configuración es estándar y lista para usarse).*

## 6. Conclusión
El proyecto está completamente implementado a nivel de scaffolding e integración de servicios. Queda listo para la inserción de datos reales a través de Firestore y su paso a producción.
