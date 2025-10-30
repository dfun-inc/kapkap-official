'use client';

import { useTranslations } from 'next-intl';

import 'swiper/css';
import { useEffect } from 'react';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function Kscore() {
  const t = useTranslations();

  useEffect(() => {
  }, [])

  return (
    <main className="k-score-page min-h-screen bg-[#121212] relative">
      <div className="max-w-[1920px] mx-auto relative px-5 lg:px-18 2xl:px-24 pt-28 pb-20">
        <div className="animate__fadeInUp animate__animated text-[20px] lg:text-[30px] font-ethnocentric-rg text-white leading-tight">
          <div className="roadmap-title mx-auto inline-block border-b border-[#FEBD32]">{t('kscore.title')}</div>
        </div>
        <div className="mt-12 animate__fadeInUp animate__animated animate__delay-500 bg-black/50 rounded-[20px] p-5">
          <div className="flex flex-wrap">
            <div className="w-full md:w-[320px] xl:w-[420px] 2xl:w-[560px] aspect-[7/4]">
              <img className="w-full h-full object-cover rounded-[20px]" src="/images/games/genkiminer.jpg" alt="genkiminer" />
            </div>
            <div className="w-full md:flex-1 mt-6 md:mt-0 md:pl-5">
              <div className="text-[30px] text-[#FEBD32]">{t('kscore.item1Name')}</div>
              <div className="text-[18px] text-[#8D73FF] leading-tight">{t('kscore.item1Type')}</div>
              <div className="mt-3 text-[18px] text-[#DDD5FF]">
                <div className="">{t('kscore.advantage')}: {t('kscore.item1Advantage')}</div>
                <div className="">{t('kscore.cooperationValue')}: {t('kscore.item1Coop')}</div>
              </div>
              <div className="flex justify-end space-x-6 mt-6">
                {/*
                <Button href="/genkiMinerMint" className="px-10 py-4">
                  {t('mint.mint')}
                </Button>
                */}
                <Button className="px-10 py-4" target="_blank" href="https://t.me/GenkiMinerBot/GenkiMiner?startapp=tBkdxxEA">
                  {t('kscore.playGame')}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="animate__fadeInUp animate__animated animate__delay-1000 bg-black/50 rounded-[20px] p-5 mt-8">
          <div className="flex flex-wrap">
            <div className="w-full md:w-[320px] xl:w-[420px] 2xl:w-[560px] aspect-[7/4]">
              <img className="w-full h-full object-cover rounded-[20px]" src="/images/games/idle.jpg" alt="idle" />
            </div>
            <div className="w-full md:flex-1 mt-6 md:mt-0 md:pl-5">
              <div className="text-[30px] text-[#FEBD32]">{t('kscore.item2Name')}</div>
              <div className="text-[18px] text-[#8D73FF] leading-tight">{t('kscore.item2Type')}</div>
              <div className="mt-3 text-[18px] text-[#DDD5FF]">
                <div className="">{t('kscore.advantage')}: {t('kscore.item2Advantage')}</div>
                <div className="">{t('kscore.cooperationValue')}: {t('kscore.item2Coop')}</div>
              </div>
              <div className="text-right text-[30px] mt-12 text-[#8D73FF]">{t('kscore.comingSoon')}</div>
            </div>
          </div>
        </div>

        <div className="animate__fadeInUp animate__animated animate__delay-1500 bg-black/50 rounded-[20px] p-5 mt-8">
          <div className="flex flex-wrap">
            <div className="w-full md:w-[320px] xl:w-[420px] 2xl:w-[560px] aspect-[7/4]">
              <img className="w-full h-full object-cover rounded-[20px]" src="/images/games/SOG1.jpg" alt="SOG1" />
            </div>
            <div className="w-full md:flex-1 mt-6 md:mt-0 md:pl-5">
              <div className="text-[30px] text-[#FEBD32]">{t('kscore.item3Name')}</div>
              <div className="text-[18px] text-[#8D73FF] leading-tight">{t('kscore.item3Type')}</div>
              <div className="mt-3 text-[18px] text-[#DDD5FF]">
                <div className="">{t('kscore.advantage')}: {t('kscore.item3Advantage')}</div>
                <div className="">{t('kscore.cooperationValue')}: {t('kscore.item3Coop')}</div>
              </div>
              <div className="text-right text-[30px] mt-12 text-[#8D73FF]">{t('kscore.comingSoon')}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#090909] py-6">
        <div className="max-w-[1920px] mx-auto px-5 lg:px-18 2xl:px-24">
          <Footer />
        </div>
      </div>
    </main>
  );
}
