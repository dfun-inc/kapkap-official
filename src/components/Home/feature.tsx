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

      gsap.to('.feature-title', {
        opacity: 0.2,
        y: -60,
        scrollTrigger: {
          trigger:".feature-section",
          start: 'top top',
          end: 'top+=20% top',
          scrub: true,
        },
      })

      gsap.to('.feature-item-top', {
        opacity: 0.2,
        y: -60,
        scrollTrigger: {
          trigger:".feature-section",
          start: 'top+=30% top',
          end: 'top+=50% top',
          scrub: true,
        },
      })
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
      <div className="max-w-[1920px] mx-auto px-5 lg:px-18 2xl:px-24 py-16">
        <div className={aniTitle + " animate__animated text-[20px] xl:text-[30px] font-ethnocentric-rg text-white leading-tight"}>
          <div className="feature-title mx-auto inline-block border-b border-[#FEBD32]">{t('feature.title')}</div>
        </div>
        <div className="flex flex-wrap items-center justify-between mt-12 feature-item-top">
          <div className={aniClassLeft + " animate__animated animate__delay-500 w-full md:w-3/5 md:max-w-[820px] md:w-2/3"}>
            <div className="text-[18px] xl:text-[24px] text-[#8D73FF]">{t('feature.subTitle')}</div>
            <div className="text-[16px] text-[#DDD5FF] mt-10 leading-[30px]">{t('feature.desc1')}</div>
            <div className="text-[16px] text-[#DDD5FF] leading-[30px]">{t('feature.desc2')}</div>
            <div className="text-[16px] text-[#DDD5FF] leading-[30px]">{t('feature.desc3')}</div>
          </div>
          <div className={aniClassRight + " animate__animated animate__delay-500 mt-12 md:mt-0 md:flex-1 w-full md:w-auto relative"}>
            <div className="relative w-3/5 max-w-[376px] mx-auto">
              <img className="w-full" src="./images/feature_illus.png" alt="" />
              <div className="absolute -top-7 xl:-top-8 left-1/2 -translate-x-1/2 text-[18px] xl:text-[24px] text-white font-univia-pro-bold">{t('feature.user')}</div>
              <div className="absolute top-2/5 right-3/4 text-[18px] xl:text-[24px] text-[#FEBD32] font-univia-pro-bold whitespace-nowrap">{t('feature.valueRewards')}</div>
              <div className="absolute top-2/5 left-3/4 text-[18px] xl:text-[24px] text-[#FEBD32] font-univia-pro-bold whitespace-nowrap">{t('feature.attention')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
