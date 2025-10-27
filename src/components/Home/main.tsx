'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect } from 'react';
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Main() {
  const t = useTranslations();

  useEffect(() => {
    gsap.to('.main-logo', {
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
        start: '30% top',
        end: '60% top',
        scrub: true,
      },
    })
  })

  return (
    <section id="home-section-0" className="main-section relative home-section-0 bg-[#070709] h-screen min-h-[720px] overflow-hidden">
      <div className="w-full h-screen min-h-[720px] overflow-hidden absolute z-0 opacity-60 md:opacity-100">
        <div className="aspect-video lg:aspect-auto w-auto lg:w-full h-full inset-0 absolute top-0 left-0 z-0 -translate-x-1/2 md:-translate-x-1/3 lg:translate-x-0 overflow-hidden">
          <video id="bg-video" data-role="background" className="w-full h-full object-cover pointer-events-none" src="/videos/bg_main.mp4" autoPlay muted playsInline loop preload="auto"></video>
        </div>
      </div>
      <div className="max-w-[1920px] mx-auto px-5 lg:px-18 2xl:px-24 h-full relative z-2 border-b border-[#201e2a]">
        <div className="w-full flex flex-col h-full">
          <div className="w-full flex-1 min-h-[300px] flex items-center">
            <div className="w-full pt-12">
              <div className="main-logo">
                <img className="w-100 md:w-[560px] animate__animated animate__fadeInUp text-[#6E4DFF]" src="/images/logo.png" alt="" />
              </div>
              <div className="title-text-bottom mt-7">
                <span className="inline-block animate__animated animate__fadeInUp text-[#8A84A3] text-[16px] md:text-[18px]">{t('main.desc')}</span>
              </div>
            </div>
          </div>
          <div className="main-desc pb-[10vh] md:pb-[16vh] flex">
            <div className="animate__animated animate__fadeInUp flex flex-wrap flex-col w-full md:w-auto">
              <div className="flex items-center space-x-3 md:space-x-6 justify-start md:justify-between">
                <div className="text-[#8A84A3] text-[12px] uppercase">{t('main.investors')}</div>
                <img className="w-auto h-[18px] md:h-[32px]" src="/images/main_investors.png" alt="" />
              </div>
              <div className="w-full flex items-center space-x-6 justify-start md:justify-between mt-6">
                <div className="flex items-center space-x-3 md:space-x-6">
                  <div className="text-[#8A84A3] text-[12px] uppercase">{t('main.partners')}</div>
                  <img className="w-auto h-[18px] md:h-[32px]" src="/images/main_partners.png" alt="" />
                </div>
                <div className="flex items-center space-x-3 md:space-x-6">
                  <div className="text-[#8A84A3] text-[12px] uppercase">{t('main.kol')}</div>
                  <div className="text-[#8A84A3] text-[16px]">Beanie</div>
                </div>
              </div>
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
