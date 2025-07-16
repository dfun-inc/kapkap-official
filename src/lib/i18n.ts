import en from '@/i18n/en.json';
import zh from '@/i18n/zh-CN.json';

export const messages = {
  en,
  zh,
} as const;

export type Locale = keyof typeof messages;
