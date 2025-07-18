'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger)

export default function feature() {
  const t = useTranslations();

  useEffect(() => {
    const winW = window.innerWidth;
    let ctx:any = null;
    if(winW >= 768) {
      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: ".feature-section",
          start: "top top", // section 顶部到达视口顶部
          end: "75% top", // section 底部到达视口顶部时结束 pin
          pin: ".feature-title",
          pinSpacing: false, // 不留空白
        });
      });
    }

    return () => ctx?.revert();
  }, [])

  return (
    <section id="home-section-1" className="home-section-1 feature-section bg-[#121212]">
      <div className="max-w-[1920px] mx-auto px-10 lg:px-18 2xl:px-24 pb-16">
        <div className="md:w-1/2 md:text-center feature-title pt-16 md:pt-[30vh] text-[20px] lg:text-[40px] font-ethnocentric-rg text-white leading-tight">
          <div className="mx-auto inline-block border-b border-[#FEBD32]">{t('feature.title')}</div>
        </div>
        <div className="flex flex-wrap justify-end md:-mt-20">
          <div className="md:w-1/2">
            <div className="w-full feature-item feature-item-1 px-5 lg:px-8 2xl:px-10 py-3 lg:py-5 2xl:py-7 overflow-hidden rounded-3xl mt-5 md:mt-0">
              <div className="text-xl 2xl:text-3xl text-[#8D73FF]">{t('feature.item1title')}</div>
              <div className="mt-4 2xl:text-lg md:w-4/5 text-[#CFC4FF]">{t('feature.item1content')}</div>
            </div>
            <div className="w-full feature-item feature-item-2 px-5 lg:px-8 2xl:px-10 py-3 lg:py-5 2xl:py-7 overflow-hidden rounded-3xl mt-5 md:mt-40">
              <div className="text-xl 2xl:text-3xl text-[#8D73FF]">{t('feature.item2title')}</div>
              <div className="mt-4 2xl:text-lg md:w-4/5 text-[#CFC4FF]">{t('feature.item2content')}</div>
            </div>
            <div className="w-full feature-item feature-item-3 px-5 lg:px-8 2xl:px-10 py-3 lg:py-5 2xl:py-7 overflow-hidden rounded-3xl mt-5 md:mt-40">
              <div className="text-xl 2xl:text-3xl text-[#8D73FF]">{t('feature.item3title')}</div>
              <div className="mt-4 2xl:text-lg md:w-4/5 text-[#CFC4FF]">{t('feature.item3content')}</div>
            </div>
            <div className="w-full feature-item feature-item-4 px-5 lg:px-8 2xl:px-10 py-3 lg:py-5 2xl:py-7 overflow-hidden rounded-3xl mt-5 md:mt-40">
              <div className="text-xl 2xl:text-3xl text-[#8D73FF]">{t('feature.item4title')}</div>
              <div className="mt-4 2xl:text-lg md:w-4/5 text-[#CFC4FF]">
                <div>{t('feature.item4content')}</div>
                <div className="flex items-start mt-2">
                  <div className="rounded-full bg-[#8D73FF] w-3 h-3 mr-3 mt-1"></div>
                  <div className="flex-1"><span className="text-[#FFDDC4]">{t('feature.item4sub1title')}</span>{t('feature.item4sub1content')}</div>
                </div>
                <div className="flex">
                  <div className="rounded-full bg-[#8D73FF] w-3 h-3 mr-3 mt-1"></div>
                  <div className="flex-1"><span className="text-[#FFDDC4]">{t('feature.item4sub2title')}</span>{t('feature.item4sub2content')}</div>
                </div>
                <div className="flex">
                  <div className="rounded-full bg-[#8D73FF] w-3 h-3 mr-3 mt-1"></div>
                  <div className="flex-1"><span className="text-[#FFDDC4]">{t('feature.item4sub3title')}</span>{t('feature.item4sub3content')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
