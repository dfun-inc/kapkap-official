'use client';

import { useTranslations } from 'next-intl';

import 'swiper/css';
import { useEffect, useState } from 'react';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';

export default function Kscore() {
  const t = useTranslations();

  const [toggleContent, setToggleContent] = useState([0, 0, 0]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  return (
    <main className="k-score-page md:min-h-screen bg-[#121212] relative">
      <div className="max-w-[1920px] mx-auto relative px-5 lg:px-18 2xl:px-24 pt-28 pb-20">
        <div className="animate__fadeInUp md:animate__animated text-[20px] lg:text-[30px] font-ethnocentric-rg text-white leading-tight">
          <div className="roadmap-title mx-auto inline-block border-b border-[#FEBD32]">{t('kscore.title')}</div>
        </div>
        <div className="mt-12 animate__fadeInUp md:animate__animated animate__delay-500 bg-black/50 rounded-[20px] p-5">
          <div className="flex flex-wrap">
            <div className="w-full md:w-[320px] xl:w-[420px] 2xl:w-[560px]">
              <img className="w-full rounded-[20px]" src="/images/games/genkiminer.jpg" alt="genkiminer" />
            </div>
            <div className="w-full md:flex-1 mt-6 md:mt-0 md:pl-5">
              <div className="text-[24px] 2xl:text-[30px] text-[#FEBD32]">{t('kscore.item1Name')}</div>
              <div className="text-[18px] text-[#8D73FF] leading-tight">{t('kscore.item1Type')}</div>
              <div className={"mt-3 2xl:text-[18px] text-[#DDD5FF] md:line-clamp-none " + (toggleContent[0] == 1 ? 'line-clamp-none' : 'line-clamp-3')}>
                <div className="">{t('kscore.advantage')}: {t('kscore.item1Advantage')}</div>
                <div className="">{t('kscore.cooperationValue')}: {t('kscore.item1Coop')}</div>
              </div>
              <div className="md:hidden underline text-[#8D73FF]" onClick={() => setToggleContent([toggleContent[0] == 1 ? 0 : 1, toggleContent[1], toggleContent[2]])}>{t(toggleContent[0] == 0 ? t('common.showMore') : t('common.hide'))}</div>
              <div className="flex justify-end space-x-3 md:space-x-6 mt-6">
                <Button className="px-8 md:px-10 py-4" target="_blank" href="https://t.me/GenkiMinerBot/GenkiMiner?startapp=tBkdxxEA">
                  {t('kscore.playGame')}
                </Button>
                <Button href="/genkiMinerMint" className="px-8 md:px-10  py-4">
                  {t('mint.mint')}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="animate__fadeInUp md:animate__animated animate__delay-1000 bg-black/50 rounded-[20px] p-5 mt-8">
          <div className="flex flex-wrap">
            <div className="w-full md:w-[320px] xl:w-[420px] 2xl:w-[560px]">
              <img className="w-full rounded-[20px]" src="/images/games/idle.jpg" alt="idle" />
            </div>
            <div className="w-full md:flex-1 mt-6 md:mt-0 md:pl-5">
              <div className="text-[24px] 2xl:text-[30px] text-[#FEBD32]">{t('kscore.item2Name')}</div>
              <div className="text-[18px] text-[#8D73FF] leading-tight">{t('kscore.item2Type')}</div>
              <div className={"mt-3 2xl:text-[18px] text-[#DDD5FF] md:line-clamp-none " + (toggleContent[1] == 1 ? 'line-clamp-none' : 'line-clamp-3')}>
                <div className="">{t('kscore.advantage')}: {t('kscore.item2Advantage')}</div>
                <div className="">{t('kscore.cooperationValue')}: {t('kscore.item2Coop')}</div>
              </div>
              <div className="md:hidden underline text-[#8D73FF]" onClick={() => setToggleContent([toggleContent[0], toggleContent[1] == 1 ? 0 : 1, toggleContent[2]])}>{t(toggleContent[1] == 0 ? t('common.showMore') : t('common.hide'))}</div>
              <div className="text-right text-[30px] mt-12 text-[#8D73FF]">{t('kscore.comingSoon')}</div>
            </div>
          </div>
        </div>

        <div className="animate__fadeInUp md:animate__animated animate__delay-1500 bg-black/50 rounded-[20px] p-5 mt-8">
          <div className="flex flex-wrap">
            <div className="w-full md:w-[320px] xl:w-[420px] 2xl:w-[560px] aspect-[16/9]">
              <img className="w-full h-full object-cover rounded-[20px]" src="/images/games/SOG1.jpg" alt="SOG1" />
            </div>
            <div className="w-full md:flex-1 mt-6 md:mt-0 md:pl-5">
              <div className="text-[24px] 2xl:text-[30px] text-[#FEBD32]">{t('kscore.item3Name')}</div>
              <div className="text-[18px] text-[#8D73FF] leading-tight">{t('kscore.item3Type')}</div>
              <div className={"mt-3 2xl:text-[18px] text-[#DDD5FF] md:line-clamp-none " + (toggleContent[2] == 1 ? 'line-clamp-none' : 'line-clamp-3')}>
                <div className="">{t('kscore.advantage')}: {t('kscore.item3Advantage')}</div>
                <div className="">{t('kscore.cooperationValue')}: {t('kscore.item3Coop')}</div>
              </div>
              <div className="md:hidden underline text-[#8D73FF]" onClick={() => setToggleContent([toggleContent[0], toggleContent[1], toggleContent[2] == 1 ? 0 : 1])}>{t(toggleContent[2] == 0 ? t('common.showMore') : t('common.hide'))}</div>
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
