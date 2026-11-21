import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar base de datos
  await prisma.notification.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.reaction.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.friendship.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Crear 5 usuarios
  const juan = await prisma.user.create({
    data: {
      email: 'juan@ejemplo.com',
      passwordHash,
      name: 'Juan Pérez',
      avatarColor: '#f59e0b', // Ámbar
      bio: 'Corredor aficionado y desarrollador de software. Siempre buscando nuevos retos.',
    },
  });

  const sofia = await prisma.user.create({
    data: {
      email: 'sofia@ejemplo.com',
      passwordHash,
      name: 'Sofía Martínez',
      avatarColor: '#10b981', // Esmeralda
      bio: 'Arquitecta de soluciones y amante de la pintura y la naturaleza.',
    },
  });

  const carlos = await prisma.user.create({
    data: {
      email: 'carlos@ejemplo.com',
      passwordHash,
      name: 'Carlos Gómez',
      avatarColor: '#3b82f6', // Azul
      bio: 'Entusiasta del fitness y del código libre. Pasión por la música.',
    },
  });

  const lucia = await prisma.user.create({
    data: {
      email: 'lucia@ejemplo.com',
      passwordHash,
      name: 'Lucía Morales',
      avatarColor: '#ec4899', // Rosa
      bio: 'Investigadora y divulgadora científica. Senderista de fin de semana.',
    },
  });

  const diego = await prisma.user.create({
    data: {
      email: 'diego@ejemplo.com',
      passwordHash,
      name: 'Diego Ramírez',
      avatarColor: '#8b5cf6', // Púrpura
      bio: 'Diseñador de producto, lector voraz y aficionado a la jardinería urbana.',
    },
  });

  console.log('✅ 5 usuarios creados.');

  // 2. Crear Amistades
  // Juan es amigo de Sofía y Carlos
  await prisma.friendship.create({
    data: { requesterId: juan.id, addresseeId: sofia.id, status: 'ACCEPTED' },
  });
  await prisma.friendship.create({
    data: { requesterId: juan.id, addresseeId: carlos.id, status: 'ACCEPTED' },
  });

  // Sofía es amiga de Lucía
  await prisma.friendship.create({
    data: { requesterId: sofia.id, addresseeId: lucia.id, status: 'ACCEPTED' },
  });

  // Carlos es amigo de Diego
  await prisma.friendship.create({
    data: { requesterId: carlos.id, addresseeId: diego.id, status: 'ACCEPTED' },
  });

  // Lucía es amiga de Diego
  await prisma.friendship.create({
    data: { requesterId: lucia.id, addresseeId: diego.id, status: 'ACCEPTED' },
  });

  // Solicitud pendiente de Sofía hacia Diego (para probar solicitudes entrantes)
  await prisma.friendship.create({
    data: { requesterId: sofia.id, addresseeId: diego.id, status: 'PENDING' },
  });

  console.log('✅ Relaciones de amistad creadas.');

  // 3. Crear 15 Logros
  const a1 = await prisma.achievement.create({
    data: {
      userId: juan.id,
      title: '¡Completé mi primer maratón de 42K!',
      description: 'Tras 6 meses de madrugones y más de 800 km acumulados de entrenamiento, crucé la meta en 3h 52m. ¡Inolvidable sensación!',
      category: 'HEALTH',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // hace 2 días
      imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80',
      visibility: 'FRIENDS',
    },
  });

  const a2 = await prisma.achievement.create({
    data: {
      userId: juan.id,
      title: 'Promovido a Tech Lead en la empresa',
      description: 'Muy emocionado por asumir este nuevo rol guiando a un equipo de 6 ingenieros en proyectos de gran impacto.',
      category: 'WORK',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      visibility: 'FRIENDS',
    },
  });

  // Logro PRIVADO de Juan (solo él debe verlo)
  await prisma.achievement.create({
    data: {
      userId: juan.id,
      title: '30 días consecutivos practicando meditación diaria',
      description: 'Un compromiso conmigo mismo que me ha dado muchísima claridad mental y calma en momentos de estrés.',
      category: 'PERSONAL',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
      visibility: 'PRIVATE',
    },
  });

  const a4 = await prisma.achievement.create({
    data: {
      userId: sofia.id,
      title: '¡Aprobé el examen AWS Certified Solutions Architect!',
      description: 'Meses de estudio por las noches dieron frutos. Puntuación de 890/1000. ¡Siguiente objetivo: Kubernetes!',
      category: 'STUDIES',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // hace 1 día
      visibility: 'FRIENDS',
    },
  });

  const a5 = await prisma.achievement.create({
    data: {
      userId: sofia.id,
      title: 'Terminé mi primer lienzo al óleo de un atardecer',
      description: 'Nunca antes había tocado un pincel al óleo. Me tomó 3 semanas de paciencia y mezcla de colores.',
      category: 'CREATIVITY',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
      imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
      visibility: 'FRIENDS',
    },
  });

  await prisma.achievement.create({
    data: {
      userId: sofia.id,
      title: 'Alcancé mi meta de ahorro para el fondo de emergencia',
      description: 'Con disciplina logré reunir el equivalente a 6 meses de gastos fijos. Una gran tranquilidad financiera.',
      category: 'PERSONAL',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
      visibility: 'FRIENDS',
    },
  });

  const a7 = await prisma.achievement.create({
    data: {
      userId: carlos.id,
      title: 'Primer mes yendo 5 días a la semana al gimnasio',
      description: 'Cero excusas. La consistencia le gana a la motivación. La fuerza y la energía han subido notablemente.',
      category: 'HEALTH',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
      visibility: 'FRIENDS',
    },
  });

  await prisma.achievement.create({
    data: {
      userId: carlos.id,
      title: 'Publiqué mi primer paquete open-source en npm',
      description: 'Una librería ligera de utilidades matemáticas que ya superó las 500 descargas en su primera semana.',
      category: 'WORK',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      visibility: 'FRIENDS',
    },
  });

  await prisma.achievement.create({
    data: {
      userId: carlos.id,
      title: 'Aprendí a tocar los acordes básicos en guitarra acústica',
      description: 'Ya puedo tocar "Wish You Were Here" y "Wonderwall" sin trabarme al cambiar de acorde.',
      category: 'CREATIVITY',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
      visibility: 'FRIENDS',
    },
  });

  const a10 = await prisma.achievement.create({
    data: {
      userId: lucia.id,
      title: '¡Defendí mi tesis de maestría con mención de honor!',
      description: 'Investigación sobre modelos predictivos aplicados a la calidad del aire. Gracias a todos por el apoyo.',
      category: 'STUDIES',
      date: new Date(Date.now() - 1000 * 60 * 60 * 12), // hace 12 horas
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
      visibility: 'FRIENDS',
    },
  });

  await prisma.achievement.create({
    data: {
      userId: lucia.id,
      title: 'Completé la ruta de senderismo de 25 km en los Picos',
      description: 'Desnivel acumulado de +1400m con vistas impresionantes. Las piernas cansadas pero el alma llena.',
      category: 'HEALTH',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
      visibility: 'FRIENDS',
    },
  });

  await prisma.achievement.create({
    data: {
      userId: lucia.id,
      title: 'Di mi primera charla ante 200 personas en la conferencia tech',
      description: 'Vencí los nervios de hablar en público y recibí feedback muy constructivo sobre nuestro caso de uso.',
      category: 'WORK',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9),
      visibility: 'FRIENDS',
    },
  });

  const a13 = await prisma.achievement.create({
    data: {
      userId: diego.id,
      title: 'Lancé mi newsletter semanal sobre diseño de producto',
      description: 'Primera edición enviada a 120 suscriptores. Trata sobre accesibilidad y tipografía en interfaces móviles.',
      category: 'CREATIVITY',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      visibility: 'FRIENDS',
    },
  });

  await prisma.achievement.create({
    data: {
      userId: diego.id,
      title: 'Leí 12 libros en lo que va del año',
      description: 'Cambié 30 minutos de redes sociales nocturnas por lectura antes de dormir. Hábito 100% recomendado.',
      category: 'PERSONAL',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 11),
      visibility: 'FRIENDS',
    },
  });

  await prisma.achievement.create({
    data: {
      userId: diego.id,
      title: 'Mi huerto urbano en el balcón dio sus primeros tomates cherry',
      description: 'Después de semanas cuidando las plantas, regando y abonando, hoy cosechamos la primera ensalada.',
      category: 'OTHER',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 13),
      imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80',
      visibility: 'FRIENDS',
    },
  });

  console.log('✅ 15 logros creados (incluyendo 1 privado).');

  // 4. Crear Reacciones
  // En el maratón de Juan (a1)
  await prisma.reaction.createMany({
    data: [
      { achievementId: a1.id, userId: sofia.id, type: 'CELEBRATE' },
      { achievementId: a1.id, userId: sofia.id, type: 'STRONG' },
      { achievementId: a1.id, userId: carlos.id, type: 'CLAP' },
      { achievementId: a1.id, userId: carlos.id, type: 'HEART' },
    ],
  });

  // En la certificación de Sofía (a4)
  await prisma.reaction.createMany({
    data: [
      { achievementId: a4.id, userId: juan.id, type: 'CELEBRATE' },
      { achievementId: a4.id, userId: lucia.id, type: 'HEART' },
      { achievementId: a4.id, userId: lucia.id, type: 'CLAP' },
    ],
  });

  // En la tesis de Lucía (a10)
  await prisma.reaction.createMany({
    data: [
      { achievementId: a10.id, userId: sofia.id, type: 'CELEBRATE' },
      { achievementId: a10.id, userId: diego.id, type: 'CLAP' },
      { achievementId: a10.id, userId: diego.id, type: 'HEART' },
    ],
  });

  console.log('✅ Reacciones creadas.');

  // 5. Crear Comentarios
  await prisma.comment.createMany({
    data: [
      {
        achievementId: a1.id,
        userId: sofia.id,
        content: '¡Qué bárbaro Juan! Esos madrugones valieron toda la pena, ¡muchas felicidades!',
      },
      {
        achievementId: a1.id,
        userId: carlos.id,
        content: '¡Tremendo tiempo hermano! El próximo año vamos juntos por esos 42K.',
      },
      {
        achievementId: a4.id,
        userId: juan.id,
        content: '¡Enhorabuena Sofi! Muy merecido por todo el esfuerzo que le pusiste.',
      },
      {
        achievementId: a10.id,
        userId: sofia.id,
        content: '¡Mención de honor! Eres una inspiración total Lucía, súper orgullosa de ti.',
      },
      {
        achievementId: a7.id,
        userId: diego.id,
        content: '¡Esa es la actitud Carlos! Vamos por ese segundo mes con toda.',
      },
    ],
  });

  console.log('✅ Comentarios creados.');

  // 6. Notificaciones iniciales de ejemplo
  await prisma.notification.createMany({
    data: [
      {
        userId: juan.id,
        actorId: sofia.id,
        achievementId: a1.id,
        type: 'COMMENT',
        message: 'Sofía Martínez comentó en tu logro: "¡Completé mi primer maratón de 42K!"',
        read: false,
      },
      {
        userId: juan.id,
        actorId: carlos.id,
        achievementId: a1.id,
        type: 'REACTION',
        message: 'Carlos Gómez reaccionó con 👏 a tu logro: "¡Completé mi primer maratón de 42K!"',
        read: true,
      },
      {
        userId: diego.id,
        actorId: sofia.id,
        type: 'FRIEND_REQUEST',
        message: 'Sofía Martínez te ha enviado una solicitud de amistad',
        read: false,
      },
    ],
  });

  console.log('✅ Notificaciones de prueba creadas.');
  console.log('✨ Seed completado con éxito.');
}

main()
  .catch((e) => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
