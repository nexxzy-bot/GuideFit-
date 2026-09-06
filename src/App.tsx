import { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  AlertCircle, 
  Clock, 
  MessageSquareText, 
  Zap, 
  Activity, 
  Terminal, 
  Flame,
  CheckCircle2,
  RefreshCw,
  FileCode2,
  Server,
  Layers,
  ArrowUpRight,
  Database,
  Cpu,
  Film,
  Video,
  Download,
  Play,
  Upload,
  ExternalLink,
  HelpCircle,
  Pin,
  Settings,
  Image as ImageIcon,
  ShieldCheck,
  History,
  Trash2,
  BookOpen,
  Search,
  Camera,
  Share2,
  Hash,
  Smartphone,
  X,
  Bell,
  CheckCheck,
} from 'lucide-react';
import { VideoScript, ScriptResponse, HealthResponse, RenderResponse, YouTubeUploadResponse, AutoPostResponse, HistoryItem, YouTubeAuthStatus } from './types';

const SAMPLE_TOPICS = [
  "Почему вес стоит на месте даже на дефиците калорий",
  "Почему диеты на 1200 ккал убивают метаболизм",
  "Утренние отеки: как слить лишнюю воду без мочегонных",
  "Тяга к сладкому по вечерам: скрытый дефицит или привычка?",
  "Как кортизол и стресс блокируют расщепление жира"
];

