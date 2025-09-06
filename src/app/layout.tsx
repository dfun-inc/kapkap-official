'use client';

import { NextIntlClientProvider } from 'next-intl';
import { useEffect, useState } from "react";
import { ReactLenis } from 'lenis/react'
import { ToastContainer, Bounce } from 'react-toastify';
import '@rainbow-me/rainbowkit/styles.css';

import "@/app/globals.css";
import Header from "@/components/Header";
import { messages, Locale } from '@/lib/i18n';
import { AppProvider } from '@/context/AppContext'
import EvmProvider from '@/context/WalletProvider';

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
      <title>KapKap - Attention is all you earn</title>
      <body>
        <AppProvider>
          <EvmProvider>
            <NextIntlClientProvider locale={locale} messages={messages[locale]} timeZone="America/New_York">
              <ReactLenis className="" root options={{ lerp: 0.08, smoothWheel: true }}>
                <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable={false}
                    pauseOnHover
                    theme="dark"
                    transition={Bounce}
                    toastClassName="custom-toast"
                />  
                <div className="relative">
                  <Header locale={locale} handleChangeLang={handleChangeLanguage} />
                  {children}
                </div>
              </ReactLenis>
            </NextIntlClientProvider> 
          </EvmProvider>
        </AppProvider>
      </body>
    </html>
  );
}
