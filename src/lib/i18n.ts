import en from '@/i18n/en.json';

export const messages = {
  en
} as const;

export type Locale = keyof typeof messages;
