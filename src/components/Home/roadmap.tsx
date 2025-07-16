'use client';

import { useTranslations } from 'next-intl';

export default function Roadmap() {
  const t = useTranslations();

  return (
    <section id="home-section-3" className="roadmap-section home-section-3 bg-[##060608] relative">
      <div className="max-w-[1920px] mx-auto px-10 lg:px-24 pt-6 pb-12">
        <div className="text-[20px] lg:text-[40px] font-ethnocentric-rg text-white inline-block border-b border-[#FEBD32] leading-tight">
          {t('roadmap.title')}
        </div>
        <div className="mt-15 text-lg">
          <div className="relative text-[#DDD5FF]">
            <div className="absolute top-0 left-[9px] w-[2px] h-full bg-[#8D73FF] z-0"></div>
            <div className="flex items-start relative z-1">
              <div className="border-[2px] border-[#8D73FF] bg-[#312a4d] rounded-full w-5 h-5 flex items-center justify-center">
                <div className="w-[10px] h-[10px] bg-[#ffbd2f] rounded-full"></div>
              </div>
              <div className="ml-2 md:ml-4ml-4 leading-none flex-1">{t('roadmap.step1')}</div>
            </div>
            <div className="flex items-start relative z-1 mt-6">
              <div className="border-[2px] border-[#8D73FF] bg-[#312a4d] rounded-full w-5 h-5 flex items-center justify-center">
                <div className="w-[10px] h-[10px] bg-[#ffbd2f] rounded-full"></div>
              </div>
              <div className="ml-2 md:ml-4ml-4 leading-none flex-1">{t('roadmap.step2')}</div>
            </div>
            <div className="flex items-start relative z-1 mt-6">
              <div className="border-[2px] border-[#8D73FF] bg-[#312a4d] rounded-full w-5 h-5 flex items-center justify-center">
                <div className="w-[10px] h-[10px] bg-[#ffbd2f] rounded-full"></div>
              </div>
              <div className="ml-2 md:ml-4ml-4 leading-none flex-1">{t('roadmap.step3')}</div>
            </div>
            <div className="flex items-start relative z-1 mt-6">
              <div className="border-[2px] border-[#8D73FF] bg-[#312a4d] rounded-full w-5 h-5 flex items-center justify-center">
                <div className="w-[10px] h-[10px] bg-[#ffbd2f] rounded-full"></div>
              </div>
              <div className="ml-2 md:ml-4ml-4 leading-none flex-1">{t('roadmap.step4')}</div>
            </div>
          </div>
          <div className="relative pt-6 text-[#8A84A3]">
            <div className="absolute top-0 left-[9px] w-[2px] h-full bg-[#4B436F] z-0"></div>
            <div className="flex items-start relative z-1">
              <div className="border-[2px] border-[#4B436F] bg-[#201e2a] rounded-full w-5 h-5 flex items-center justify-center"></div>
              <div className="ml-2 md:ml-4ml-4 leading-none flex-1">{t('roadmap.step5')}</div>
            </div>
            <div className="flex items-start relative z-1 mt-6">
              <div className="border-[2px] border-[#4B436F] bg-[#201e2a] rounded-full w-5 h-5 flex items-center justify-center"></div>
              <div className="ml-2 md:ml-4ml-4 leading-none flex-1">{t('roadmap.step6')}</div>
            </div>
            <div className="flex items-start relative z-1 mt-6">
              <div className="border-[2px] border-[#4B436F] bg-[#201e2a] rounded-full w-5 h-5 flex items-center justify-center"></div>
              <div className="ml-2 md:ml-4 leading-none flex-1">{t('roadmap.step7')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
