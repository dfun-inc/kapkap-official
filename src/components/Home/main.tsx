'use client';

import Button from '@/components/ui/Button';
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

    gsap.to('.main-btn-box', {
      opacity: 0.2,
      y: -80,
      scrollTrigger: {
        trigger:".main-section",
        start: '20% top',
        end: '50% top',
        scrub: true,
      },
    })
  })

  return (
    <section id="home-section-0" className="main-section home-section-0 bg-[#070709] h-screen min-h-[720px]">
      <div className="max-w-[1920px] mx-auto px-5 lg:px-18 2xl:px-24 h-full flex items-center">
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
    </section>
  );
}
