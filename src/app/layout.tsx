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
import { TonConnectUIProvider } from '@tonconnect/ui-react';

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
    // const storedLang = localStorage.getItem('locale') as Locale;
    const storedLang = 'en';
    if (storedLang && messages[storedLang]) {
      setLocale(storedLang);
    }
  }, []);

  return (
    <html lang={locale == 'en' ? 'en' : 'zh-CN'}>
      <head>
        <title>KapKap - Al-driven Web3 Attention Economy and Value Distribution Platform</title>
        <script dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-N2P38SKS');`}} 
        />
      </head>
      <body>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
              <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N2P38SKS"
height="0" width="0" style="display:none;visibility:hidden"></iframe>
            `,
          }}
        />
        <AppProvider>
          <EvmProvider>
            <TonConnectUIProvider manifestUrl="https://cdn.kapkap.io/mainifest.json">
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
            </TonConnectUIProvider>
          </EvmProvider>
        </AppProvider>
      </body>
    </html>
  );
}
