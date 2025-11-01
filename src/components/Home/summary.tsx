'use client';

import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/Button';

gsap.registerPlugin(ScrollTrigger)

export default function Summary() {
  const t = useTranslations();
  const [aniTitle, setAniTitle] = useState<string>("opacity-0");
  const [aniItemLeft, setAniItemLeft] = useState<string>("opacity-0");
  const [aniItemRight, setAniItemRight] = useState<string>("opacity-0");

  useEffect(() => {
    const winW = window.innerWidth;
    let ctx:any = null;
    if(winW >= 768) {
      ScrollTrigger.create({
        trigger: ".summary-section",
        start: "top 60%",
        once: true,
        onEnter: () => {
          setAniTitle("animate__fadeInUp");
          setAniItemLeft("animate__fadeInUp");
          setAniItemRight("animate__fadeInUp");
        },
      }); 

      ctx = gsap.context(() => {
        gsap.to('.summary-content-box', {
          opacity: 0.2,
          y: -60,
          scrollTrigger: {
            trigger:".summary-section",
            start: 'top+=50% top',
            end: 'top+=80% top',
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        })

        gsap.to('.summary-content-box', {
          opacity: 0.2,
          y: -60,
          scrollTrigger: {
            trigger:".summary-section",
            start: 'top+=50% top',
            end: 'top+=80% top',
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        })

        gsap.to('.summary-title', {
          opacity: 0.2,
          y: -60,
          scrollTrigger: {
            trigger:".summary-section",
            start: 'top-=10% top',
            end: 'top+=20% top',
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        })
      })
    }
    else {
      setAniTitle("animate__fadeInUp");
      setAniItemLeft("animate__fadeInLeft");
      setAniItemRight("animate__fadeInRight");
    }

    return () => ctx?.revert();
  }, [])

  return (
    <section className="summary-section bg-[#121212] relative z-2">
      <div className="max-w-[1920px] mx-auto px-3 md:px-18 2xl:px-24 py-16">
        <div className="summary-title">
          <div className={aniTitle + " animate__animated text-[20px] xl:text-[30px] font-ethnocentric-rg text-white inline-block border-b border-[#FEBD32] leading-tight"}>
            {t('summary.title')}
          </div>
        </div>
        <div className="summary-content-box flex flex-wrap items-stretch justify-between mt-10 md:mt-23">
          <div className="w-full md:w-1/2 md:pr-2 mt-4">
            <div className={aniItemLeft + " summary-item summary-item-1 animate__animated animate__delay-500 px-15 py-10 rounded-[20px] h-full"}>
              <div className="text-[18px] xl:text-[22px] text-[#8D73FF]">{t('summary.itemTitle1')}</div>
              <div className="text-[16px] text-[#DDD5FF] mt-4 leading-[24px]">{t('summary.itemContent1')}</div>
            </div>
          </div>
          <div className="w-full md:w-1/2 md:pl-2 mt-4">
            <div className={aniItemLeft + " summary-item summary-item-2 animate__animated animate__delay-500 px-15 py-10 rounded-[20px] h-full"}>
              <div className="text-[18px] xl:text-[22px] text-[#8D73FF]">{t('summary.itemTitle2')}</div>
              <div className="text-[16px] text-[#DDD5FF] mt-4 leading-[24px]">{t('summary.itemContent2')}</div>
            </div>
          </div>
          <div className="w-full md:w-1/2 md:pr-2 mt-4">
            <div className={aniItemRight + " summary-item summary-item-3 animate__animated animate__delay-500 px-15 py-10 rounded-[20px] h-full"}>
              <div className="text-[18px] xl:text-[22px] text-[#8D73FF]">{t('summary.itemTitle3')}</div>
              <div className="text-[16px] text-[#DDD5FF] mt-4 leading-[24px]">{t('summary.itemContent3')}</div>
            </div>
          </div>
          <div className="w-full md:w-1/2 md:pl-2 mt-4">
            <div className={aniItemRight + " summary-item summary-item-4 animate__animated animate__delay-500 px-15 py-10 rounded-[20px] h-full"}>
              <div className="text-[18px] xl:text-[22px] text-[#8D73FF]">{t('summary.itemTitle4')}</div>
              <div className="text-[16px] text-[#DDD5FF] mt-4 leading-[24px]">{t('summary.itemContent4')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
