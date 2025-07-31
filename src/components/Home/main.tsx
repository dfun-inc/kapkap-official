'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect } from 'react';
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Main() {
  const t = useTranslations();
  const locale = useLocale();

  useEffect(() => {
    gsap.to('.title-text-top', {
      opacity: 0.2,
      y: -50,
      scrollTrigger: {
        trigger:".main-section",
        start: '5% top',
        end: '35% top',
        scrub: true,
      },
    })

    gsap.to('.title-text-bottom', {
      opacity: 0.2,
      y: -50,
      scrollTrigger: {
        trigger:".main-section",
        start: '10% top',
        end: '40% top',
        scrub: true,
      },
    })

    gsap.to('.main-desc', {
      opacity: 0.2,
      y: -50,
      scrollTrigger: {
        trigger:".main-section",
        start: '15% top',
        end: '45% top',
        scrub: true,
      },
    })
  })

  return (
    <section id="home-section-0" className="main-section relative home-section-0 bg-[#070709] h-screen min-h-[720px] overflow-hidden">
      <div className="w-full h-screen min-h-[720px] overflow-hidden absolute z-0 opacity-80 md:opacity-100">
        <div className="aspect-video lg:aspect-auto w-auto lg:w-full h-full absolute top-0 left-0 z-0 -translate-x-1/2 md:-translate-x-1/3 lg:translate-x-0 overflow-hidden">
          <video className="w-full h-full object-cover pointer-events-none" src="/videos/bg_main.mp4" autoPlay muted playsInline loop preload="auto"></video>
        </div>
      </div>
      <div className="max-w-[1920px] mx-auto px-5 lg:px-18 2xl:px-24 h-full flex items-center relative z-2 border-b border-[#201e2a]">
        <div className="w-full">
          <div className="font-ethnocentric-rg uppercase">
            <div className="title-text-top text-[36px] lg:text-[62px] xl:text-[72px] 2xl:text-[80px] tracking-widest"><span className="inline-block animate__animated animate__fadeInUp text-[#6E4DFF]">{t('main.title1')}</span></div>
            <div className="title-text-bottom">
              <span className="inline-block animate__animated animate__fadeInUp text-[19px] lg:text-[34px] xl:text-[40px] 2xl:text-[45px]">{t('main.title2')}</span>
              <span className="inline-block animate__animated animate__fadeInUp text-[#FEBD32] text-[36px] lg:text-[62px] xl:text-[72px] 2xl:text-[80px] ml-[18px]"> {t('main.title3')}</span></div>
          </div>
          <div className="main-desc mt-5">
            <div className="animate__animated animate__fadeInUp text-[#8A84A3] text-lg md:text-[24px]">
              {
                locale == "en" ?
                <>
                  <div>{t('main.desc1')} </div>
                  <div className="">
                    <span className="text-[#6E4DFF]">{t('main.descWord1')}</span><span>, </span>
                    <span className="text-[#6E4DFF]">{t('main.descWord2')}</span><span>, </span>
                    <span>{t('main.desc2')} </span>
                    <span className="text-[#6E4DFF]">{t('main.descWord3')}</span><span>.</span>
                  </div>
                </>
                :
                <>
                  <div>
                    <span>{t('main.desc1')}</span>
                    <span className="text-[#6E4DFF]">{t('main.descWord1')}</span><span>、</span>
                    <span className="text-[#6E4DFF]">{t('main.descWord2')}</span><span></span>
                    <span>{t('main.desc2')} </span>
                  </div>
                  <div className="">
                    <span className="text-[#6E4DFF]">{t('main.descWord3')}</span>
                    <span>{t('main.desc3')}</span>
                  </div>
                </>
              }
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-[1px] left-0 w-[53%] pr-[60px] lg:pr-[75px] z-3">
        <div className="w-full h-[44px] lg:h-[55px] bg-[#121212] border-t border-[#201e2a]"></div>
        <div className="absolute z-0 top-0 right-0 w-0 h-0 border-t-0 border-l-0 border-b-[#201e2a] border-r-transparent border-b-[44px] border-r-[60px] lg:border-b-[55px] lg:border-r-[75px]"></div>
        <div className="absolute z-1 top-[1px] right-[1px] w-0 h-0 border-t-0 border-l-0 border-b-[#121212] border-r-transparent border-b-[43px] border-r-[59px] lg:border-b-[54px] lg:border-r-[74px]"></div>
      </div>
    </section>
  );
}
