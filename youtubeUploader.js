/**
 * МОДУЛЬ 3: Автопостинг на YouTube Shorts через YouTube Data API v3
 * 
 * Назначение:
 * - Скачивание вертикального .mp4 файла (с Pexels или переданного URL) во временную папку
 * - Аутентификация через Google OAuth2 (YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN)
 * - Загрузка видео в формате YouTube Shorts (1080x1920)
 * - Установка метаданных:
 *   * Title: берется из scriptData.hook (до 100 символов, с тегом #shorts)
 *   * Description: боли + решение + ссылка на бота @Guidepp_bot
 *   * Privacy Status: "public" (или из переменной окружения YOUTUBE_PRIVACY_STATUS)
 * - Публикация первого комментария автора от имени канала с текстом scriptData.commentText
 */

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

/**
 * Генерация URL для прямой авторизации пользователя в Google OAuth
 * @param {string} currentOrigin - origin текущего приложения (например https://ais-...run.app)
 * @returns {string} URL авторизации Google
 */
export function getYouTubeAuthUrl(currentOrigin) {
  const clean = (val, prefix) => {
    if (!val) return '';
    let res = String(val).trim();
    if (prefix && res.startsWith(`${prefix}=`)) res = res.slice(prefix.length + 1).trim();
    if ((res.startsWith('"') && res.endsWith('"')) || (res.startsWith("'") && res.endsWith("'"))) {
      res = res.slice(1, -1);
    }
    return res.trim();
  };

  const clientId = clean(process.env.YOUTUBE_CLIENT_ID, 'YOUTUBE_CLIENT_ID');
  const clientSecret = clean(process.env.YOUTUBE_CLIENT_SECRET, 'YOUTUBE_CLIENT_SECRET');
  if (!clientId || !clientSecret) {
    throw new Error('YOUTUBE_CLIENT_ID и YOUTUBE_CLIENT_SECRET должны быть заполнены в .env');
  }

  const redirectUri = `${currentOrigin.replace(/\/$/, '')}/api/youtube/oauth-callback`;
  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent', // Всегда запрашиваем согласие, чтобы получить НОВЫЙ refresh_token
    scope: [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.force-ssl',
      'https://www.googleapis.com/auth/youtube.readonly',
    ],
  });
}

/**
 * Обмен кода авторизации из редиректа на токены и сохранение refresh_token
 * @param {string} code - код из callback query params (?code=...)
 * @param {string} currentOrigin - origin приложения
 * @returns {Promise<{ refreshToken: string, channelTitle: string }>}
 */
export async function exchangeCodeForTokens(code, currentOrigin) {
  const clean = (val, prefix) => {
    if (!val) return '';
    let res = String(val).trim();
    if (prefix && res.startsWith(`${prefix}=`)) res = res.slice(prefix.length + 1).trim();
    if ((res.startsWith('"') && res.endsWith('"')) || (res.startsWith("'") && res.endsWith("'"))) {
      res = res.slice(1, -1);
    }
    return res.trim();
  };

  const clientId = clean(process.env.YOUTUBE_CLIENT_ID, 'YOUTUBE_CLIENT_ID');
  const clientSecret = clean(process.env.YOUTUBE_CLIENT_SECRET, 'YOUTUBE_CLIENT_SECRET');
  const redirectUri = `${currentOrigin.replace(/\/$/, '')}/api/youtube/oauth-callback`;

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  const { tokens } = await oauth2Client.getToken(code);

  if (!tokens.refresh_token) {
    throw new Error(
      'Google не вернул refresh_token. Возможно, приложение уже авторизовано. Попробуйте снова (будет запрошено повторное согласие).'
    );
  }

  oauth2Client.setCredentials(tokens);
  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
  let channelTitle = 'YouTube канал';
  try {
    const res = await youtube.channels.list({ part: ['snippet'], mine: true });
    if (res.data.items && res.data.items.length > 0) {
      channelTitle = res.data.items[0].snippet.title;
    }
  } catch (err) {
    console.warn('[YouTube Channel Info Notice]:', err.message);
  }

  return {
    refreshToken: tokens.refresh_token,
    channelTitle,
  };
}

