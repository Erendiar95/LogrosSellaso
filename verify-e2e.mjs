import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\PacoMS95\\.gemini\\antigravity\\brain\\f53a1c67-ac76-4939-b4c1-ce2f9fe14952';
const SCREENSHOTS_DIR = path.join(ARTIFACTS_DIR, 'capturas');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function runVerification() {
  console.log('🚀 Iniciando verificación en navegador Edge con puppeteer-core...');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,850'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 850 });

  try {
    // 1. Pantalla de Login
    console.log('📸 1. Capturando pantalla de Login...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01-login-screen.png') });

    // 2. Iniciar sesión como Juan Pérez usando botón demo
    console.log('🔑 2. Iniciando sesión como Juan Pérez...');
    const demoButtons = await page.$$('button');
    let juanBtn = null;
    for (const btn of demoButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Juan Pérez')) {
        juanBtn = btn;
        break;
      }
    }
    if (juanBtn) {
      await juanBtn.click();
    } else {
      // Ingresar manualmente si no encuentra botón
      await page.type('input[type="email"]', 'juan@ejemplo.com');
      await page.type('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
    }

    await page.waitForSelector('article', { timeout: 10000 });
    console.log('📸 2. Capturando Feed de logros en escritorio...');
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02-feed-desktop.png') });

    // 3. Abrir modal de publicación y crear un logro
    console.log('📝 3. Publicando un logro con confeti...');
    // Buscar botón de publicar
    const publishBtns = await page.$$('button');
    for (const btn of publishBtns) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Publicar Logro') || text.includes('Compartir logro')) {
        await btn.click();
        break;
      }
    }

    await page.waitForSelector('input[placeholder*="Aprobé"]', { timeout: 5000 });
    await page.type('input[placeholder*="Aprobé"]', '¡Aprobé mi examen de manejo a la primera! 🚗');
    await page.type('textarea', 'Fueron 3 semanas de clases intensivas de aparcamiento y maniobras. ¡Cero faltas en el examen práctico!');

    // Seleccionar categoría Personal
    const catButtons = await page.$$('button');
    for (const btn of catButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Crecimiento Personal')) {
        await btn.click();
        break;
      }
    }

    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03-modal-publicar.png') });

    // Click en publicar
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
    }
    await new Promise(r => setTimeout(r, 1500)); // Esperar confeti y creación
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04-post-publicado-confeti.png') });

    // 4. Reaccionar y comentar
    console.log('💬 4. Reaccionando y comentando...');
    const reactionButtons = await page.$$('article button');
    if (reactionButtons.length > 0) {
      await reactionButtons[0].click(); // Click primera reacción
    }

    // Desplegar comentarios
    for (const btn of reactionButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('comentario') || text.includes('Comentar')) {
        await btn.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 500));

    // Escribir comentario
    const commentInput = await page.$('input[placeholder*="mensaje de ánimo"]');
    if (commentInput) {
      await commentInput.type('¡Muchísimas felicidades! Muy merecido.');
      const sendBtn = await page.$('form button[type="submit"]');
      if (sendBtn) await sendBtn.click();
    }
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05-reacciones-comentarios.png') });

    // 5. Navegar a Amigos
    console.log('👥 5. Navegando a la sección de Amigos...');
    const navButtons = await page.$$('nav button, header button');
    for (const btn of navButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Amigos')) {
        await btn.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06-amigos-lista.png') });

    // 6. Navegar a Perfil
    console.log('👤 6. Navegando al Perfil y estadísticas...');
    for (const btn of navButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Mi Perfil')) {
        await btn.click();
        break;
      }
    }
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07-perfil-rachas-estadisticas.png') });

    // 7. Vista Móvil
    console.log('📱 7. Probando vista Móvil (375x812)...');
    await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
    // Navegar al feed móvil
    const mobileFeedBtn = await page.$('button span');
    await page.evaluate(() => {
      const home = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Feed'));
      if (home) home.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '08-vista-movil-feed.png') });

    // 8. Modo Oscuro
    console.log('🌙 8. Probando Modo Oscuro...');
    await page.evaluate(() => {
      const themeBtn = Array.from(document.querySelectorAll('button')).find(b =>
        b.getAttribute('title')?.includes('Modo')
      );
      if (themeBtn) themeBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '09-modo-oscuro-movil.png') });

    console.log('🎉 ¡Todas las capturas y verificaciones completadas con éxito!');
  } catch (err) {
    console.error('Error durante la verificación:', err);
  } finally {
    await browser.close();
  }
}

runVerification();
