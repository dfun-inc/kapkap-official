'use client';

import { useTranslations } from 'next-intl';

export default function Future() {
  const t = useTranslations();

  return (
    <section id="home-section-1" className="home-section-1 bg-[#121212]">
      <div className="max-w-[1920px] mx-auto px-10 lg:px-24 py-16">
        <div className="text-[20px] lg:text-[40px] font-ethnocentric-rg text-white inline-block border-b border-[#FEBD32] leading-tight">
          {t('future.title')}
        </div>
        <div className="md:flex gap-x-5 items-stretch justify-between mt-12">
          <div className="w-full future-item future-item-1 px-5 lg:px-10 py-3 lg:py-7 overflow-hidden rounded-3xl">
            <div className="text-xl 2xl:text-3xl text-[#8D73FF]">{t('future.item1title')}</div>
            <div className="mt-4 2xl:text-lg md:w-4/5 text-[#CFC4FF]">{t('future.item1content')}</div>
          </div>
          <div className="w-full future-item future-item-2 px-5 lg:px-10 py-3 lg:py-7 overflow-hidden rounded-3xl mt-5 md:mt-0">
            <div className="text-xl 2xl:text-3xl text-[#8D73FF]">{t('future.item2title')}</div>
            <div className="mt-4 2xl:text-lg md:w-4/5 text-[#CFC4FF]">{t('future.item2content')}</div>
          </div>
        </div>
        <div className="md:flex gap-x-5 items-stretch justify-between">
          <div className="flex-1 w-full future-item future-item-3 px-5 lg:px-10 py-3 lg:py-7 overflow-hidden rounded-3xl mt-5">
            <div className="text-xl 2xl:text-3xl text-[#8D73FF]">{t('future.item3title')}</div>
            <div className="mt-4 2xl:text-lg md:w-4/5 text-[#CFC4FF]">{t('future.item3content')}</div>
          </div>
          <div className="flex-1 w-full md:w-[47.5%] future-item future-item-4 px-5 lg:px-10 py-3 lg:py-7 overflow-hidden rounded-3xl mt-5">
            <div className="text-xl 2xl:text-3xl text-[#8D73FF]">{t('future.item4title')}</div>
            <div className="mt-4 2xl:text-lg md:w-4/5 text-[#CFC4FF]">
              <div>{t('future.item4content')}</div>
              <div className="flex items-start mt-2">
                <div className="rounded-full bg-[#8D73FF] w-3 h-3 mr-3 mt-1"></div>
                <div className="flex-1"><span className="text-[#FFDDC4]">{t('future.item4sub1title')}</span>{t('future.item4sub1content')}</div>
              </div>
              <div className="flex">
                <div className="rounded-full bg-[#8D73FF] w-3 h-3 mr-3 mt-1"></div>
                <div className="flex-1"><span className="text-[#FFDDC4]">{t('future.item4sub2title')}</span>{t('future.item4sub2content')}</div>
              </div>
              <div className="flex">
                <div className="rounded-full bg-[#8D73FF] w-3 h-3 mr-3 mt-1"></div>
                <div className="flex-1"><span className="text-[#FFDDC4]">{t('future.item4sub3title')}</span>{t('future.item4sub3content')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