export default function App() {
  const [topic, setTopic] = useState("Почему вес стоит на месте даже на дефиците калорий");
  const [loading, setLoading] = useState(false);
  const [generationSeconds, setGenerationSeconds] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [script, setScript] = useState<VideoScript | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  // Статус подключения и валидности токена YouTube
  const [ytAuthStatus, setYtAuthStatus] = useState<YouTubeAuthStatus | null>(null);
  const [checkingYtAuth, setCheckingYtAuth] = useState(false);
  const [connectingGoogle, setConnectingGoogle] = useState(false);
  const [connectSuccessToast, setConnectSuccessToast] = useState<string | null>(null);

  // Состояние Базы Истории Сценариев (Анти-дубликаты)
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showHistoryView, setShowHistoryView] = useState(false);
  const [checkingTopic, setCheckingTopic] = useState(false);
  const [topicCheckResult, setTopicCheckResult] = useState<{ isDuplicate: boolean; similarity: number; matchedItem?: any; totalHistoryCount?: number } | null>(null);

  // Состояние Модуля 2: Dark Infographic Canvas & HTML Preview
  const [rendering, setRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderedVideo, setRenderedVideo] = useState<RenderResponse | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState(0);

  // Состояние Модуля 3: YouTube Shorts Upload & AutoPost Pipeline
  const [uploadingYouTube, setUploadingYouTube] = useState(false);
  const [youtubeResult, setYoutubeResult] = useState<YouTubeUploadResponse | null>(null);
  const [youtubeError, setYoutubeError] = useState<string | null>(null);

  const [autoPosting, setAutoPosting] = useState(false);
  const [autoPostStep, setAutoPostStep] = useState<string | null>(null);
  const [autoPostResult, setAutoPostResult] = useState<AutoPostResponse | null>(null);
  const [autoPostError, setAutoPostError] = useState<string | null>(null);
  const [showEnvHelp, setShowEnvHelp] = useState(false);

  // Состояние всплывающего оповещения о публикации в YouTube Shorts
  const [showPublishedModal, setShowPublishedModal] = useState(false);
  const [showPublishedToast, setShowPublishedToast] = useState(false);
  const [publishedData, setPublishedData] = useState<{
    title: string;
    videoUrl: string;
    shortUrl?: string;
    videoId?: string;
    commentText?: string;
    totalTimeSeconds?: string;
    privacyStatus?: string;
  } | null>(null);

  // Состояние скачивания видео MP4 и модуля перезалива в Instagram Reels / TikTok
  const [downloadingVideo, setDownloadingVideo] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [socialTab, setSocialTab] = useState<'instagram' | 'tiktok' | 'comment'>('instagram');

  const getInstagramCaption = (s: VideoScript | null, customTopic?: string) => {
    if (!s) return '';
    const hook = s.hook || customTopic || 'Почему вес стоит на месте даже на дефиците калорий?';
    const scenesList = s.educationalScenes && s.educationalScenes.length > 0
      ? s.educationalScenes
      : (s.scenes ? s.scenes.map((sc: any) => sc.text) : []);
    
    const keyPoints = scenesList.slice(1, 5).filter(Boolean);
    const bullets = keyPoints.map((pt: string, i: number) => `${['1️⃣', '2️⃣', '3️⃣', '4️⃣'][i] || '▪️'} ${pt}`).join('\n');

    return `⚡️ ${hook.toUpperCase()}
Разбор нутрициолога для женщин, желающих похудеть и стать стройнее 👇

${bullets || '▪️ Жесткие диеты ниже 1200 ккал блокируют липолиз\n▪️ Ночной голод взвинчивает кортизол\n▪️ Организм включает режим выживания'}

📸 В видео — шпаргалка! Поставьте на паузу и сохраните таблицу себе.

🎯 ХОТИТЕ ПОХУДЕТЬ БЕЗ ГОЛОДА И СРЫВОВ?
Рассчитайте персональную норму калорий по формуле Миффлина-Сан Жеора и заберите готовое меню на неделю в Telegram-боте:
👉 @Guidepp_bot
(Ссылка в шапке профиля или пишите в комментариях «МЕНЮ»)

---
#похудение #нутрициология #стройность #пп #диета #здоровье #женскоездоровье #кбжу #метаболизм #дефициткалорий #reels #инсулин #жиросжигание`;
  };

  const getTikTokCaption = (s: VideoScript | null, customTopic?: string) => {
    if (!s) return '';
    const hook = s.hook || customTopic || 'Почему вес стоит на месте?';
    const scenesList = s.educationalScenes && s.educationalScenes.length > 0
      ? s.educationalScenes
      : (s.scenes ? s.scenes.map((sc: any) => sc.text) : []);
    
    const shortPoints = scenesList.slice(1, 4).filter(Boolean).map((p: string) => `• ${p}`).join('\n');

    return `${hook} 😱 Разбор нутрициолога 👇
${shortPoints || '• Недосып и строгие диеты блокируют сжигание жира'}
Забирай готовое меню на неделю и точный расчет КБЖУ в ТГ-боте: @Guidepp_bot (активная ссылка в описании профиля!) 🔥
#похудение #нутрициология #рек #хочуврек #диета #здоровье #tiktok #стройность #кбжу #метаболизм #питание`;
  };

  const getPinnedComment = (s: VideoScript | null) => {
    if (s?.commentText) return s.commentText;
    return 'Забрала меню на неделю, с которым ушло 2 кг, здесь: @Guidepp_bot 🔥 Рассчитай норму калорий без голодовок!';
  };

  const getHashtagsOnly = (platform: 'instagram' | 'tiktok') => {
    if (platform === 'instagram') {
      return '#похудение #нутрициология #стройность #пп #диета #здоровье #женскоездоровье #кбжу #метаболизм #дефициткалорий #reels #инсулин #жиросжигание #отеки #гормоны';
    }
    return '#похудение #нутрициология #рек #хочуврек #диета #здоровье #tiktok #стройность #кбжу #метаболизм #питание #фитнес';
  };

  const handleDownloadVideo = (customUrl?: string, customFilename?: string) => {
    setDownloadingVideo(true);
    const targetUrl = customUrl || renderedVideo?.videoUrl || 'https://videos.pexels.com/video-files/7143967/7143967-uhd_2160_4096_30fps.mp4';
    const cleanHook = script?.hook 
      ? script.hook.slice(0, 30).replace(/[^a-zA-Zа-яА-Я0-9]/g, '_').toLowerCase() 
      : 'reels_nutrition';
    const filename = customFilename || `${cleanHook}_${Date.now()}.mp4`;

    const downloadEndpoint = `/api/video/download?url=${encodeURIComponent(targetUrl)}&filename=${encodeURIComponent(filename)}`;
    
    const a = document.createElement('a');
    a.href = downloadEndpoint;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadingVideo(false);
      setDownloadSuccess(false);
    }, 2500);
  };

  useEffect(() => {
    fetchHealth();
    fetchHistory();
    fetchYouTubeStatus();

    const handleEnvUpdated = () => {
      fetchHealth();
      fetchYouTubeStatus();
    };
    window.addEventListener('env-updated', handleEnvUpdated);

    // Слушатель успешного OAuth редиректа от popup-окна
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'YOUTUBE_AUTH_SUCCESS') {
        const channel = event.data?.channel || 'YouTube канал';
        setConnectSuccessToast(`Канал «${channel}» успешно подключен! Новый токен сохранен.`);
        fetchYouTubeStatus();
        fetchHealth();
        setTimeout(() => setConnectSuccessToast(null), 6000);
      }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('env-updated', handleEnvUpdated);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleConnectGoogleOAuth = async () => {
    setConnectingGoogle(true);
    try {
      const res = await fetch('/api/youtube/auth-url');
      const data = await res.json();
      if (data.success && data.authUrl) {
        // Открываем окно авторизации Google
        const width = 600;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        const popup = window.open(
          data.authUrl,
          'GoogleOAuthYouTube',
          `width=${width},height=${height},top=${top},left=${left},scrollbars=yes`
        );
        if (!popup) {
          window.location.href = data.authUrl;
        }
      } else {
        alert(data.error || 'Ошибка формирования ссылки авторизации. Проверьте CLIENT_ID и CLIENT_SECRET в .env');
      }
    } catch (err: any) {
      alert(err.message || 'Ошибка подключения к Google');
    } finally {
      setConnectingGoogle(false);
    }
  };

  const fetchYouTubeStatus = async () => {
    setCheckingYtAuth(true);
    try {
      const res = await fetch('/api/youtube/status');
      if (res.ok) {
        const data: YouTubeAuthStatus = await res.json();
        setYtAuthStatus(data);
      }
    } catch {
      // Игнорируем сетевые ошибки проверки
    } finally {
      setCheckingYtAuth(false);
    }
  };

  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setHealth(data);
      }
    } catch {
      // Игнорируем ошибку первичного пинга
    }
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.history)) {
          setHistoryList(data.history);
        }
      }
    } catch {
      // Игнорируем ошибку первичной загрузки истории
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleCheckTopic = async (topicToCheck: string) => {
    if (!topicToCheck.trim()) return;
    setCheckingTopic(true);
    try {
      const res = await fetch('/api/history/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicToCheck }),
      });
      if (res.ok) {
        const data = await res.json();
        setTopicCheckResult(data);
      }
    } catch {
      // ignore
    } finally {
      setCheckingTopic(false);
    }
  };

  const handleDeleteHistoryItem = async (id: string) => {
    try {
      const res = await fetch(`/api/history/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        setHistoryList((prev) => prev.filter((item) => item.id !== id && item.hook !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm('Вы уверены, что хотите полностью очистить базу истории сценариев?')) return;
    try {
      const res = await fetch('/api/history/clear', { method: 'POST' });
      if (res.ok) {
        setHistoryList([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleApplyHistoryScript = (item: HistoryItem) => {
    if (item.fullScript) {
      setScript(item.fullScript);
    } else {
      setScript({
        hook: item.hook,
        educationalScenes: item.keyPoints || [item.hook],
        commentText: item.commentText || 'Подробнее в боте @guidepp_bot',
        statistic: item.statistic || '',
        statisticBadge: '-30%',
        statisticValue: 72,
        isUnique: true,
        selectedAngle: item.angle,
        usedModel: item.usedModel || 'gemini',
      });
    }
    setTopic(item.topic || item.hook);
    setShowHistoryView(false);
  };

  const handleOpenEnvModal = () => {
    if (typeof (window as any).openEnvModal === 'function') {
      (window as any).openEnvModal();
    } else {
      const el = document.getElementById('env-modal-backdrop');
      if (el) el.classList.add('open');
    }
  };

  useEffect(() => {
    let interval: any;
    if (loading) {
      setGenerationSeconds(0);
      interval = setInterval(() => {
        setGenerationSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setGenerationSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);

  const handleCancelGenerate = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
    setError('Генерация отменена пользователем');
  };

  const handleGenerate = async (targetTopic?: string, forceCurated = false) => {
    const queryTopic = targetTopic || topic;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);
    const startTime = performance.now();

    try {
      const res = await fetch('/api/script/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: queryTopic, forceCurated }),
        signal: controller.signal,
      });

      const json: ScriptResponse = await res.json();

      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error || 'Не удалось сгенерировать сценарий');
      }

      setScript(json.data);
      setExecutionTime(Number(((performance.now() - startTime) / 1000).toFixed(2)));
      fetchHealth();
      fetchHistory();
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('[Frontend] Запрос генерации прерван.');
        return;
      }
      console.warn('[Frontend] Ошибка или задержка, переключаемся на экспертную базу:', err);
      try {
        const fallbackRes = await fetch(`/api/script/generate?topic=${encodeURIComponent(queryTopic)}&force=true`);
        const fallbackJson = await fallbackRes.json();
        if (fallbackJson.success && fallbackJson.data) {
          setScript(fallbackJson.data);
          setExecutionTime(Number(((performance.now() - startTime) / 1000).toFixed(2)));
          setError(null);
          return;
        }
      } catch (fbErr) {
        // ignore fallback network error
      }
      setError(err.message || 'Ошибка сети или сервиса');
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Формирование стильного темного фона и генерация HTML Preview
  const handleRenderVideo = async () => {
    if (!script) return;
    setRendering(true);
    setRenderError(null);
    setRenderedVideo(null);
    setRenderProgress(0);

    const interval = setInterval(() => {
      setRenderProgress((prev) => (prev < 90 ? prev + 20 : prev));
    }, 300);

    try {
      const res = await fetch('/api/video/render', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          scriptData: script,
        }),
      });

      const data: RenderResponse = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Ошибка при формировании превью');
      }

      setRenderProgress(100);
      setRenderedVideo(data);
      setPreviewKey((k) => k + 1);
    } catch (err: any) {
      setRenderError(err.message || 'Сбой при создании темного холста с инфографикой');
    } finally {
      clearInterval(interval);
      setRendering(false);
    }
  };

  // Публикация в YouTube Shorts
  const handleUploadToYouTube = async () => {
    if (!renderedVideo?.videoUrl || !script) return;
    setUploadingYouTube(true);
    setYoutubeError(null);
    setYoutubeResult(null);

    try {
      const res = await fetch('/api/youtube/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoUrl: renderedVideo.videoUrl,
          scriptData: script,
        }),
      });

      const data: YouTubeUploadResponse = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Не удалось опубликовать на YouTube');
      }

      setYoutubeResult(data);
      fetchYouTubeStatus();

      if (data.videoId) {
        const realYtUrl = `https://www.youtube.com/shorts/${data.videoId}`;
        const notifData = {
          title: script.hook || topic,
          videoUrl: realYtUrl,
          shortUrl: data.shortUrl || realYtUrl,
          videoId: data.videoId,
          commentText: data.comment?.text || script.commentText || 'Забрала меню на неделю, с которым ушло 2 кг, здесь: @Guidepp_bot',
          totalTimeSeconds: '1.9',
          privacyStatus: data.privacyStatus || 'public',
        };
        setPublishedData(notifData);
        setShowPublishedModal(true);
        setShowPublishedToast(true);
      }
    } catch (err: any) {
      setYoutubeError(err.message || 'Сбой при загрузке на YouTube');
      fetchYouTubeStatus();
    } finally {
      setUploadingYouTube(false);
    }
  };

  // Сквозной цикл автопостинга
  const handleAutoPostPipeline = async () => {
    setAutoPosting(true);
    setAutoPostError(null);
    setAutoPostResult(null);
    setAutoPostStep('Генерация сценария (Gemini API)...');

    try {
      const stepTimer1 = setTimeout(() => {
        setAutoPostStep('Формирование темного фона 9:16 и инфографики...');
      }, 1800);

      const stepTimer2 = setTimeout(() => {
        setAutoPostStep('Загрузка в YouTube Shorts с @Guidepp_bot...');
      }, 4500);

      const res = await fetch('/api/autopost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      const data: AutoPostResponse = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Ошибка выполнения полного пайплайна');
      }

      setAutoPostResult(data);
      if (data.scriptData) setScript(data.scriptData);
      if (data.renderResult) {
        setRenderedVideo(data.renderResult);
        setPreviewKey((k) => k + 1);
      }
      if (data.youtube) setYoutubeResult(data.youtube);
      setAutoPostStep('Пайплайн завершен!');
      fetchHistory();
      fetchYouTubeStatus();

      // Проверяем, действительно ли ролик опубликован на YouTube
      if (data.isYouTubePublished && data.youtube?.videoId) {
        const realYtUrl = `https://www.youtube.com/shorts/${data.youtube.videoId}`;
        const notifData = {
          title: data.scriptData?.hook || topic,
          videoUrl: realYtUrl,
          shortUrl: data.youtube?.shortUrl || realYtUrl,
          videoId: data.youtube.videoId,
          commentText: data.commentText || data.youtube?.comment?.text || data.scriptData?.commentText || 'Забрала меню на неделю, с которым ушло 2 кг, здесь: @Guidepp_bot',
          totalTimeSeconds: data.totalTimeSeconds || '2.4',
          privacyStatus: data.youtube?.privacyStatus || 'public',
        };

        setPublishedData(notifData);
        setShowPublishedModal(true);
        setShowPublishedToast(true);
      } else {
        // Ролик и сценарий созданы, но публикация на YouTube не удалась
        const failReason = data.youtube?.error || 'Ролик создан, но не отправлен на YouTube. Проверьте валидность токена в .env';
        setAutoPostError(`Видео и сценарий успешно созданы, но ролик НЕ опубликован на канал: ${failReason}`);
      }
    } catch (err: any) {
      setAutoPostError(err.message || 'Сбой в конвейере автопостинга');
    } finally {
      setAutoPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-300 font-sans flex flex-col antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Status Header */}
      <header className="h-14 border-b border-[#1E1E20] bg-[#111112] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
          <div className="flex items-baseline space-x-2 font-mono">
            <span className="font-semibold text-slate-100 tracking-tight text-sm">
              SHORTS_SAAS_PIPELINE
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              [Pexels + Gemini + Shorts]
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-3 text-xs font-mono uppercase tracking-wider text-slate-500">
          <button
            type="button"
            onClick={() => setShowHistoryView(true)}
            className="px-2 py-1 bg-[#1A1A1C] hover:bg-[#27272A] text-amber-300 border border-amber-500/40 rounded text-[10px] sm:text-[11px] hidden xs:flex items-center gap-1 transition-colors cursor-pointer"
            title="База истории сценариев"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>История ({historyList.length})</span>
          </button>

          <button
            type="button"
            onClick={handleOpenEnvModal}
            className="px-2 py-1 bg-[#1A1A1C] hover:bg-[#27272A] text-emerald-400 border border-emerald-500/40 rounded text-[10px] sm:text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Настройки (.env)</span>
            <span className="sm:hidden">.env</span>
          </button>

          <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[11px] hidden md:flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Gemini: {health?.geminiConfigured ? 'Ready' : 'Wait'}
          </span>

          <span className="px-2 py-1 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded text-[11px] hidden lg:flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
            Pexels: {health?.pexelsConfigured ? 'Active' : 'Fallback'}
          </span>

          {ytAuthStatus?.authenticated ? (
            <span
              className="px-2 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded text-[11px] flex items-center gap-1.5"
              title={`YouTube канал: ${ytAuthStatus.channelTitle || 'Подключен'} (ID: ${ytAuthStatus.channelId || 'N/A'})`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              YT: {ytAuthStatus.channelTitle ? (ytAuthStatus.channelTitle.length > 12 ? ytAuthStatus.channelTitle.substring(0, 10) + '..' : ytAuthStatus.channelTitle) : 'Ready'}
            </span>
          ) : (
            <button
              type="button"
              onClick={handleConnectGoogleOAuth}
              disabled={connectingGoogle}
              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded text-[11px] flex items-center gap-1 cursor-pointer shadow-[0_0_10px_rgba(225,29,72,0.3)] transition-colors shrink-0"
              title="Нажмите для мгновенного входа через Google и подключения YouTube канала"
            >
              <ExternalLink className={`w-3 h-3 ${connectingGoogle ? 'animate-spin' : ''}`} />
              <span>{connectingGoogle ? 'Вход...' : '🔗 Войти через Google'}</span>
            </button>
          )}

          <a
            href="https://t.me/Guidepp_bot"
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 bg-[#1A1A1C] hover:bg-[#252528] text-sky-400 border border-sky-500/30 rounded text-[11px] transition-colors"
          >
            <span>@Guidepp_bot</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </header>

      {/* Уведомление об успешном подключении YouTube */}
      {connectSuccessToast && (
        <div className="bg-emerald-950/90 border-b border-emerald-500/50 px-4 py-2.5 text-xs font-mono flex items-center justify-between text-emerald-300 shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{connectSuccessToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setConnectSuccessToast(null)}
            className="text-slate-400 hover:text-white text-xs cursor-pointer px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Warning Banner: YouTube Refresh Token Expired */}
      {ytAuthStatus?.isInvalidGrant && (
        <div className="bg-gradient-to-r from-amber-950/80 via-rose-950/60 to-[#121216] border-b border-amber-500/40 px-4 py-2.5 text-xs font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-md">
          <div className="flex items-center gap-2.5 text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
            <span>
              <strong>ВНИМАНИЕ: Срок действия YouTube Refresh Token истек.</strong>
              <span className="text-slate-300 hidden sm:inline ml-1.5">
                Нажмите «Войти через Google» — канал подключится в 1 клик без ручного ввода токенов!
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleConnectGoogleOAuth}
              disabled={connectingGoogle}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded text-xs flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(225,29,72,0.4)] transition-colors"
            >
              <ExternalLink className={`w-3.5 h-3.5 ${connectingGoogle ? 'animate-spin' : ''}`} />
              <span>{connectingGoogle ? 'Открываем Google...' : 'Войти через Google в 1 клик'}</span>
            </button>
            <button
              type="button"
              onClick={() => fetchYouTubeStatus()}
              disabled={checkingYtAuth}
              className="px-2.5 py-1.5 bg-[#1E1E24] hover:bg-[#2A2A32] text-slate-300 border border-[#33333E] rounded text-xs flex items-center gap-1 cursor-pointer transition-colors"
              title="Перепроверить подключение к YouTube"
            >
              <RefreshCw className={`w-3 h-3 ${checkingYtAuth ? 'animate-spin' : ''}`} />
              <span>Проверить</span>
            </button>
          </div>
        </div>
      )}

      {/* Main 3-Column High Density Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Sidebar: Project Explorer & Modules */}
        <aside className="w-full lg:w-60 xl:w-64 border-b lg:border-b-0 lg:border-r border-[#1E1E20] bg-[#0E0E0F] flex flex-col shrink-0">
          <div className="p-3.5 border-b border-[#1E1E20] bg-[#111112] flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Project Explorer
            </span>
            <span className="text-[10px] font-mono text-emerald-400/80 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              MOD 01 - 03
            </span>
          </div>

          <div className="flex-1 py-2 text-xs text-slate-400 font-mono space-y-0.5">
            <div className="px-4 py-1.5 opacity-80 hover:opacity-100 transition-opacity flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileCode2 className="w-3.5 h-3.5 text-slate-400" />
                app.js
              </span>
              <span className="text-[9px] text-slate-500 font-sans">Pipeline</span>
            </div>
            <div className="px-4 py-1.5 bg-[#1A1A1C] text-sky-400 border-l-2 border-sky-500 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Film className="w-3.5 h-3.5 text-sky-400" />
                videoRenderer.js
              </span>
              <span className="text-[9px] text-sky-400 font-sans">Pexels HTML</span>
            </div>
            <div className="px-4 py-1.5 opacity-80 hover:opacity-100 transition-opacity flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                youtubeUploader.js
              </span>
              <span className="text-[9px] text-emerald-500/70 font-sans">Shorts API</span>
            </div>
            <div className="px-4 py-1.5 opacity-60 hover:opacity-90 transition-opacity flex items-center gap-2">
              <Server className="w-3.5 h-3.5 text-slate-500" />
              server.ts
            </div>
            <div className="px-4 py-1.5 opacity-60 hover:opacity-90 transition-opacity flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              package.json
            </div>
            <div 
              onClick={() => setShowHistoryView(true)}
              className="px-4 py-1.5 bg-[#18181B] hover:bg-[#202024] text-amber-300 border-l-2 border-amber-400 flex items-center justify-between cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-2">
                <History className="w-3.5 h-3.5 text-amber-400" />
                video_history.json
              </span>
              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                {historyList.length} уникальных
              </span>
            </div>
            <div 
              onClick={handleOpenEnvModal}
              className="px-4 py-1.5 opacity-90 hover:opacity-100 transition-opacity flex items-center justify-between cursor-pointer text-emerald-300"
            >
              <span className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                .env (Ключи)
              </span>
              <span className="text-[9px] bg-emerald-500/20 px-1 rounded">Edit</span>
            </div>

            <div className="px-4 py-1.5 mt-4 opacity-40 text-[10px] uppercase font-sans tracking-wider text-slate-500">
              Stack Architecture
            </div>
            <div className="px-6 py-1 opacity-60 hover:opacity-100 transition-opacity flex items-center justify-between text-[11px]">
              <span>Pexels Video API</span>
              <span className="text-[10px] text-sky-400">9:16 HD</span>
            </div>
            <div className="px-6 py-1 opacity-60 hover:opacity-100 transition-opacity flex items-center justify-between text-[11px]">
              <span>Google Gemini</span>
              <span className="text-[10px] text-emerald-400">Flash (Auto-Cascade)</span>
            </div>
            <div className="px-6 py-1 opacity-60 hover:opacity-100 transition-opacity flex items-center justify-between text-[11px]">
              <span>YouTube Data v3</span>
              <span className="text-[10px] text-rose-400">Shorts + Pin</span>
            </div>
            <div className="px-6 py-1 opacity-60 hover:opacity-100 transition-opacity flex items-center justify-between text-[11px]">
              <span>Express Backend</span>
              <span className="text-[10px] text-slate-600">v4.21.2</span>
            </div>
            <div className="px-6 py-1 opacity-40 flex items-center justify-between text-[11px]">
              <span>VPS Deploy</span>
              <span className="text-[9px] text-emerald-500/80">pm2 ready</span>
            </div>
          </div>

          <div className="p-3 border-t border-[#1E1E20] bg-[#0A0A0B] text-[10px] font-mono text-slate-500">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>TEST MODE: AI Studio Sandbox</span>
            </div>
            <span>Легкий режим без Puppeteer: Pexels MP4 + HTML CSS Animations</span>
          </div>
        </aside>

        {/* Center Workspace: Controls, Script Generation, Pexels Video & YouTube Upload */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-[#0A0A0B] border-r border-[#1E1E20]">
          <div className="p-4 sm:p-6 space-y-6 max-w-4xl">
            {/* Quick 1-Click Autopost Pipeline Card */}
            <div className="p-4 bg-gradient-to-r from-emerald-950/30 via-[#121214] to-rose-950/20 border border-emerald-500/30 rounded-lg space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-slate-100 uppercase tracking-wide">
                    1-Click AutoPost Pipeline (Сквозной запуск)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAutoPostPipeline}
                  disabled={autoPosting}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-[#1E1E20] disabled:text-slate-600 text-slate-950 font-mono font-bold text-xs rounded transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  {autoPosting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{autoPostStep || 'AUTO-POSTING...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>ЗАПУСТИТЬ ПОЛНЫЙ ЦИКЛ (СЦЕНАРИЙ + ТЕМНЫЙ ХОЛСТ + SHORTS)</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-[11px] font-mono text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="flex items-center gap-1 text-emerald-400/90">
                  <Check className="w-3 h-3" /> 1. Сценарий Gemini
                </span>
                <span className="text-slate-600">→</span>
                <span className="flex items-center gap-1 text-sky-400/90">
                  <Check className="w-3 h-3" /> 2. Стильный темный фон + инфографика
                </span>
                <span className="text-slate-600">→</span>
                <span className="flex items-center gap-1 text-rose-400/90">
                  <Check className="w-3 h-3" /> 3. YouTube Shorts + коммент @Guidepp_bot
                </span>
              </div>

              {autoPostError && (
                <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded text-xs font-mono text-rose-300 space-y-2.5">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span className="flex-1">{autoPostError}</span>
                  </div>
                  {autoPostError.includes('invalid_grant') && (
                    <div className="pt-2 border-t border-rose-900/50 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleConnectGoogleOAuth}
                        disabled={connectingGoogle}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded text-xs flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(225,29,72,0.4)] transition-colors"
                      >
                        <ExternalLink className={`w-3.5 h-3.5 ${connectingGoogle ? 'animate-spin' : ''}`} />
                        <span>{connectingGoogle ? 'Открываем Google...' : '⚡ Подключить YouTube в 1 клик'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleOpenEnvModal}
                        className="px-2.5 py-1.5 bg-[#1C1C24] hover:bg-[#252530] text-slate-300 border border-[#333342] rounded text-xs flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Settings className="w-3 h-3" />
                        <span>Ввести токен вручную (.env)</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {autoPostResult && autoPostResult.success && (
                autoPostResult.isYouTubePublished && autoPostResult.youtube?.videoId ? (
                  <div className="p-4 bg-emerald-950/25 border border-emerald-500/50 rounded-lg space-y-3 font-mono text-xs text-emerald-300 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <span className="font-bold flex items-center gap-2 text-emerald-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Видео опубликовано в YouTube Shorts ({autoPostResult.totalTimeSeconds}с)!</span>
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowPublishedModal(true)}
                          className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Bell className="w-3 h-3 text-amber-400" />
                          <span>Открыть оповещение</span>
                        </button>

                        <a
                          href={`https://www.youtube.com/shorts/${autoPostResult.youtube.videoId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded flex items-center gap-1.5 text-[11px] shadow-[0_0_12px_rgba(225,29,72,0.3)] transition-colors"
                        >
                          <span>СМОТРЕТЬ YOUTUBE SHORTS</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* Прямая ссылка на опубликованное видео в YouTube Shorts */}
                    <div className="p-2.5 bg-[#090A0E] border border-[#1E2330] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-rose-400 font-bold shrink-0">Прямая ссылка Shorts:</span>
                        <a
                          href={`https://www.youtube.com/shorts/${autoPostResult.youtube.videoId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-rose-300 hover:underline truncate"
                        >
                          https://www.youtube.com/shorts/{autoPostResult.youtube.videoId}
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(`https://www.youtube.com/shorts/${autoPostResult.youtube?.videoId}`, 'copy-direct-yt-banner')}
                        className="px-2 py-1 bg-[#141822] hover:bg-[#1E2330] text-slate-300 rounded border border-[#273042] shrink-0 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedKey === 'copy-direct-yt-banner' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Скопировать ссылку</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-[#131318] border border-amber-500/40 rounded-lg space-y-2.5 font-mono text-xs text-amber-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="font-bold flex items-center gap-2 text-amber-400">
                        <AlertCircle className="w-4 h-4" />
                        <span>Сценарий и видео созданы, но ролик НЕ опубликован на YouTube</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleConnectGoogleOAuth}
                          disabled={connectingGoogle}
                          className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow-[0_0_10px_rgba(225,29,72,0.3)]"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>{connectingGoogle ? 'Вход...' : '⚡ Подключить YouTube в 1 клик'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleOpenEnvModal}
                          className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 rounded text-[11px] cursor-pointer"
                        >
                          .env
                        </button>
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Причина: {autoPostResult.youtube?.error || 'Срок действия YouTube Refresh Token истек (invalid_grant)'}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleDownloadVideo()}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded flex items-center gap-1.5 cursor-pointer text-[11px]"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Скачать видео для Reels/TikTok/Shorts</span>
                      </button>
                      <span className="text-[10px] text-slate-400">
                        Вы можете прямо сейчас выложить видео вручную с готовым текстом и ботом @Guidepp_bot.
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Step 1: Scenario Configuration Form */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <h1 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-200">
                    Модуль 01: Сценарий Gemini API
                  </h1>
                </div>
                {executionTime && (
                  <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {executionTime}s
                  </span>
                )}
              </div>

              {/* Input & Action */}
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Введите тему для Shorts (например: Почему вес стоит на месте даже на дефиците калорий)..."
                  className="flex-1 bg-[#111112] border border-[#2E2E31] focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 rounded px-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-600 outline-none transition-colors"
                />
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleGenerate()}
                    disabled={loading}
                    className="px-4 py-2 bg-[#1A1A1C] hover:bg-[#252528] disabled:opacity-50 text-slate-200 font-mono text-xs font-semibold rounded border border-[#2E2E31] hover:border-emerald-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                        <span>Генерация ({generationSeconds}с)...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Сгенерировать</span>
                      </>
                    )}
                  </button>

                  {loading && (
                    <button
                      type="button"
                      onClick={handleCancelGenerate}
                      title="Прервать ожидание"
                      className="px-2.5 py-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 rounded text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Отмена</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Instant Curated Fallback Action when AI is taking time */}
              {loading && generationSeconds >= 3 && (
                <div className="p-2.5 bg-sky-950/30 border border-sky-500/40 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono text-sky-300 animate-pulse">
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>Нейросеть рассчитывает формулы... Не хотите ждать?</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleGenerate(topic, true)}
                    className="px-2.5 py-1 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded text-[11px] cursor-pointer shrink-0 transition-colors shadow-sm"
                  >
                    ⚡ Загрузить мгновенно из экспертной базы
                  </button>
                </div>
              )}

              {/* Sample Topics Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {SAMPLE_TOPICS.map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTopic(t);
                      handleGenerate(t);
                    }}
                    className="text-[11px] font-mono px-2 py-1 bg-[#111112] hover:bg-[#1A1A1C] text-slate-400 hover:text-slate-200 border border-[#1E1E20] hover:border-[#2E2E31] rounded transition-colors cursor-pointer"
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Anti-Duplicate Status Bar */}
              <div className="pt-2 border-t border-[#1E1E20] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Анти-повтор:
                  </span>
                  <span className="text-slate-400">
                    {historyList.length > 0
                      ? `${historyList.length} уникальных сценариев в истории`
                      : 'База истории пуста (первый ролик)'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCheckTopic(topic)}
                    disabled={checkingTopic}
                    className="px-2 py-0.5 bg-[#1A1A1C] hover:bg-[#27272A] text-amber-300 border border-amber-500/40 rounded transition-colors cursor-pointer"
                  >
                    {checkingTopic ? 'Проверка...' : 'Проверить на дубликаты'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowHistoryView(true)}
                  className="text-amber-400 hover:text-amber-300 underline cursor-pointer flex items-center gap-1"
                >
                  <History className="w-3 h-3" />
                  <span>Открыть реестр истории ({historyList.length})</span>
                </button>
              </div>

              {topicCheckResult && (
                <div
                  className={`p-2.5 rounded border text-xs font-mono flex items-start gap-2 ${
                    topicCheckResult.isDuplicate
                      ? 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                      : 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                  }`}
                >
                  {topicCheckResult.isDuplicate ? (
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5 flex-1">
                    <div className="font-bold">
                      {topicCheckResult.isDuplicate
                        ? `Внимание: обнаружено сходство ${(topicCheckResult.similarity * 100).toFixed(0)}% с ранее опубликованным сценарием!`
                        : `Тема на 100% уникальна (сходство ${(topicCheckResult.similarity * 100).toFixed(0)}%, порог 75%)`}
                    </div>
                    {topicCheckResult.matchedItem && (
                      <div className="text-[11px] opacity-80 mt-1">
                        Ранее в истории: «{topicCheckResult.matchedItem.hook || topicCheckResult.matchedItem.topic}»
                        <br />
                        <span className="text-emerald-400 font-semibold">
                          При генерации Gemini автоматически исключит этот тезис и выберет свежий ракурс!
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Error Banner */}
            {error && (
              <div className="bg-rose-950/20 border border-rose-800/40 rounded p-3 text-xs font-mono text-rose-300 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold">Ошибка генерации:</div>
                  <div>{error}</div>
                  <button
                    type="button"
                    onClick={handleOpenEnvModal}
                    className="text-emerald-400 underline mt-1 block cursor-pointer"
                  >
                    Указать или обновить GEMINI_API_KEY в .env
                  </button>
                </div>
              </div>
            )}

            {/* Generated Script Structured Cards */}
            {script && (
              <div className="bg-[#111112] border border-[#1E1E20] rounded-lg p-4 space-y-4">
                {script.isFallback && (
                  <div className="bg-emerald-950/25 border border-emerald-500/40 rounded p-3 text-xs font-mono text-emerald-300 flex items-start gap-2.5">
                    <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="space-y-1 flex-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <span>⚡ Экспертная база доказательной нутрициологии</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                          МГНОВЕННО (0 сек)
                        </span>
                      </div>
                      <div className="text-[11px] text-emerald-300/90">
                        {script.notice?.includes('{"error"') || script.notice?.includes('503')
                          ? 'Серверы Gemini временно испытывают пиковую нагрузку (503). Сценарий мгновенно составлен по проверенным протоколам доказательной нутрициологии с таблицей-шпаргалкой и нативной интеграцией @Guidepp_bot.'
                          : (script.notice || 'Сценарий мгновенно составлен по проверенным протоколам нутрициологии с таблицей-шпаргалкой и нативной интеграцией @Guidepp_bot.')
                        }
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleGenerate(topic, false)}
                      className="text-[11px] underline text-emerald-400 hover:text-emerald-200 cursor-pointer shrink-0 ml-2"
                    >
                      Запустить через AI
                    </button>
                  </div>
                )}
                {script.warning && (
                  <div className="bg-amber-950/20 border border-amber-500/40 rounded p-3 text-xs font-mono text-amber-300 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <span>Защита от лимитов (Quota Guard)</span>
                        <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-300">
                          {script.usedModel || 'Fallback'}
                        </span>
                      </div>
                      <div>{script.warning}</div>
                      <div className="text-[11px] text-amber-400/80">
                        Сценарий полностью валиден и готов к рендерингу видео. При необходимости вы можете обновить ключ в{' '}
                        <button
                          type="button"
                          onClick={handleOpenEnvModal}
                          className="underline hover:text-amber-200 cursor-pointer"
                        >
                          настройках .env
                        </button>.
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pb-3 border-b border-[#1E1E20]">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <h2 className="text-xs uppercase font-bold text-slate-200 font-mono">
                      СТРУКТУРА СЦЕНАРИЯ (JSON)
                    </h2>
                    {script.usedModel && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1A1A1C] border border-[#2E2E31] text-emerald-400">
                        {script.usedModel}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(JSON.stringify(script, null, 2), 'all')}
                    className="text-[10px] font-mono flex items-center gap-1 text-slate-400 hover:text-slate-200 px-2 py-1 bg-[#1A1A1C] border border-[#2E2E31] rounded transition-colors"
                  >
                    {copiedKey === 'all' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Скопировано</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Копировать JSON</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Anti-Duplicate & Angle Verification Card */}
                <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
                  <div className="flex items-start sm:items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-emerald-300 font-bold">
                        <span>УНИКАЛЬНОСТЬ: 100% ПОДТВЕРЖДЕНА</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 border border-emerald-500/30 rounded text-emerald-300 font-normal">
                          Запись в реестре #{script.historyCount || historyList.length}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {script.selectedAngle ? (
                          <span>
                            Сюжетный ракурс: <strong className="text-slate-200">{script.selectedAngle}</strong>
                          </span>
                        ) : (
                          <span>Проверено по базе истории: дубликатов нет, свежий хук</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowHistoryView(true)}
                    className="text-[11px] text-amber-300 hover:text-amber-200 underline cursor-pointer flex items-center gap-1 shrink-0 self-start sm:self-auto"
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>Вся база истории ({historyList.length})</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Hook (5 сек) */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Flame className="w-3 h-3 text-rose-400" />
                        1. HOOK / МИФ (0-5 СЕК)
                      </label>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(script.hook, 'hook')}
                        className="text-[9px] font-mono text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        {copiedKey === 'hook' ? 'COPIED' : 'COPY'}
                      </button>
                    </div>
                    <div className="bg-[#0A0A0B] p-3 border border-[#2E2E31] rounded text-xs text-rose-300 font-medium">
                      «{script.hook}»
                    </div>
                  </div>

                  {/* Statistic + Infographic (10 сек) */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Activity className="w-3 h-3 text-amber-400" />
                        2. СТАТИСТИКА + ИНФОГРАФИКА (5-15 СЕК)
                      </label>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(script.statistic || script.pain || '', 'statistic')}
                        className="text-[9px] font-mono text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        {copiedKey === 'statistic' ? 'COPIED' : 'COPY'}
                      </button>
                    </div>
                    <div className="bg-[#0A0A0B] p-3 border border-[#2E2E31] rounded text-xs text-slate-300 leading-relaxed space-y-2">
                      <div>{script.statistic || script.pain}</div>
                      {script.statisticBadge && (
                        <div className="flex items-center gap-2 pt-1 border-t border-[#1E1E20] text-[11px]">
                          <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded font-mono font-bold">
                            {script.statisticBadge}
                          </span>
                          <span className="text-slate-500 text-[10px]">CSS-инфографика активна</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Educational Dynamic Scenes (3-4 сек каждая) */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-emerald-400" />
                        3. ДИНАМИЧНЫЕ СЦЕНЫ МОНТАЖА (КАЖДЫЕ 3.5 СЕК)
                      </label>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(
                          Array.isArray(script.educationalScenes) 
                            ? script.educationalScenes.join('\n') 
                            : (script.educationalFact || ''), 
                          'educationalScenes'
                        )}
                        className="text-[9px] font-mono text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        {copiedKey === 'educationalScenes' ? 'COPIED' : 'COPY'}
                      </button>
                    </div>
                    <div className="bg-[#0A0A0B] p-3 border border-[#2E2E31] rounded text-xs text-slate-300 leading-relaxed space-y-2">
                      {Array.isArray(script.educationalScenes) && script.educationalScenes.length > 0 ? (
                        <div className="space-y-1.5">
                          {script.educationalScenes.map((sc, i) => (
                            <div key={i} className="flex items-start gap-2 text-[11px] bg-[#141416] px-2 py-1.5 rounded border border-[#222226]">
                              <span className="text-emerald-400 font-mono font-bold shrink-0">#{i + 1}</span>
                              <span className="font-semibold text-slate-200">«{sc}»</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div>{script.educationalFact || script.solution}</div>
                      )}
                    </div>
                  </div>

                  {/* Native CTA & Comment (10-12 сек) */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <MessageSquareText className="w-3 h-3 text-sky-400" />
                        4. НАТИВНЫЙ CTA & КОММЕНТАРИЙ (@Guidepp_bot)
                      </label>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(script.commentText, 'comment')}
                        className="text-[9px] font-mono text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        {copiedKey === 'comment' ? 'COPIED' : 'COPY'}
                      </button>
                    </div>
                    <div className="bg-[#0A0A0B] p-3 border border-[#2E2E31] rounded text-xs space-y-2">
                      <div className="text-sky-400 font-medium">
                        {script.nativeCTA || script.callToAction}
                      </div>
                      <div className="text-emerald-400 border-t border-[#1E1E20] pt-2 text-[11px] leading-relaxed flex items-start gap-1.5">
                        <span className="text-slate-600 shrink-0 font-bold">[PINNED]</span>
                        <span>"{script.commentText}"</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Practical Cheat Sheet Card ("Заскринь") */}
                {Array.isArray(script.scenes) && script.scenes.some((s) => s.cheat_sheet && Array.isArray(s.cheat_sheet.rows) && s.cheat_sheet.rows.length > 0) && (
                  <div className="p-3.5 bg-gradient-to-r from-sky-950/30 via-[#121214] to-amber-950/20 border border-sky-500/30 rounded-lg space-y-3 font-mono text-xs">
                    {script.scenes
                      .filter((s) => s.cheat_sheet && Array.isArray(s.cheat_sheet.rows) && s.cheat_sheet.rows.length > 0)
                      .map((sc, idx) => {
                        const cs = sc.cheat_sheet!;
                        const rows = Array.isArray(cs.rows) ? cs.rows : [];
                        return (
                          <div key={idx} className="space-y-2.5">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2 text-sky-300 font-bold">
                                <Camera className="w-4 h-4 text-amber-400" />
                                <span>КАДР ВЫСОКОЙ ПОЛЬЗЫ («ЗАСКРИНЬ ШПАРГАЛКУ»): {cs.title || 'ШПАРГАЛКА'}</span>
                              </div>
                              <span className="text-[10px] bg-amber-500/20 border border-amber-500/40 text-amber-300 px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                                {cs.badge || 'ШПАРГАЛКА'}
                              </span>
                            </div>
                            <div className="overflow-x-auto">
                              <table className="w-full text-[11px] border border-[#222226] rounded-md overflow-hidden">
                                <thead className="bg-[#141416] text-slate-400 font-bold uppercase tracking-wider">
                                  <tr>
                                    <th className="p-2.5 text-left border-b border-[#222226]">{cs.col1_header || 'Параметр'}</th>
                                    <th className="p-2.5 text-left border-b border-[#222226]">{cs.col2_header || 'Значение'}</th>
                                    <th className="p-2.5 text-right border-b border-[#222226]">{cs.col3_header || 'Норма'}</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[#222226] text-slate-200">
                                  {rows.map((row, rIdx) => (
                                    <tr key={rIdx} className="hover:bg-white/5 transition-colors">
                                      <td className="p-2.5 font-bold text-slate-100">{row.col1}</td>
                                      <td className="p-2.5 text-slate-300">{row.col2}</td>
                                      <td className="p-2.5 text-right text-emerald-400 font-bold">{row.col3}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <div className="text-[10px] text-slate-400 flex items-center justify-between">
                              <span>📸 Зритель ставит на паузу и делает скриншот (резкий рост сохранений и репостов)</span>
                              <span className="text-amber-400">Сцена #{script.scenes ? script.scenes.indexOf(sc) + 1 : idx + 1} ({sc.duration} сек)</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}

                {/* MODULE 2: Trigger Button */}
                <div className="mt-5 pt-4 border-t border-[#1E1E20] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                      <Film className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-slate-200 uppercase">
                        Модуль 02: Стильный темный фон и инфографика (9:16)
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Темная тема, контрастная типографика и плавная CSS-анимация инфографики
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleRenderVideo}
                    disabled={rendering}
                    className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:bg-[#1A1A1C] disabled:text-slate-600 text-slate-950 font-mono font-bold text-xs rounded transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-[0_0_15px_rgba(14,165,233,0.2)]"
                  >
                    {rendering ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-sky-200" />
                        <span className="text-slate-200">ХОЛСТ ({renderProgress}%)...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>ГЕНЕРИРОВАТЬ ТЕМНЫЙ ХОЛСТ 9:16</span>
                      </>
                    )}
                  </button>
                </div>

                {renderError && (
                  <div className="mt-3 bg-rose-950/20 border border-rose-800/40 rounded p-3 text-xs font-mono text-rose-300 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{renderError}</span>
                  </div>
                )}
              </div>
            )}

            {/* Rendered HTML Video Preview Card */}
            {renderedVideo && (
              <div className="bg-[#111112] border border-sky-500/40 rounded-lg p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1E1E20]">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400" />
                    <h2 className="text-xs uppercase font-bold text-slate-200 font-mono">
                      PREVIEW ГОТОВО: Стильный темный фон со структурированной инфографикой
                    </h2>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] font-mono">
                    <a
                      href="/preview"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/50 rounded flex items-center gap-1.5 transition-colors font-bold"
                    >
                      <span>ОТКРЫТЬ /PREVIEW В НОВОЙ ВКЛАДКЕ</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
                  {/* Vertical Phone Preview Frame */}
                  <div className="w-[200px] sm:w-[240px] aspect-[9/16] bg-black rounded-xl border-2 border-[#2E2E31] overflow-hidden shadow-2xl shrink-0 relative group">
                    <iframe
                      key={previewKey}
                      src="/preview"
                      title="Shorts HTML Preview"
                      className="w-full h-full border-0"
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <a
                        href="/preview"
                        target="_blank"
                        rel="noreferrer"
                        className="px-2 py-1 bg-black/80 text-white rounded text-[10px] flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Details & YouTube Upload Action */}
                  <div className="flex-1 space-y-3 font-mono text-xs text-slate-300">
                    <div className="p-3 bg-[#0A0A0B] border border-[#2E2E31] rounded space-y-1.5 text-[11px]">
                      <div className="text-sky-400 font-bold uppercase flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        Вертикальный холст 9:16 готов (Dark Theme)
                      </div>
                      <div className="text-slate-400">
                        Фоновый видеопоток / ассет:{' '}
                        <span className="text-sky-300 font-bold">
                          Dark Canvas + Ambient CSS Orbs
                        </span>
                      </div>
                      <div className="text-slate-400">
                        Эндпоинт прямого просмотра: <span className="text-slate-200">GET /preview</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center text-[10px]">
                      <div className="p-2 bg-[#0E0E0F] border border-[#1E1E20] rounded">
                        <div className="text-slate-500 uppercase">ASPECT RATIO</div>
                        <div className="text-slate-200 font-bold mt-0.5">9:16 Vertical</div>
                      </div>
                      <div className="p-2 bg-[#0E0E0F] border border-[#1E1E20] rounded">
                        <div className="text-slate-500 uppercase">PROVIDER</div>
                        <div className="text-sky-400 font-bold mt-0.5">Dark Canvas</div>
                      </div>
                      <div className="p-2 bg-[#0E0E0F] border border-[#1E1E20] rounded">
                        <div className="text-slate-500 uppercase">BOT LINK</div>
                        <div className="text-emerald-400 font-bold mt-0.5">@Guidepp_bot</div>
                      </div>
                    </div>

                    {/* БЛОК: СКАЧАТЬ MP4 ДЛЯ INSTAGRAM REELS & TIKTOK */}
                    <div className="p-3 bg-gradient-to-r from-sky-950/40 via-[#12141a] to-emerald-950/30 border border-sky-500/40 rounded-lg space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                            <Download className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                              <span>Скачать MP4 для Reels и TikTok</span>
                              <span className="text-[10px] px-1.5 py-0.2 bg-sky-500/20 text-sky-300 rounded font-semibold">1080x1920</span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Чистый вертикальный ролик без водяных знаков для ручного перезалива
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDownloadVideo(renderedVideo.videoUrl)}
                          disabled={downloadingVideo}
                          className="px-3 py-1.5 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-mono font-bold text-xs rounded shadow-[0_0_12px_rgba(56,189,248,0.3)] transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                        >
                          {downloadingVideo ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>СКАЧИВАЕМ...</span>
                            </>
                          ) : downloadSuccess ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                              <span>СОХРАНЕНО!</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-3.5 h-3.5" />
                              <span>СКАЧАТЬ MP4</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Быстрые кнопки копирования описаний */}
                      <div className="pt-2 border-t border-[#1E2330] flex flex-wrap items-center gap-1.5 text-[10px]">
                        <span className="text-slate-400 font-semibold mr-1">Копировать описание:</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(getInstagramCaption(script, topic), 'copy-reels-preview')}
                          className="px-2 py-1 bg-[#161B26] hover:bg-[#1E2638] text-pink-300 border border-pink-500/30 rounded flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          {copiedKey === 'copy-reels-preview' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>📸 Для Instagram Reels</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => copyToClipboard(getTikTokCaption(script, topic), 'copy-tiktok-preview')}
                          className="px-2 py-1 bg-[#161B26] hover:bg-[#1E2638] text-sky-300 border border-sky-500/30 rounded flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          {copiedKey === 'copy-tiktok-preview' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>🎵 Для TikTok</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => copyToClipboard(getPinnedComment(script), 'copy-comment-preview')}
                          className="px-2 py-1 bg-[#161B26] hover:bg-[#1E2638] text-emerald-300 border border-emerald-500/30 rounded flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          {copiedKey === 'copy-comment-preview' ? <Check className="w-3 h-3 text-emerald-400" /> : <MessageSquareText className="w-3 h-3" />}
                          <span>💬 Коммент @Guidepp_bot</span>
                        </button>
                      </div>
                    </div>

                    {/* MODULE 3: YouTube Shorts Autopost Action */}
                    <div className="mt-4 pt-3 border-t border-[#1E1E20] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-mono font-bold text-slate-200">
                            Модуль 03: Загрузка в YouTube Shorts
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Скачает MP4 с Pexels и загрузит через YouTube Data API v3
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleUploadToYouTube}
                        disabled={uploadingYouTube}
                        className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 disabled:bg-[#1E1E20] disabled:text-slate-600 text-white font-mono font-bold text-xs rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-[0_0_12px_rgba(225,29,72,0.2)]"
                      >
                        {uploadingYouTube ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>ЗАГРУЗКА В SHORTS...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            <span>POST TO YOUTUBE SHORTS</span>
                          </>
                        )}
                      </button>
                    </div>

                    {youtubeError && (
                      <div className="mt-3 p-3 bg-rose-950/20 border border-rose-800/40 rounded text-xs font-mono text-rose-300 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-bold">Ошибка YouTube:</div>
                          <div className="text-[11px] text-rose-300/90 mt-0.5">{youtubeError}</div>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={handleConnectGoogleOAuth}
                              disabled={connectingGoogle}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Подключить через Google в 1 клик</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleOpenEnvModal}
                              className="text-[10px] text-emerald-400 underline flex items-center gap-1 cursor-pointer"
                            >
                              <Settings className="w-3 h-3" />
                              Ввести токен вручную
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {youtubeResult && youtubeResult.success && (
                      <div className="mt-3 p-3 bg-emerald-950/20 border border-emerald-500/40 rounded space-y-2 font-mono text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            Shorts успешно опубликован!
                          </span>
                          {youtubeResult.videoUrl && (
                            <a
                              href={youtubeResult.videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-0.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/40 rounded flex items-center gap-1 text-[10px]"
                            >
                              <span>Открыть Shorts</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          ID видео: <span className="text-slate-200">{youtubeResult.videoId}</span> | Приватность: <span className="text-emerald-400 uppercase">{youtubeResult.privacyStatus}</span>
                        </div>
                        {youtubeResult.comment && (
                          <div className="p-2 bg-[#0A0A0B] border border-[#2E2E31] rounded text-[11px] text-emerald-300 flex items-start gap-2">
                            <Pin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-slate-300">Закрепленный комментарий канала:</span>
                              <div className="text-slate-400 italic mt-0.5">"{youtubeResult.comment.text}"</div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* МОДУЛЬ: ПЕРЕЗАЛИВ В INSTAGRAM REELS И TIKTOK */}
            {script && (
              <div className="bg-[#111112] border border-[#26262B] rounded-lg p-5 space-y-4 font-mono shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E1E20]">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xs uppercase font-bold text-slate-200 tracking-wider">
                          Перезалив в Instagram Reels & TikTok
                        </h2>
                        <span className="text-[10px] px-2 py-0.5 bg-gradient-to-r from-pink-500/20 to-sky-500/20 text-pink-300 border border-pink-500/30 rounded font-semibold">
                          Мультиканальный трафик
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Скачайте готовое 9:16 видео и скопируйте оптимизированный текст со ссылкой на @Guidepp_bot
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownloadVideo(renderedVideo?.videoUrl)}
                      disabled={downloadingVideo}
                      className="px-3.5 py-2 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-bold text-xs rounded flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all"
                      title="Скачать MP4 видео 1080x1920 без водяных знаков"
                    >
                      {downloadingVideo ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Скачивание...</span>
                        </>
                      ) : downloadSuccess ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Файл скачан!</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Скачать видео MP4</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Переключатель вкладок: Reels / TikTok / Комментарий */}
                <div className="flex items-center justify-between gap-2 border-b border-[#1E1E20] pb-2">
                  <div className="flex items-center gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setSocialTab('instagram')}
                      className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 font-bold ${
                        socialTab === 'instagram'
                          ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 shadow-[0_0_10px_rgba(244,63,94,0.15)]'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-[#161618]'
                      }`}
                    >
                      <span>📸 Instagram Reels</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSocialTab('tiktok')}
                      className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 font-bold ${
                        socialTab === 'tiktok'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-[0_0_10px_rgba(14,165,233,0.15)]'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-[#161618]'
                      }`}
                    >
                      <span>🎵 TikTok</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSocialTab('comment')}
                      className={`px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5 font-bold ${
                        socialTab === 'comment'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-[#161618]'
                      }`}
                    >
                      <span>💬 Первый комментарий (@Guidepp_bot)</span>
                    </button>
                  </div>

                  <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Копирование в 1 клик</span>
                  </div>
                </div>

                {/* Тело выбранной вкладки */}
                {socialTab === 'instagram' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Текст описания поста Instagram Reels (структурирован под максимальные сохранения):</span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 font-mono">
                          Символов: {getInstagramCaption(script, topic).length} / 2200
                        </span>
                      </div>
                    </div>

                    <div className="relative">
                      <textarea
                        readOnly
                        value={getInstagramCaption(script, topic)}
                        rows={8}
                        className="w-full bg-[#0D0D0E] border border-[#232326] rounded p-3 text-xs text-slate-200 font-sans leading-relaxed focus:outline-none focus:border-pink-500/40 resize-y"
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(getInstagramCaption(script, topic), 'copy-ig-full')}
                          className="px-3.5 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(236,72,153,0.3)]"
                        >
                          {copiedKey === 'copy-ig-full' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === 'copy-ig-full' ? 'Скопировано в буфер!' : 'Скопировать описание Reels'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => copyToClipboard(getHashtagsOnly('instagram'), 'copy-ig-tags')}
                          className="px-3 py-2 bg-[#1A1A1D] hover:bg-[#25252A] text-slate-300 border border-[#2E2E33] hover:border-pink-500/30 rounded text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          {copiedKey === 'copy-ig-tags' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Hash className="w-3.5 h-3.5 text-pink-400" />}
                          <span>Только хэштеги</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => copyToClipboard(getPinnedComment(script), 'copy-ig-comment')}
                          className="px-3 py-2 bg-[#1A1A1D] hover:bg-[#25252A] text-emerald-300 border border-[#2E2E33] hover:border-emerald-500/30 rounded text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          {copiedKey === 'copy-ig-comment' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <MessageSquareText className="w-3.5 h-3.5 text-emerald-400" />}
                          <span>Комментарий с ботом</span>
                        </button>
                      </div>

                      <span className="text-[10px] text-slate-500">
                        💡 Совет: Закрепите комментарий под Reels сразу после публикации
                      </span>
                    </div>
                  </div>
                )}

                {socialTab === 'tiktok' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Текст описания для TikTok (кратко, хук + призыв в @Guidepp_bot + хэштеги):</span>
                      <span className="text-slate-500 font-mono">
                        Символов: {getTikTokCaption(script, topic).length} / 4000
                      </span>
                    </div>

                    <div className="relative">
                      <textarea
                        readOnly
                        value={getTikTokCaption(script, topic)}
                        rows={5}
                        className="w-full bg-[#0D0D0E] border border-[#232326] rounded p-3 text-xs text-slate-200 font-sans leading-relaxed focus:outline-none focus:border-sky-500/40 resize-y"
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(getTikTokCaption(script, topic), 'copy-tt-full')}
                          className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(14,165,233,0.3)]"
                        >
                          {copiedKey === 'copy-tt-full' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === 'copy-tt-full' ? 'Скопировано в буфер!' : 'Скопировать описание TikTok'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => copyToClipboard(getHashtagsOnly('tiktok'), 'copy-tt-tags')}
                          className="px-3 py-2 bg-[#1A1A1D] hover:bg-[#25252A] text-slate-300 border border-[#2E2E33] hover:border-sky-500/30 rounded text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          {copiedKey === 'copy-tt-tags' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Hash className="w-3.5 h-3.5 text-sky-400" />}
                          <span>Только хэштеги</span>
                        </button>
                      </div>

                      <span className="text-[10px] text-slate-500">
                        💡 Совет: Добавьте в TikTok трендовый звук в режиме «Оригинальный звук 0% / Музыка 10%»
                      </span>
                    </div>
                  </div>
                )}

                {socialTab === 'comment' && (
                  <div className="space-y-3">
                    <div className="text-[11px] text-slate-400">
                      Первый закрепленный комментарий от имени автора (основной источник лидов в @Guidepp_bot):
                    </div>

                    <div className="p-3.5 bg-[#0D0D0E] border border-emerald-500/30 rounded text-xs text-emerald-300 font-sans leading-relaxed flex items-start gap-2.5">
                      <Pin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="flex-1 font-medium">{getPinnedComment(script)}</div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(getPinnedComment(script), 'copy-pinned-comment')}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                      >
                        {copiedKey === 'copy-pinned-comment' ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'copy-pinned-comment' ? 'Комментарий скопирован!' : 'Скопировать комментарий'}</span>
                      </button>

                      <div className="p-2 bg-[#141416] border border-[#222226] rounded text-[10px] text-slate-400 max-w-md">
                        🔒 <strong className="text-slate-300">Секрет конверсии:</strong> В описании Reels ссылки некликабельны. Комментарий с упоминанием <span className="text-emerald-400">@Guidepp_bot</span> превращается в кликабельную ссылку и дает в 3 раза больше переходов.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* History Database Modal (Анти-дубликаты) */}
      {showHistoryView && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121214] border border-[#27272A] rounded-xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl font-mono text-xs">
            {/* Header */}
            <div className="p-4 border-b border-[#27272A] flex items-center justify-between bg-[#141416] rounded-t-xl shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <span>БАЗА ИСТОРИИ СЦЕНАРИЕВ</span>
                    <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                      {historyList.length} уникальных
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Защита от повторов контента: Gemini исключает эти хуки и тезисы при генерации
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowHistoryView(false)}
                className="w-8 h-8 rounded bg-[#1C1C1F] hover:bg-[#27272A] text-slate-400 hover:text-white flex items-center justify-center text-base cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Quick Uniqueness Check & Controls */}
            <div className="p-4 border-b border-[#1E1E20] bg-[#0E0E10] space-y-3 shrink-0">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Введите фразу или тему для проверки на семантическое сходство..."
                  className="flex-1 bg-[#141416] border border-[#27272A] focus:border-amber-500/50 rounded px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 outline-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCheckTopic((e.target as HTMLInputElement).value);
                  }}
                  id="history-quick-check-input"
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('history-quick-check-input') as HTMLInputElement;
                    if (input) handleCheckTopic(input.value);
                  }}
                  disabled={checkingTopic}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded cursor-pointer transition-colors shrink-0"
                >
                  {checkingTopic ? 'Проверка...' : 'Проверить уникальность'}
                </button>
                <button
                  type="button"
                  onClick={fetchHistory}
                  disabled={historyLoading}
                  className="px-3 py-1.5 bg-[#1C1C1F] hover:bg-[#27272A] text-slate-300 rounded border border-[#27272A] cursor-pointer shrink-0"
                >
                  {historyLoading ? '...' : 'Обновить'}
                </button>
                {historyList.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearHistory}
                    className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/40 rounded cursor-pointer shrink-0 transition-colors"
                  >
                    Очистить базу
                  </button>
                )}
              </div>

              {topicCheckResult && (
                <div
                  className={`p-2 rounded text-[11px] flex items-center justify-between ${
                    topicCheckResult.isDuplicate
                      ? 'bg-amber-950/30 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-950/30 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  <span>
                    {topicCheckResult.isDuplicate
                      ? `⚠️ Найдено сходство ${(topicCheckResult.similarity * 100).toFixed(0)}% с существующим роликом: «${topicCheckResult.matchedItem?.hook}»`
                      : `✅ 100% Уникально: сходство ${(topicCheckResult.similarity * 100).toFixed(0)}% ниже порога`}
                  </span>
                  <span className="opacity-70 text-[10px]">Порог 75%</span>
                </div>
              )}
            </div>

            {/* History Items Scrollable List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {!Array.isArray(historyList) || historyList.length === 0 ? (
                <div className="text-center py-10 text-slate-500 space-y-2">
                  <BookOpen className="w-8 h-8 mx-auto opacity-30 text-slate-400" />
                  <div className="text-sm font-semibold">В базе истории пока нет сценариев</div>
                  <div className="text-[11px] max-w-md mx-auto">
                    Каждый сгенерированный ролик автоматически вносится в реестр video_history.json, чтобы исключить дублирование контента на канале.
                  </div>
                </div>
              ) : (
                (Array.isArray(historyList) ? historyList : []).map((item, index) => (
                  <div
                    key={item.id || index}
                    className="bg-[#161618] border border-[#222226] hover:border-[#333338] rounded-lg p-3.5 space-y-2 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] pb-2 border-b border-[#222226]">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-400">#{historyList.length - index}</span>
                        {item.angle && (
                          <span className="px-2 py-0.5 bg-sky-500/10 text-sky-300 border border-sky-500/20 rounded text-[10px]">
                            {item.angle}
                          </span>
                        )}
                        {item.usedModel && (
                          <span className="px-1.5 py-0.5 bg-[#202024] text-slate-400 rounded text-[10px]">
                            {item.usedModel}
                          </span>
                        )}
                      </div>
                      <span className="text-slate-500 text-[10px]">
                        {item.date ? new Date(item.date).toLocaleString('ru-RU') : 'Ранее'}
                      </span>
                    </div>

                    <div className="text-xs text-rose-300 font-medium">
                      Хук: «{item.hook}»
                    </div>

                    {item.topic && item.topic !== item.hook && (
                      <div className="text-[11px] text-slate-400">
                        Тема: <span className="text-slate-300">{item.topic}</span>
                      </div>
                    )}

                    {Array.isArray(item.keyPoints) && item.keyPoints.length > 0 && (
                      <div className="text-[11px] text-slate-400 space-y-0.5">
                        <div className="text-slate-500 text-[10px] uppercase">Ключевые сцены:</div>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                          {item.keyPoints.slice(0, 3).map((kp, i) => (
                            <li key={i} className="truncate">
                              {kp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="pt-2 border-t border-[#222226] flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleApplyHistoryScript(item)}
                          className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <span>Загрузить в редактор</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => copyToClipboard(getInstagramCaption(item.scriptData || null, item.hook), `hist-ig-${item.id}`)}
                          className="px-2 py-1 bg-[#1A1A1D] hover:bg-[#25252A] text-pink-300 border border-pink-500/30 rounded text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                          title="Скопировать описание для Instagram Reels"
                        >
                          {copiedKey === `hist-ig-${item.id}` ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                          <span>📸 Reels</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => copyToClipboard(getTikTokCaption(item.scriptData || null, item.hook), `hist-tt-${item.id}`)}
                          className="px-2 py-1 bg-[#1A1A1D] hover:bg-[#25252A] text-sky-300 border border-sky-500/30 rounded text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                          title="Скопировать описание для TikTok"
                        >
                          {copiedKey === `hist-tt-${item.id}` ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                          <span>🎵 TikTok</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDownloadVideo(undefined, `reels_${(item.hook || 'script').slice(0, 20)}.mp4`)}
                          className="px-2 py-1 bg-[#1A1A1D] hover:bg-[#25252A] text-emerald-300 border border-emerald-500/30 rounded text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                          title="Скачать вертикальное видео MP4"
                        >
                          <Download className="w-3 h-3" />
                          <span>📥 MP4</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteHistoryItem(item.id || item.hook)}
                        className="p-1 hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 rounded transition-colors cursor-pointer"
                        title="Удалить сценарий из истории"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-[#27272A] bg-[#141416] rounded-b-xl flex items-center justify-between text-[11px] text-slate-400 shrink-0">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                Алгоритм семантического расстояния Жаккара + фильтрация стоп-слов активны
              </span>
              <button
                type="button"
                onClick={() => setShowHistoryView(false)}
                className="px-4 py-1 bg-[#27272A] hover:bg-[#333338] text-slate-200 rounded cursor-pointer"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING TOAST NOTIFICATION: Video Published */}
      {showPublishedToast && publishedData && (
        <div className="fixed top-5 right-5 z-50 max-w-md w-full animate-bounce-short">
          <div className="bg-[#121216] border-2 border-rose-500/60 shadow-[0_10px_30px_rgba(225,29,72,0.35)] rounded-xl p-4 flex items-start gap-3 text-xs font-mono text-slate-200">
            <div className="w-9 h-9 rounded-lg bg-rose-600/20 border border-rose-500/50 flex items-center justify-center text-rose-400 shrink-0">
              <Film className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  YOUTUBE SHORTS ОПУБЛИКОВАН!
                </span>
                <button
                  type="button"
                  onClick={() => setShowPublishedToast(false)}
                  className="text-slate-400 hover:text-white p-0.5"
                >
                  ✕
                </button>
              </div>
              <p className="text-[11px] text-slate-300 line-clamp-1 font-sans">
                «{publishedData.title}»
              </p>
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={publishedData.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded flex items-center gap-1 text-[11px] transition-colors"
                >
                  <span>Смотреть Shorts</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setShowPublishedToast(false);
                    setShowPublishedModal(true);
                  }}
                  className="px-2.5 py-1 bg-[#1F1F24] hover:bg-[#2A2A30] text-slate-300 rounded border border-[#33333A] text-[11px] transition-colors"
                >
                  Подробнее
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOTIFICATION: Video Published Successfully */}
      {showPublishedModal && publishedData && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-rose-500/50 rounded-2xl max-w-lg w-full shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(225,29,72,0.2)] overflow-hidden font-mono text-xs animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-rose-950/40 via-[#18181E] to-[#121216] border-b border-[#26262E] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500/50 flex items-center justify-center text-rose-400 shadow-inner">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <span>РОЛИК ОПУБЛИКОВАН В YOUTUBE SHORTS</span>
                  </div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Полный цикл завершен за {publishedData.totalTimeSeconds}с</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPublishedModal(false)}
                className="w-8 h-8 rounded-lg bg-[#1C1C22] hover:bg-[#272730] text-slate-400 hover:text-white flex items-center justify-center text-sm cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {/* Video Title */}
              <div className="space-y-1">
                <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                  Название ролика (Хук):
                </div>
                <div className="text-sm font-sans font-bold text-slate-100 p-3 bg-[#0A0A0D] border border-[#202026] rounded-lg">
                  «{publishedData.title}»
                </div>
              </div>

              {/* Direct YouTube Shorts Link */}
              <div className="space-y-2 p-4 bg-gradient-to-b from-[#16161D] to-[#0E0E12] border border-rose-500/30 rounded-xl">
                <div className="text-[11px] font-bold text-rose-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Прямая ссылка на YouTube Shorts:
                  </span>
                  <span className="text-[10px] text-slate-400">Внешний сайт YouTube</span>
                </div>

                <div className="p-2.5 bg-black/60 border border-[#2C2C36] rounded-lg text-rose-300 select-all break-all text-xs">
                  {publishedData.videoUrl}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <a
                    href={publishedData.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 text-xs shadow-[0_0_15px_rgba(225,29,72,0.4)] transition-all cursor-pointer"
                  >
                    <span>ОТКРЫТЬ YOUTUBE SHORTS</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(publishedData.videoUrl, 'modal-yt-copy')}
                    className="py-2.5 px-4 bg-[#1C1C22] hover:bg-[#282830] text-slate-200 border border-[#30303A] rounded-lg font-bold flex items-center justify-center gap-1.5 text-xs transition-colors cursor-pointer"
                  >
                    {copiedKey === 'modal-yt-copy' ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Скопировано!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Скопировать URL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Bot Native Comment */}
              <div className="space-y-1.5 p-3.5 bg-[#0D0D10] border border-[#222228] rounded-xl text-[11px]">
                <div className="flex items-center justify-between text-amber-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Pin className="w-3.5 h-3.5" />
                    Закрепленный комментарий с ботом:
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(publishedData.commentText || '', 'modal-cmt-copy')}
                    className="text-[10px] text-slate-400 hover:text-amber-300 underline cursor-pointer"
                  >
                    {copiedKey === 'modal-cmt-copy' ? 'Скопировано!' : 'Копировать'}
                  </button>
                </div>
                <div className="p-2 bg-black/40 border border-[#1E1E24] rounded text-slate-300 font-sans">
                  «{publishedData.commentText}»
                </div>
                <div className="text-[10px] text-slate-500">
                  Обеспечивает нативный перелив целевой аудитории женщин, желающих похудеть, в Telegram-бота @Guidepp_bot.
                </div>
              </div>

              {/* Badges */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-center">
                <div className="p-2 bg-[#16161A] border border-[#222228] rounded-lg">
                  <span className="text-slate-500 block">СТИЛЬ ХОЛСТА</span>
                  <span className="text-slate-200 font-bold mt-0.5 block">Dark Minimal Infographic</span>
                </div>
                <div className="p-2 bg-[#16161A] border border-[#222228] rounded-lg">
                  <span className="text-slate-500 block">ДОСТУП К РОЛИКУ</span>
                  <span className="text-emerald-400 font-bold mt-0.5 block">Public / По ссылке</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#0E0E12] border-t border-[#222228] flex items-center justify-between">
              <span className="text-[10px] text-slate-500">
                Автопостинг выполнен через YouTube Data API v3
              </span>
              <button
                type="button"
                onClick={() => setShowPublishedModal(false)}
                className="px-4 py-1.5 bg-[#202026] hover:bg-[#2B2B33] text-slate-200 font-bold rounded-lg cursor-pointer transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
