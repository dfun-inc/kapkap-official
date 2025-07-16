'use client';

import Button from '@/components/ui/Button';
import { useTranslations } from 'next-intl';

export default function Main() {
  const t = useTranslations();

  return (
    <section id="home-section-0" className="main-section home-section-0 bg-[#070709] h-screen min-h-[720px]">
      <div className="max-w-[1920px] mx-auto px-10 lg:px-24 h-full flex items-center">
        <div className="w-full">
          <div className="text-[32px] lg:text-[80px] font-ethnocentric-rg leading-tight">
            <div><span>{t('main.title1')}</span> <span className="text-[#FEBD32]">{t('main.title2')}</span></div>
            <div><span>{t('main.title3')}</span> <span className="text-[#6E4DFF]">{t('main.title4')}</span></div>
          </div>
          <div className="mt-5 lg:w-[876px] lg:max-w-[55%] text-[#8A84A3]">{t('main.desc')}</div>
          <Button href="/" className="text-xl font-light text-white px-10 md:px-15 py-3 md:py-4 mt-30" target="_blank">{t('main.getSupport')}</Button>
        </div>
      </div>
    </section>
  );
}
