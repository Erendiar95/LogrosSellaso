# 🏆 Logros - Celebra tus victorias con amigos

Una aplicación web full-stack moderna, limpia y motivadora para que grupos de amigos compartan y celebren sus logros personales (correr un maratón, aprobar un examen, conseguir un empleo, aprender algo nuevo, etc.).

---

## 🚀 Stack Tecnológico

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Canvas-Confetti.
- **Backend:** Node.js, Express, TypeScript, Zod, JWT, bcryptjs, Multer.
- **Almacenamiento de Fotos:** **Cloudinary** (alojamiento y optimización de imágenes en la nube vía SDK oficial).
- **Base de Datos:** PostgreSQL en Neon (o SQLite local) gestionado con Prisma ORM.
- **Diseño:** Mobile-first, responsive, paleta cálida (ámbar / dorado), microinteracciones y modo oscuro.

---

## 📋 Funcionalidades Principales

1. **Registro e Inicio de Sesión:**
   - Creación de cuenta con email, contraseña hasheada (bcrypt) y avatar con paleta de colores e iniciales.
   - Botones de acceso rápido para cuentas demo preconfiguradas.
2. **Sistema de Amigos:**
   - Buscar usuarios en tiempo real por nombre o correo.
   - Enviar y recibir solicitudes de amistad.
   - Aceptar o rechazar solicitudes con actualización de contadores.
   - Lista de amigos y opción de eliminar amistad.
3. **Publicar un Logro con Fotos en Cloudinary:**
   - Título, descripción, fecha, categoría y foto subida a Cloudinary en tiempo real con optimización automática.
   - Selector de privacidad: visible para **"Mis Amigos"** o **"Solo yo"** (privado).
   - ¡Animación de confeti al publicar con éxito!
4. **Feed de Logros Dinámico:**
   - Visualización cronológica de logros propios y de amigos aceptados.
   - Cumplimiento estricto de privacidad: los logros privados de un usuario nunca aparecen en el feed de los amigos.
   - Filtro instantáneo por categoría (Salud, Estudios, Trabajo, Personal, Creatividad, Otros).
5. **Reacciones Interactivas:**
   - Botones de reacción: 🎉 Celebrar, 👏 Aplaudir, 💪 Fuerza, ❤️ Me encanta.
   - Regla de un solo voto por usuario y tipo de reacción con actualización reactiva.
6. **Comentarios:**
   - Hilo de comentarios desplegable en cada publicación.
   - Posibilidad de eliminar los comentarios propios.
7. **Perfil de Usuario:**
   - Contador total de logros alcanzados.
   - Cálculo dinámico de **racha semanal** (consecutivas semanas con logros).
   - Gráfico de barras con la distribución de logros por categorías.
   - Historial de logros del usuario (incluyendo sus logros privados solo si es su propio perfil).
8. **Notificaciones en la App:**
   - Centro de notificaciones con insignia de no leídas cuando alguien reacciona, comenta o envía solicitud de amistad.
   - Marcado individual o masivo como leídas.
9. **Modo Oscuro:**
   - Alternancia fluida entre tema claro y oscuro con persistencia en `localStorage`.

---

## ☁️ Configuración de Cloudinary

En `server/.env` agrega tus credenciales de Cloudinary (disponibles en el Dashboard de [Cloudinary](https://cloudinary.com)):

```env
# Opción 1: Variables individuales
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Opción 2: URL completa
# CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
```

---

## 🛠️ Instalación y Ejecución en Local

### 1. Ubicación del proyecto
```bash
cd "C:\Users\PacoMS95\Documents\GitHub\LogrosSellaso"
```

### 2. Configurar variables de entorno
Revisa los archivos `.env.example` en `server/`:
- `server/.env`:
  ```env
  PORT=4000
  DATABASE_URL="tu_url_de_base_de_datos"
  JWT_SECRET="tu_jwt_secret"
  CLIENT_URL="http://localhost:5173"
  CLOUDINARY_CLOUD_NAME="tu_cloud_name"
  CLOUDINARY_API_KEY="tu_api_key"
  CLOUDINARY_API_SECRET="tu_api_secret"
  ```

### 3. Iniciar la aplicación

**Terminal 1 (Backend - Puerto 4000):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend - Puerto 5173):**
```bash
cd client
npm run dev
```

Abre tu navegador en `http://localhost:5173`.
