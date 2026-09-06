export interface VideoScript {
  hook: string;
  statistic?: string;
  educationalScenes?: string[];
  educationalFact?: string;
  nativeCTA?: string;
  commentText: string;
  statisticBadge?: string;
  statisticValue?: number;
  warning?: string;
  notice?: string;
  isFallback?: boolean;
  usedModel?: string;
  selectedAngle?: string;
  isUnique?: boolean;
  historyCount?: number;
  uniquenessConfirmed?: boolean;
  historyId?: string;
  scenes?: Array<{
    duration: number;
    text: string;
    visual: string;
    stat_value?: string;
    stat_label?: string;
    cheat_sheet?: {
      title: string;
      badge?: string;
      col1_header: string;
      col2_header: string;
      col3_header: string;
      rows: Array<{
        col1: string;
        col2: string;
        col3: string;
      }>;
    };
  }>;
  // Обратная совместимость
  pain?: string;
  solution?: string;
  callToAction?: string;
}

export interface HistoryItem {
  id: string;
  date: string;
  topic: string;
  hook: string;
  angle: string;
  keyPoints?: string[];
  scenesCount?: number;
  statistic?: string;
  commentText?: string;
  usedModel?: string;
  isFallback?: boolean;
  fullScript?: VideoScript;
}

export interface HistoryResponse {
  success: boolean;
  total: number;
  history: HistoryItem[];
  message?: string;
  error?: string;
}

export interface ScriptResponse {
  success: boolean;
  topic?: string;
  data?: VideoScript;
  error?: string;
}

export interface HealthResponse {
  status: string;
  uptime: number;
  timestamp: string;
  geminiConfigured: boolean;
  pexelsConfigured?: boolean;
  youtubeConfigured?: boolean;
}

export interface RenderResponse {
  success: boolean;
  mode?: string;
  filePath?: string;
  filename?: string;
  videoUrl?: string;
  previewUrl?: string;
  localPreviewPath?: string;
  photographer?: string;
  isFallback?: boolean;
  sizeBytes?: number;
  durationSeconds?: number;
  resolution?: string;
  error?: string;
}

export interface YouTubeUploadResponse {
  success: boolean;
  videoId?: string;
  videoUrl?: string;
  shortUrl?: string;
  title?: string;
  privacyStatus?: string;
  comment?: {
    posted: boolean;
    commentId?: string | null;
    text?: string;
    isPinnedByAuthor?: boolean;
  };
  error?: string;
  details?: any;
}

export interface AutoPostResponse {
  success: boolean;
  step?: string;
  totalTimeSeconds?: string;
  scriptData?: VideoScript;
  renderResult?: RenderResponse;
  youtube?: YouTubeUploadResponse;
  isYouTubePublished?: boolean;
  youtubeUrl?: string;
  videoUrl?: string;
  shortUrl?: string;
  commentText?: string;
  error?: string;
}

export interface YouTubeAuthStatus {
  configured: boolean;
  authenticated: boolean;
  channelTitle?: string;
  channelId?: string | null;
  subscriberCount?: string;
  isInvalidGrant?: boolean;
  error?: string;
  details?: string | null;
}

export interface EnvConfig {
  GEMINI_API_KEY: string;
  PEXELS_API_KEY: string;
  YOUTUBE_CLIENT_ID: string;
  YOUTUBE_CLIENT_SECRET: string;
  YOUTUBE_REFRESH_TOKEN: string;
  YOUTUBE_PRIVACY_STATUS: string;
}
