# 🏆 Logros - Celebra tus victorias con amigos

Una aplicación web full-stack moderna, limpia y motivadora para que grupos de amigos compartan y celebren sus logros personales (correr un maratón, aprobar un examen, conseguir un empleo, aprender algo nuevo, etc.).

---

## 🚀 Stack Tecnológico

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Canvas-Confetti.
- **Backend:** Node.js, Express, TypeScript, Zod, JWT, bcryptjs, Multer.
- **Base de Datos:** SQLite con Prisma ORM (ideal para ejecución local sin configuración adicional).
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
3. **Publicar un Logro:**
   - Título, descripción, fecha, categoría y foto opcional (subida desde archivo local o URL).
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

## 🛠️ Instalación y Ejecución en Local

### 1. Clonar o acceder a la carpeta del proyecto
```bash
cd "C:\Users\PacoMS95\.gemini\antigravity\scratch\logros"
```

### 2. Configurar variables de entorno
Tanto el cliente como el servidor cuentan con archivos `.env.example`:
- En `server/`: ya está generado `.env` con:
  ```env
  PORT=4000
  DATABASE_URL="file:./dev.db"
  JWT_SECRET="logros_super_secret_jwt_key_2026_celebrate"
  CLIENT_URL="http://localhost:5173"
  ```

### 3. Instalar dependencias y poblar la Base de Datos (Seed)
```bash
# Servidor
cd server
npm install
npx prisma db push
npm run seed
cd ..

# Cliente
cd client
npm install
cd ..
```

### 4. Iniciar la aplicación
Abre dos terminales (o ejecuta simultáneamente):

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

---

## 👥 Cuentas de Prueba Incluidas en el Seed

Todas las contraseñas son: `password123`

| Nombre | Email | Descripción |
|---|---|---|
| **Juan Pérez** | `juan@ejemplo.com` | Maratonista y desarrollador tech. Amigo de Sofía y Carlos. Tiene 1 logro privado. |
| **Sofía Martínez** | `sofia@ejemplo.com` | Arquitecta de soluciones y pintora al óleo. Amiga de Juan y Lucía. |
| **Carlos Gómez** | `carlos@ejemplo.com` | Entusiasta del fitness y guitarrista. Amigo de Juan y Diego. |
| **Lucía Morales** | `lucia@ejemplo.com` | Investigadora científica con mención de honor y senderista. |
| **Diego Ramírez** | `diego@ejemplo.com` | Diseñador de producto y horticultor urbano. |

---

## 📂 Estructura del Código

```
logros/
├── package.json
├── README.md
├── server/
│   ├── prisma/
│   │   ├── schema.prisma      # Esquema SQLite (User, Friendship, Achievement, Reaction, Comment, Notification)
│   │   └── seed.ts            # 5 usuarios realistas, 15 logros, reacciones y comentarios
│   ├── uploads/               # Fotos de logros subidas
│   └── src/
│       ├── controllers/       # Controladores de auth, feed, logros, amigos, reacciones, comentarios, perfil
│       ├── middleware/        # Autenticación JWT y Multer
│       ├── routes/            # Endpoints /api/*
│       └── server.ts          # Configuración de Express
└── client/
    ├── src/
    │   ├── components/        # Navbar, AchievementCard, NewAchievementModal, UserAvatar, CategoryBadge, EmptyState
    │   ├── context/           # AuthContext, NotificationContext, ThemeContext
    │   ├── pages/             # FeedPage, FriendsPage, ProfilePage, LoginPage, RegisterPage
    │   ├── services/          # api.ts (cliente tipado para backend)
    │   ├── types/             # Tipos TypeScript
    │   └── utils/             # Confetti y utilidades
```
