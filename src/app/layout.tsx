'use client';

import "@/app/globals.css";
import Header from "@/components/Header";
import { messages, Locale } from '@/lib/i18n';
import { NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from "react";

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
      <title>Gamix - Find hits fast profit</title>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages[locale]} timeZone="America/New_York">
          <Header locale={locale} handleChangeLang={handleChangeLanguage} />
          {children}
        </NextIntlClientProvider> 
      </body>
    </html>
  );
}
