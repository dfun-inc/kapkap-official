'use client';

import { NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from "react";
import { ReactLenis } from 'lenis/react'

import "@/app/globals.css";
import Header from "@/components/Header";
import { messages, Locale } from '@/lib/i18n';
import { AppProvider } from '@/context/AppContext'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const [locale, setLocale] = useState<Locale>('en');

  const handleChangeLanguage = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  useEffect(() => {
    const storedLang = localStorage.getItem('locale') as Locale;
    if (storedLang && messages[storedLang]) {
      setLocale(storedLang);
    }
  }, []);

  return (
    <html lang={locale == 'en' ? 'en' : 'zh-CN'}>
      <title>Gamix - Attention is all you earn</title>
      <body>
        <AppProvider>
          <NextIntlClientProvider locale={locale} messages={messages[locale]} timeZone="America/New_York">
            <ReactLenis className="" root options={{ lerp: 0.08, smoothWheel: true }}>
              <Header locale={locale} handleChangeLang={handleChangeLanguage} />
              {children}
            </ReactLenis>
          </NextIntlClientProvider> 
        </AppProvider>
      </body>
    </html>
  );
}