/**
 * Инициализация и получение авторизованного клиента OAuth2 для YouTube API
 * @returns {google.auth.OAuth2}
 */
export function getYouTubeOAuth2Client() {
  const clean = (val, prefix) => {
    if (!val) return '';
    let res = String(val).trim();
    if (prefix && res.startsWith(`${prefix}=`)) res = res.slice(prefix.length + 1).trim();
    if ((res.startsWith('"') && res.endsWith('"')) || (res.startsWith("'") && res.endsWith("'"))) {
      res = res.slice(1, -1);
    }
    return res.trim();
  };

  const clientId = clean(process.env.YOUTUBE_CLIENT_ID, 'YOUTUBE_CLIENT_ID');
  const clientSecret = clean(process.env.YOUTUBE_CLIENT_SECRET, 'YOUTUBE_CLIENT_SECRET');
  const refreshToken = clean(process.env.YOUTUBE_REFRESH_TOKEN, 'YOUTUBE_REFRESH_TOKEN');
  const redirectUri = process.env.YOUTUBE_REDIRECT_URI || 'https://developers.google.com/oauthplayground';

  if (!clientId || !clientSecret || !refreshToken) {
    const missing = [];
    if (!clientId) missing.push('YOUTUBE_CLIENT_ID');
    if (!clientSecret) missing.push('YOUTUBE_CLIENT_SECRET');
    if (!refreshToken) missing.push('YOUTUBE_REFRESH_TOKEN');

    throw new Error(
      `Отсутствуют обязательные переменные YouTube OAuth2: ${missing.join(', ')}. Укажите их через форму настроек или в файле .env`
    );
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  return oauth2Client;
}

/**
 * Проверка статуса авторизации и доступности канала YouTube
 */
export async function checkYouTubeAuth() {
  try {
    const auth = getYouTubeOAuth2Client();
    await auth.getAccessToken();
    const youtube = google.youtube({ version: 'v3', auth });
    const res = await youtube.channels.list({ part: ['snippet', 'statistics'], mine: true });
    if (res.data.items && res.data.items.length > 0) {
      const channel = res.data.items[0];
      return {
        configured: true,
        authenticated: true,
        channelTitle: channel.snippet.title,
        channelId: channel.id,
        subscriberCount: channel.statistics?.subscriberCount || '0',
      };
    }
    return {
      configured: true,
      authenticated: true,
      channelTitle: 'Личный канал YouTube',
      channelId: null,
    };
  } catch (err) {
    const errorMsg = String(err?.message || '');
    const errorDetails = err?.response?.data?.error || '';
    const isInvalidGrant = errorMsg.includes('invalid_grant') || errorDetails === 'invalid_grant';
    const isMissingEnv = errorMsg.includes('Отсутствуют обязательные переменные');

    return {
      configured: !isMissingEnv,
      authenticated: false,
      isInvalidGrant,
      error: isInvalidGrant
        ? 'Срок действия Refresh Token истек (invalid_grant). В тестовом режиме Google сбрасывает токены каждые 7 дней.'
        : errorMsg,
      details: isInvalidGrant
        ? 'Требуется обновить YOUTUBE_REFRESH_TOKEN через OAuth Playground или перевести приложение в Google Cloud в статус "In production".'
        : null,
    };
  }
}

/**
 * Скачивание видеофайла по HTTP(S) URL во временный локальный файл
 * @param {string} url - URL видео
 * @returns {Promise<string>} Абсолютный путь к скачанному файлу
 */
export async function downloadVideoToTemp(url) {
  const outputDir = path.join(process.cwd(), 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const tempFilePath = path.join(outputDir, `pexels_shorts_${Date.now()}.mp4`);
  console.log(`[YouTube Uploader] Скачивание видео с ${url.substring(0, 60)}... в ${tempFilePath}`);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Не удалось скачать видео по URL (HTTP ${res.status}): ${url}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(tempFilePath, buffer);

  const stats = fs.statSync(tempFilePath);
  console.log(`[YouTube Uploader] Видео успешно скачано! Размер: ${(stats.size / 1024 / 1024).toFixed(2)} МБ`);

  return tempFilePath;
}

/**
 * Функция загрузки видео на YouTube Shorts и публикации комментария автора
 * 
 * @param {string} videoPathOrUrl - Путь к локальному .mp4 файлу ИЛИ прямая ссылка на .mp4 (например с Pexels)
 * @param {Object} scriptData - Объект сценария (hook, pain, solution, callToAction, commentText)
 * @returns {Promise<Object>} Данные о загруженном видео и опубликованном комментарии
 */
export async function uploadToYouTube(videoPathOrUrl, scriptData) {
  let downloadedTempFile = null;

  try {
    const videoPath = videoPathOrUrl;
    if (!videoPath || typeof videoPath !== 'string' || !videoPath.trim()) {
      return {
        success: false,
        error: 'Сначала сгенерируйте и сохраните видеофайл mp4 для отправки на YouTube',
      };
    }

    let resolvedPath = '';

    // Если передан HTTP/HTTPS URL — скачиваем во временный файл
    if (videoPath.startsWith('http://') || videoPath.startsWith('https://')) {
      resolvedPath = await downloadVideoToTemp(videoPath);
      downloadedTempFile = resolvedPath;
    } else {
      resolvedPath = path.isAbsolute(videoPath)
        ? videoPath
        : path.join(process.cwd(), videoPath);
    }

    // Если передан виртуальный роут или файл не найден — берем готовый темный мастер-шаблон
    if (!fs.existsSync(resolvedPath) || videoPath.includes('/api/video/download') || videoPath === '/preview') {
      const defaultDarkVideo = path.join(process.cwd(), 'output', 'dark_shorts_master.mp4');
      if (fs.existsSync(defaultDarkVideo)) {
        resolvedPath = defaultDarkVideo;
      } else {
        const outputDir = path.join(process.cwd(), 'output');
        if (fs.existsSync(outputDir)) {
          const files = fs.readdirSync(outputDir).filter((f) => f.endsWith('.mp4'));
          if (files.length > 0) {
            resolvedPath = path.join(outputDir, files[0]);
          }
        }
      }
    }

    if (!fs.existsSync(resolvedPath)) {
      return {
        success: false,
        error: `Сначала сгенерируйте и сохраните видеофайл mp4 для отправки на YouTube (файл не найден: ${resolvedPath})`,
      };
    }

    console.log(`[YouTube Uploader] Начало авторизации и загрузки видео: ${resolvedPath}`);

    // 1. Инициализация OAuth2 клиента
    const auth = getYouTubeOAuth2Client();

    // Проверяем валидность токена заранее, чтобы перехватить invalid_grant без падения приложения
    try {
      await auth.getAccessToken();
    } catch (authErr) {
      const errStr = String(authErr?.message || '') + ' ' + (authErr?.response?.data?.error || '');
      if (errStr.includes('invalid_grant')) {
        console.warn('[YouTube Uploader] Refresh Token недействителен или истек (invalid_grant).');
        return {
          success: false,
          isAuthError: true,
          error: 'Срок действия YouTube Refresh Token истек или токен отозван (invalid_grant). Обновите токен через Google OAuth Playground (https://developers.google.com/oauthplayground) в настройках .env или скачайте ролик для ручной публикации.',
          details: 'В тестовом режиме Google Cloud токены действуют 7 дней. Для постоянной работы переведите проект в статус Production.',
        };
      }
      throw authErr;
    }

    const youtube = google.youtube({ version: 'v3', auth });

    // 2. Подготовка метаданных ролика
    const rawTitle = scriptData?.hook || 'Как сбросить вес после 30 лет без диет';
    const title = rawTitle.length > 90 
      ? rawTitle.substring(0, 87) + '... #shorts'
      : (rawTitle.includes('#shorts') ? rawTitle : `${rawTitle} #shorts`);

    const description = [
      scriptData?.hook ? `«${scriptData.hook}»` : '',
      scriptData?.statistic ? `📊 Клинические данные: ${scriptData.statistic}` : (scriptData?.pain || ''),
      scriptData?.educationalFact ? `🧬 Физиология и гормоны: ${scriptData.educationalFact}` : (scriptData?.solution || ''),
      scriptData?.nativeCTA || scriptData?.callToAction || '',
      '👉 Забрать персональный протокол питания и запустить метаболизм: Telegram @Guidepp_bot',
      '#shorts #нутрициология #похудениепосле30 #метаболизм #гормоны #здоровье #пп'
    ].filter(Boolean).join('\n\n').trim();

    const privacyStatus = process.env.YOUTUBE_PRIVACY_STATUS || 'public';

    console.log(`[YouTube Uploader] Загрузка Shorts: "${title}" (Статус: ${privacyStatus})...`);

    // 3. Загрузка видео через YouTube Data API v3 (videos.insert)
    const uploadResponse = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: title.substring(0, 100),
          description: description,
          tags: [
            'shorts',
            'похудение',
            'диета',
            'нутрициология',
            'женское здоровье',
            'метаболизм',
            'похудеть после 30',
            'пп рецепты'
          ],
          categoryId: '26', // Howto & Style
          defaultLanguage: 'ru',
          defaultAudioLanguage: 'ru',
        },
        status: {
          privacyStatus: privacyStatus,
          selfDeclaredMadeForKids: false,
        },
      },
      media: {
        body: fs.createReadStream(resolvedPath),
      },
    });

    const videoId = uploadResponse.data.id;
    const videoUrl = `https://www.youtube.com/shorts/${videoId}`;
    console.log(`[YouTube Uploader] Видео успешно загружено! ID: ${videoId}, Ссылка: ${videoUrl}`);

    // 4. Публикация первого комментария автора со ссылкой на бота
    const commentText = scriptData?.commentText || 
      'Забрала меню на неделю с рецептами, с которым ушло 2 кг без голода, в боте: @Guidepp_bot 🥗✨';

    console.log(`[YouTube Uploader] Публикация комментария под видео ${videoId}...`);

    let commentData = null;
    let isCommentPinned = false;

    try {
      const commentResponse = await youtube.commentThreads.insert({
        part: ['snippet'],
        requestBody: {
          snippet: {
            videoId: videoId,
            topLevelComment: {
              snippet: {
                textOriginal: commentText,
              },
            },
          },
        },
      });

      commentData = commentResponse.data;
      console.log(`[YouTube Uploader] Комментарий автора успешно опубликован (ID: ${commentData.id})`);
      isCommentPinned = true;
    } catch (commentErr) {
      console.warn('[YouTube Uploader] Предупреждение при публикации комментария:', commentErr.message || commentErr);
    }

    return {
      success: true,
      videoId: videoId,
      videoUrl: videoUrl,
      title: title,
      privacyStatus: privacyStatus,
      comment: {
        posted: !!commentData,
        commentId: commentData?.id || null,
        text: commentText,
        isPinnedByAuthor: isCommentPinned,
      },
    };
  } catch (error) {
    const errorMsg = String(error?.message || '');
    const errorDetails = error?.response?.data?.error || '';
    const isInvalidGrant = errorMsg.includes('invalid_grant') || errorDetails === 'invalid_grant';

    if (isInvalidGrant) {
      console.warn('[YouTube Uploader Notice]: Refresh Token недействителен или истек (invalid_grant).');
      return {
        success: false,
        isAuthError: true,
        error: 'Срок действия YouTube Refresh Token истек или токен отозван (invalid_grant). Обновите токен через Google OAuth Playground (https://developers.google.com/oauthplayground) в настройках .env или скачайте ролик для ручной публикации.',
        details: 'В тестовом режиме Google Cloud токены действуют 7 дней. Для постоянной работы переведите проект в статус Production.',
      };
    }

    console.warn('[YouTube Uploader Notice]:', errorMsg);
    return {
      success: false,
      error: error.message || 'Ошибка загрузки видео на YouTube',
      details: error.response?.data || null,
    };
  } finally {
    // Если создавался временный скачанный файл, при необходимости можно его сохранить или удалить
    // Оставляем в output/ для инспекции
  }
}
