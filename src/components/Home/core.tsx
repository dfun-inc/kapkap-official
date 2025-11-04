'use client';

import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';

gsap.registerPlugin(ScrollTrigger)

export default function Core() {
  const t = useTranslations();
  const [aniTitle, setAniTitle] = useState<string>("opacity-0");
  const [aniContent, setAniContent] = useState<string>("opacity-0");
  const [aniBtn, setAniBtn] = useState<string>("opacity-0");

  useEffect(() => {
    const winW = window.innerWidth;
    let ctx:any = null;
    if(winW >= 768) {
      ScrollTrigger.create({
        trigger: ".core-section",
        start: "top 60%",
        once: true,
        onEnter: () => {
          setAniTitle("animate__fadeInUp");
          setAniContent("animate__fadeInUp");
          setAniBtn("animate__fadeInUp");
        },
      }); 

      ctx = gsap.context(() => {
        gsap.to('.core-content-box', {
          opacity: 0.2,
          y: -60,
          scrollTrigger: {
            trigger:".core-section",
            start: 'top+=40% top',
            end: 'top+=60% top',
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        })

        gsap.to('.core-title', {
          opacity: 0.2,
          y: -60,
          scrollTrigger: {
            trigger:".core-section",
            start: 'top-=10% top',
            end: 'top+=20% top',
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        })

        gsap.to('.core-btn-box', {
          opacity: 0.2,
          y: -60,
          scrollTrigger: {
            trigger:".core-section",
            start: 'top+=70% top',
            end: 'top+=90% top',
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        })
      });
    }
    else {
      setAniTitle("animate__fadeInUp");
      setAniContent("animate__fadeInUp");
      setAniBtn("animate__fadeInUp");
    }

    return () => ctx?.revert();
  }, [])

  return (
    <section className="core-section bg-[#090909] relative z-2">
      <div className="absolute bottom-full left-0 w-3/5">
        <div className="w-full h-[44px] lg:h-[55px] bg-[#090909]"></div>
        <div className="absolute z-1 top-0 left-full w-0 h-0 border-t-0 border-l-0 border-b-[#090909] border-r-transparent border-b-[44px] border-r-[60px] lg:border-b-[55px] lg:border-r-[75px]"></div>
      </div>
      <div className="absolute top-full right-0 w-1/2">
        <div className="w-full h-[22px] lg:h-[33px] bg-[#090909]"></div>
        <div className="absolute z-1 top-0 right-full w-0 h-0 border-b-0 border-r-0 border-t-[#090909] border-l-transparent border-t-[22px] border-l-[30px] lg:border-t-[33px] lg:border-l-[40px]"></div>
      </div>
      <div className="max-w-[1920px] mx-auto px-3 md:px-18 2xl:px-24 py-16">
        <div className="core-title">
          <div className={aniTitle + " animate__animated text-[20px] xl:text-[30px] font-ethnocentric-rg text-white inline-block border-b border-[#FEBD32] leading-tight"}>
            {t('core.title')}
          </div>
        </div>
        <div className="mt-20 core-content-box md:px-5">
          <div className={aniContent + " animate__animated animate__delay-500 flex flex-wrap items-center"}>
            <div className="w-full md:w-[470px] px-5 relative">
              <img className="w-full h-auto" src="/images/core_illus.png" alt="kScore" />
              <div className="absolute top-7/10 left-1/12 w-1/7 text-center text-white">{t('core.k-score')}</div>
              <div className="absolute top-1/7 left-1/2 text-[#FEBD32] font-univeunivia-pro-bold text-[20px] -rotate-25">{t('core.mint')}</div>
              <div className="absolute top-[37.5%] left-1/2 text-[#FEBD32] font-univeunivia-pro-bold text-[20px]">{t('core.staking')}</div>
              <div className="absolute top-[62.5%] left-1/2 text-[#FEBD32] font-univeunivia-pro-bold text-[20px] rotate-20">{t('core.redeem')}</div>
            </div>
            <div className="w-full md:flex-1 text-[#CFC4FF] mt-9 md:mt-0">
              <div className="">{t('core.content1')}</div>
              <div className="mt-12">{t('core.content2')}</div>
              <div className="mt-12">{t('core.content3')}</div>
            </div>
          </div>
        </div>
        <div className="mt-15 core-btn-box max-w-[950px] mx-auto">
          <div className={aniBtn + " animate__animated animate__delay-1000"}>
            <div className="text-[#8D73FF] text-center">{t('core.bottomContent')}</div>
            <div className="text-center mt-12">
              <Button href="/kscore" className="inline-block text-[20px] font-light text-white w-40 md:w-60 text-center py-3 md:py-4">
                {t('core.viewBenefits')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
