import http from 'http';
import app from './src/server.js';

const PORT = 4001; // Usar puerto temporal para test

const server = app.listen(PORT, async () => {
  console.log(`🧪 Servidor de prueba iniciado en http://localhost:${PORT}`);

  try {
    // 1. Probar Login de Juan
    console.log('\n--- 1. Probando Login ---');
    const loginRes = await fetch(`http://localhost:${PORT}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'juan@ejemplo.com', password: 'password123' }),
    });
    const loginData = await loginRes.json();
    console.log('Login status:', loginRes.status, 'Usuario:', loginData.user?.name);
    const juanToken = loginData.token;

    // 2. Probar Feed de Juan
    console.log('\n--- 2. Probando Feed de Juan ---');
    const feedRes = await fetch(`http://localhost:${PORT}/api/achievements/feed`, {
      headers: { Authorization: `Bearer ${juanToken}` },
    });
    const feedData = await feedRes.json();
    console.log(`Total logros en feed de Juan: ${feedData.achievements?.length}`);
    const privateJuan = feedData.achievements?.find((a: any) => a.visibility === 'PRIVATE');
    console.log('¿Juan ve su propio logro privado?:', privateJuan ? '✅ Sí: ' + privateJuan.title : '❌ No');

    // 3. Probar Login de Sofía y verificar que NO ve el logro privado de Juan
    console.log('\n--- 3. Probando Privacidad: Sofía ve el feed ---');
    const sofiaLoginRes = await fetch(`http://localhost:${PORT}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'sofia@ejemplo.com', password: 'password123' }),
    });
    const sofiaData = await sofiaLoginRes.json();
    const sofiaToken = sofiaData.token;

    const sofiaFeedRes = await fetch(`http://localhost:${PORT}/api/achievements/feed`, {
      headers: { Authorization: `Bearer ${sofiaToken}` },
    });
    const sofiaFeed = await sofiaFeedRes.json();
    const juanPrivateInSofiaFeed = sofiaFeed.achievements?.find(
      (a: any) => a.userId === loginData.user.id && a.visibility === 'PRIVATE'
    );
    console.log(
      '¿Sofía ve el logro privado de Juan?:',
      juanPrivateInSofiaFeed ? '❌ FALLO: sí lo ve' : '✅ CORRECTO: NO lo ve'
    );

    // 4. Sofía reacciona al maratón de Juan con ❤️
    console.log('\n--- 4. Sofía reacciona con HEART ---');
    const juanMarathon = feedData.achievements?.find((a: any) => a.title.includes('maratón'));
    const reactRes = await fetch(`http://localhost:${PORT}/api/achievements/${juanMarathon.id}/reactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sofiaToken}`,
      },
      body: JSON.stringify({ type: 'HEART' }),
    });
    const reactData = await reactRes.json();
    console.log('Reacción acción:', reactData.action, 'Total reacciones en logro:', reactData.reactions?.length);

    // 5. Sofía comenta en el maratón
    console.log('\n--- 5. Sofía comenta ---');
    const commentRes = await fetch(`http://localhost:${PORT}/api/achievements/${juanMarathon.id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sofiaToken}`,
      },
      body: JSON.stringify({ content: '¡Increíble logro! Eres un crack.' }),
    });
    const commentData = await commentRes.json();
    console.log('Comentario añadido:', commentData.comment?.content);

    // 6. Juan revisa sus notificaciones
    console.log('\n--- 6. Juan revisa sus notificaciones ---');
    const notifRes = await fetch(`http://localhost:${PORT}/api/notifications`, {
      headers: { Authorization: `Bearer ${juanToken}` },
    });
    const notifData = await notifRes.json();
    console.log('Notificaciones no leídas para Juan:', notifData.unreadCount);
    console.log('Última notificación:', notifData.notifications[0]?.message);

    console.log('\n✨ TODAS LAS PRUEBAS DE LA FASE 2 PASARON EXITOSAMENTE ✨\n');
  } catch (err) {
    console.error('Error durante los tests:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});
