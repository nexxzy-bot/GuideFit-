import express from 'express';
import path from 'path';
import fs from 'fs';
import { Readable } from 'stream';
import { createServer as createViteServer } from 'vite';
import {
  generateVideoScript,
  getCuratedExpertScript,
  autoPostPipeline,
  saveEnvConfig,
  loadHistory,
  checkTopicUniqueness,
  deleteHistoryItem,
  clearHistory,
  formatGeminiError,
} from './app.js';
import { renderVideo, getLastGeneratedHtml } from './videoRenderer.js';
import { uploadToYouTube, checkYouTubeAuth, getYouTubeAuthUrl, exchangeCodeForTokens } from './youtubeUploader.js';

const app = express();
const PORT = 3000;

app.use(express.json());

// Статическая папка для сгенерированных и скачанных видео
app.use('/output', express.static(path.join(process.cwd(), 'output')));

// API: Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    pexelsConfigured: Boolean(process.env.PEXELS_API_KEY),
    youtubeConfigured: Boolean(
      process.env.YOUTUBE_CLIENT_ID &&
      process.env.YOUTUBE_CLIENT_SECRET &&
      process.env.YOUTUBE_REFRESH_TOKEN
    ),
  });
});

// Эндпоинт прямого просмотра HTML-шаблона с фоновым видео
app.get('/preview', (req, res) => {
  const html = getLastGeneratedHtml();
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

// Эндпоинт прямого скачивания MP4 видео для Instagram Reels и TikTok
app.get('/api/video/download', async (req, res) => {
  try {
    const rawUrl = (req.query.url as string) || '';
    const customFilename = (req.query.filename as string) || `reels_guidepp_${Date.now()}.mp4`;
    const safeFilename = customFilename.replace(/[^a-zA-Z0-9_\-\.]/g, '_');

    let targetUrl = rawUrl;
    if (!targetUrl) {
      const outputDir = path.join(process.cwd(), 'output');
      if (fs.existsSync(outputDir)) {
        const files = fs.readdirSync(outputDir).filter((f) => f.endsWith('.mp4'));
        if (files.length > 0) {
          files.sort(
            (a, b) =>
              fs.statSync(path.join(outputDir, b)).mtimeMs -
              fs.statSync(path.join(outputDir, a)).mtimeMs
          );
          targetUrl = path.join(outputDir, files[0]);
        }
      }
    }

    if (!targetUrl) {
      const darkMaster = path.join(process.cwd(), 'output', 'dark_shorts_master.mp4');
      if (fs.existsSync(darkMaster)) {
        targetUrl = darkMaster;
      }
    }

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);

    if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
      const response = await fetch(targetUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} при получении видео`);
      }
      const contentLength = response.headers.get('content-length');
      if (contentLength) res.setHeader('Content-Length', contentLength);

      if (response.body) {
        Readable.fromWeb(response.body as any).pipe(res);
      } else {
        const arrayBuf = await response.arrayBuffer();
        res.send(Buffer.from(arrayBuf));
      }
    } else {
      const localPath = path.isAbsolute(targetUrl) ? targetUrl : path.join(process.cwd(), targetUrl);
      if (!fs.existsSync(localPath)) {
        return res.status(404).send('Видеофайл не найден на сервере');
      }
      fs.createReadStream(localPath).pipe(res);
    }
  } catch (err: any) {
    console.error('[Video Download Error]:', err);
    res.status(500).send(`Ошибка при скачивании видео: ${err.message}`);
  }
});

// Получение текущих значений конфигурации
app.get('/api/config/get-env', (req, res) => {
  res.json({
    success: true,
    config: {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
      PEXELS_API_KEY: process.env.PEXELS_API_KEY || '',
      YOUTUBE_CLIENT_ID: process.env.YOUTUBE_CLIENT_ID || '',
      YOUTUBE_CLIENT_SECRET: process.env.YOUTUBE_CLIENT_SECRET || '',
      YOUTUBE_REFRESH_TOKEN: process.env.YOUTUBE_REFRESH_TOKEN || '',
      YOUTUBE_PRIVACY_STATUS: process.env.YOUTUBE_PRIVACY_STATUS || 'public',
    },
  });
});

// Сохранение конфигурации в .env
app.post('/api/config/save-env', (req, res) => {
  try {
    const newConfig = req.body || {};
    const result = saveEnvConfig(newConfig);
    console.log('[Server Config] Переменные окружения сохранены в .env:', result.updatedKeys);
    res.json({
      success: true,
      message: 'Настройки успешно сохранены в .env!',
      updatedKeys: result.updatedKeys,
    });
  } catch (error: any) {
    console.error('[Server Config Save Error]:', error);
    res.status(500).json({ success: false, error: error.message || 'Ошибка сохранения .env' });
  }
});

// ----------------------------------------------------
// ЭНДПОИНТЫ БАЗЫ ИСТОРИИ СЦЕНАРИЕВ (АНТИ-ДУБЛИКАТЫ)
// ----------------------------------------------------

// GET /api/history — Получение списка созданных сценариев для защиты от дублирования
app.get('/api/history', (req, res) => {
  try {
    const history = loadHistory();
    res.json({
      success: true,
      count: history.length,
      history,
      recentAngles: history.slice(0, 5).map((h: any) => h.angle).filter(Boolean),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/history/check — Проверка темы/хука на семантическую уникальность
app.post('/api/history/check', (req, res) => {
  try {
    const topic = req.body?.topic || '';
    const checkResult = checkTopicUniqueness(topic);
    res.json({
      success: true,
      topic,
      ...checkResult,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/history/:id — Удаление сценария из базы истории
app.delete('/api/history/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = deleteHistoryItem(id);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/history/clear — Полная очистка истории
app.post('/api/history/clear', (req, res) => {
  try {
    const result = clearHistory();
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// API: Генерация сценария видео
app.post('/api/script/generate', async (req, res) => {
  const topic = req.body?.topic || 'Почему вес стоит на месте даже на дефиците калорий';
  const forceCurated = Boolean(req.body?.forceCurated);

  try {
    console.log(`[Gemini] Запрос генерации сценария: "${topic}" (forceCurated: ${forceCurated})`);
    
    // Защитный таймаут сервера на случай подвисания сети
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Превышен таймаут ответа сервера (20 сек)')), 20000)
    );

    const result: any = await Promise.race([
      generateVideoScript(topic, forceCurated),
      timeoutPromise,
    ]);

    if (result && result.error) {
      console.warn('[Gemini Server Notice] Ошибка генерации, применяем экспертный сценарий:', result.error);
      const fallbackScript = getCuratedExpertScript(topic);
      return res.json({
        success: true,
        topic,
        data: {
          ...fallbackScript,
          isFallback: true,
          notice: result.error,
        },
      });
    }

    res.json({
      success: true,
      topic,
      data: result,
    });
  } catch (error: any) {
    const cleanNotice = formatGeminiError(error);
    console.log('[Gemini Server Route Notice]:', cleanNotice);
    // Мгновенный спасательный круг: никогда не оставляем пользователя без готового сценария
    try {
      const fallbackScript = getCuratedExpertScript(topic);
      res.json({
        success: true,
        topic,
        data: {
          ...fallbackScript,
          isFallback: true,
          notice: cleanNotice,
        },
      });
    } catch (fbErr: any) {
      res.status(500).json({
        success: false,
        error: cleanNotice,
      });
    }
  }
});

app.get('/api/script/generate', async (req, res) => {
  const topic = (req.query.topic as string) || 'Почему вес стоит на месте даже на дефиците калорий';
  const forceCurated = req.query.force === 'true';

  try {
    const result: any = await generateVideoScript(topic, forceCurated);

    if (result && result.error) {
      const fallbackScript = getCuratedExpertScript(topic);
      return res.json({
        success: true,
        topic,
        data: {
          ...fallbackScript,
          isFallback: true,
          notice: formatGeminiError(result.error),
        },
      });
    }

    res.json({
      success: true,
      topic,
      data: result,
    });
  } catch (error: any) {
    const cleanNotice = formatGeminiError(error);
    const fallbackScript = getCuratedExpertScript(topic);
    res.json({
      success: true,
      topic,
      data: {
        ...fallbackScript,
        isFallback: true,
        notice: cleanNotice,
      },
    });
  }
});

// API: Рендеринг HTML с Pexels видео
app.post('/api/video/render', async (req, res) => {
  try {
    const { scriptData, query } = req.body || {};

    if (!scriptData || !scriptData.hook) {
      return res.status(400).json({
        success: false,
        error: 'Отсутствуют обязательные данные scriptData',
      });
    }

    console.log('[Express API] Поиск видео Pexels и генерация HTML preview...');
    const renderResult: any = await renderVideo(scriptData, query);

    if (renderResult.error) {
      return res.status(500).json({
        success: false,
        error: renderResult.error,
      });
    }

    res.json(renderResult);
  } catch (err: any) {
    console.error('[API Video Render Error]:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Ошибка генерации превью',
    });
  }
});

// API: Загрузка готового видео на YouTube Shorts с закрепленным комментарием
app.post('/api/youtube/upload', async (req, res) => {
  try {
    const { videoPath, videoUrl, scriptData } = req.body || {};
    const targetVideo = videoPath || videoUrl;

    if (!targetVideo || typeof targetVideo !== 'string' || !targetVideo.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Сначала сгенерируйте и сохраните видеофайл mp4 для отправки на YouTube',
      });
    }

    if (!scriptData) {
      return res.status(400).json({
        success: false,
        error: 'Отсутствуют данные сценария (scriptData)',
      });
    }

    const result = await uploadToYouTube(targetVideo, scriptData);
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (err: any) {
    console.warn('[API YouTube Upload Notice]:', err.message);
    res.status(500).json({
      success: false,
      error: err.message || 'Ошибка загрузки видео на YouTube',
    });
  }
});

// API: Проверка статуса авторизации и доступности канала YouTube
app.get('/api/youtube/status', async (req, res) => {
  try {
    const status = await checkYouTubeAuth();
    res.json(status);
  } catch (err: any) {
    res.status(500).json({
      configured: false,
      authenticated: false,
      error: err.message || 'Ошибка проверки YouTube OAuth',
    });
  }
});

// API: Получение ссылки для входа через Google
app.get('/api/youtube/auth-url', (req, res) => {
  try {
    const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'https';
    const host = (req.headers['x-forwarded-host'] as string) || req.get('host') || 'localhost:3000';
    const currentOrigin = `${proto}://${host}`;

    const authUrl = getYouTubeAuthUrl(currentOrigin);
    res.json({
      success: true,
      authUrl,
      redirectUri: `${currentOrigin}/api/youtube/oauth-callback`,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Не удалось сформировать ссылку авторизации',
    });
  }
});

// Callback Google OAuth2: получение кода и автоматическое сохранение в .env
app.get('/api/youtube/oauth-callback', async (req, res) => {
  try {
    const { code, error } = req.query;

    if (error) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>Ошибка авторизации YouTube</title></head>
        <body style="background:#0E0F12;color:#F43F5E;font-family:sans-serif;padding:30px;text-align:center;">
          <h2>❌ Ошибка авторизации Google</h2>
          <p>${error}</p>
          <button onclick="window.close()" style="padding:10px 20px;background:#333;color:#fff;border:none;border-radius:6px;cursor:pointer;">Закрыть окно</button>
        </body>
        </html>
      `);
    }

    if (!code || typeof code !== 'string') {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>Код авторизации не найден</title></head>
        <body style="background:#0E0F12;color:#F43F5E;font-family:sans-serif;padding:30px;text-align:center;">
          <h2>❌ Код авторизации не получен</h2>
          <p>Google не передал код авторизации.</p>
          <button onclick="window.close()" style="padding:10px 20px;background:#333;color:#fff;border:none;border-radius:6px;cursor:pointer;">Закрыть окно</button>
        </body>
        </html>
      `);
    }

    const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'https';
    const host = (req.headers['x-forwarded-host'] as string) || req.get('host') || 'localhost:3000';
    const currentOrigin = `${proto}://${host}`;

    const { refreshToken, channelTitle } = await exchangeCodeForTokens(code, currentOrigin);

    // Автоматически сохраняем новый токен и redirectUri в .env
    saveEnvConfig({
      YOUTUBE_REFRESH_TOKEN: refreshToken,
      YOUTUBE_REDIRECT_URI: `${currentOrigin}/api/youtube/oauth-callback`,
    });

    console.log(`[YouTube OAuth] Успешно подключен канал "${channelTitle}"! Новый токен сохранен в .env`);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>YouTube канал успешно подключен</title>
        <style>
          body {
            background: #0D0E12;
            color: #F8FAFC;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            box-sizing: border-box;
          }
          .card {
            background: #141720;
            border: 1px solid #10B981;
            border-radius: 12px;
            padding: 32px;
            max-width: 440px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          }
          .icon {
            font-size: 48px;
            margin-bottom: 12px;
          }
          h2 { margin: 0 0 8px 0; color: #34D399; }
          p { color: #94A3B8; font-size: 14px; line-height: 1.5; margin: 0 0 20px 0; }
          .channel-badge {
            background: rgba(16, 185, 129, 0.1);
            color: #10B981;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 15px;
            display: inline-block;
            margin-bottom: 24px;
            border: 1px solid rgba(16, 185, 129, 0.3);
          }
          .btn {
            background: #10B981;
            color: #042F2E;
            font-weight: bold;
            padding: 10px 24px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-size: 14px;
          }
          .btn:hover { background: #34D399; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">🎉</div>
          <h2>Канал успешно подключен!</h2>
          <div class="channel-badge">📺 ${channelTitle}</div>
          <p>Свежий токен доступа сгенерирован и автоматически сохранен в вашей конфигурации. Окно закроется автоматически.</p>
          <button class="btn" onclick="done()">Вернуться в приложение</button>
        </div>
        <script>
          function done() {
            if (window.opener) {
              window.opener.postMessage({ type: 'YOUTUBE_AUTH_SUCCESS', channel: '${channelTitle}' }, '*');
              setTimeout(() => window.close(), 300);
            } else {
              window.location.href = '/';
            }
          }
          setTimeout(done, 1500);
        </script>
      </body>
      </html>
    `);
  } catch (err: any) {
    console.error('[YouTube Callback Error]:', err);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Ошибка подключения YouTube</title></head>
      <body style="background:#0E0F12;color:#F43F5E;font-family:sans-serif;padding:30px;text-align:center;">
        <h2>❌ Ошибка при получении токена</h2>
        <p style="color:#FCA5A5;">${err.message || String(err)}</p>
        <p style="font-size:12px;color:#94A3B8;">Убедитесь, что в Google Cloud Console добавлен Redirect URI: <br/><code>${(req.headers['x-forwarded-proto'] as string || 'https')}://${req.get('host')}/api/youtube/oauth-callback</code></p>
        <button onclick="window.close()" style="padding:10px 20px;background:#333;color:#fff;border:none;border-radius:6px;cursor:pointer;">Закрыть окно</button>
      </body>
      </html>
    `);
  }
});

// API: Сквозной цикл автопостинга (Gemini -> Pexels HTML -> YouTube Shorts -> @Guidepp_bot)
app.post('/api/autopost', async (req, res) => {
  try {
    const topic = req.body?.topic || 'Почему вес стоит на месте даже на дефиците калорий';
    console.log(`[Express /api/autopost] Запуск цепочки для: "${topic}"`);

    const result = await autoPostPipeline(topic);
    res.json(result);
  } catch (err: any) {
    console.warn('[API AutoPost Notice]:', err.message);
    res.status(500).json({
      success: false,
      error: err.message || 'Ошибка автопостинга',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
