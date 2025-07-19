'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger)

export default function feature() {
  const t = useTranslations();
  const [aniClassLeft, setAniClassLeft] = useState<string>("opacity-0");
  const [aniClassRight, setAniClassRight] = useState<string>("opacity-0");
  const [aniTitle, setAniTitle] = useState<string>("opacity-0");

  useEffect(() => {
    const winW = window.innerWidth;
    let ctx:any = null;
    if(winW >= 768) {
      ScrollTrigger.create({
        trigger: ".feature-section",
        start: "top 60%",
        once: true,
        onEnter: () => {
          setAniClassLeft("animate__fadeInLeft");
          setAniClassRight("animate__fadeInRight");
          setAniTitle("animate__fadeInUp");
        },
      }); 
    }
    else {
      setAniClassLeft("animate__fadeInLeft");
      setAniClassRight("animate__fadeInRight");
      setAniTitle("animate__fadeInUp");
    }

    return () => ctx?.revert();
  }, [])

  return (
    <section id="home-section-1" className="home-section-1 feature-section bg-[#121212]">
      <div className="max-w-[1920px] mx-auto px-10 lg:px-18 2xl:px-24 py-16">
        <div className={aniTitle + " animate__animated feature-title text-[20px] lg:text-[40px] font-ethnocentric-rg text-white leading-tight"}>
          <div className="mx-auto inline-block border-b border-[#FEBD32]">{t('feature.title')}</div>
        </div>
        <div className="md:flex gap-x-5 items-stretch justify-between mt-12">
          <div className={aniClassLeft + " animate__animated animate__delay-500 flex-1 w-full feature-item feature-item-1 px-5 lg:px-8 2xl:px-10 py-3 lg:py-5 2xl:py-7 overflow-hidden rounded-3xl mt-5"}>
            <div className="text-xl 2xl:text-3xl text-[#8D73FF]">{t('feature.item1title')}</div>
            <div className="mt-4 2xl:text-lg md:w-4/5 text-[#CFC4FF]">{t('feature.item1content')}</div>
          </div>
          <div className={aniClassRight + " animate__animated animate__delay-500 flex-1 w-full feature-item feature-item-2 px-5 lg:px-8 2xl:px-10 py-3 lg:py-5 2xl:py-7 overflow-hidden rounded-3xl mt-5"}>
            <div className="text-xl 2xl:text-3xl text-[#8D73FF]">{t('feature.item2title')}</div>
            <div className="mt-4 2xl:text-lg md:w-4/5 text-[#CFC4FF]">{t('feature.item2content')}</div>
          </div>
        </div>
        <div className="md:flex gap-x-5 items-stretch justify-between">
          <div className={aniClassLeft + " animate__animated animate__delay-1000 flex-1 w-full feature-item feature-item-3 px-5 lg:px-8 2xl:px-10 py-3 lg:py-5 2xl:py-7 overflow-hidden rounded-3xl mt-5"}>
            <div className="text-xl 2xl:text-3xl text-[#8D73FF]">{t('feature.item3title')}</div>
            <div className="mt-4 2xl:text-lg md:w-4/5 text-[#CFC4FF]">{t('feature.item3content')}</div>
          </div>
          <div className={aniClassRight + " animate__animated animate__delay-1000 flex-1 w-full feature-item feature-item-4 px-5 lg:px-8 2xl:px-10 py-3 lg:py-5 2xl:py-7 overflow-hidden rounded-3xl mt-5"}>
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
    </section>
  );
}
