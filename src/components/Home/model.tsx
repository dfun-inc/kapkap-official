'use client';

import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useEffect, useState } from 'react';

gsap.registerPlugin(ScrollTrigger)

export default function Model() {
  const t = useTranslations();
  const [aniTitle, setAniTitle] = useState<string>("opacity-0");
  const [aniContent, setAniContent] = useState<string>("opacity-0");
  const [aniBottom, setAniBottom] = useState<string>("opacity-0");

  useEffect(() => {
    const winW = window.innerWidth;
    let ctx:any = null;
    if(winW >= 768) {
      ScrollTrigger.create({
        trigger: ".model-section",
        start: "top 60%",
        once: true,
        onEnter: () => {
          setAniTitle("animate__fadeInUp");
          setAniContent("animate__fadeInUp");
          setAniBottom("animate__fadeInUp");
        },
      }); 

      gsap.to('.model-content-box', {
        opacity: 0.2,
        y: -60,
        scrollTrigger: {
          trigger:".model-section",
          start: 'top+=40% top',
          end: 'top+=60% top',
          scrub: true,
        },
      })

      gsap.to('.model-title', {
        opacity: 0.2,
        y: -60,
        scrollTrigger: {
          trigger:".model-section",
          start: 'top-=10% top',
          end: 'top+=20% top',
          scrub: true,
        },
      })

      gsap.to('.model-bottom-box', {
        opacity: 0.2,
        y: -60,
        scrollTrigger: {
          trigger:".model-section",
          start: 'top+=60% top',
          end: 'top+=80% top',
          scrub: true,
        },
      })
    }
    else {
      setAniTitle("animate__fadeInUp");
      setAniContent("animate__fadeInUp");
      setAniBottom("animate__fadeInUp");
    }

    return () => ctx?.revert();
  }, [])

  return (
    <section className="model-section bg-[#121212] relative z-1">
      <div className="model-section-container max-w-[1920px] mx-auto px-3 md:px-18 2xl:px-24 pt-32 pb-16">
        <div className="model-title">
          <div className={aniTitle + " animate__animated text-[20px] xl:text-[30px] font-ethnocentric-rg text-white inline-block border-b border-[#FEBD32] leading-tight"}>
            {t('model.title')}
          </div>
        </div>
        <div className="mt-24 model-content-box md:px-5">
          <div className={aniContent + " animate__animated animate__delay-500"}>
            <div className="w-[160px] md:w-[386px] relative mx-auto text-[#FEBD32] font-univeunivia-pro-bold text-[14px] md:text-[20px]">
              <img className="w-full h-auto" src="/images/model_illus.png" alt="" />
              <div className="absolute bottom-full left-1/2 -ml-[60px] md:-ml-[90px] w-[120px] md:w-[180px] text-center">{t('model.uca')}</div>
              <div className="absolute top-1/3 right-full w-[120px] md:w-[180px]">{t('model.ppeg')}</div>
              <div className="absolute top-4/5 right-9/10 w-[120px] md:w-[180px] text-right">{t('model.uar')}</div>
              <div className="absolute top-1/3 left-full w-[120px] md:w-[180px]">{t('model.err')}</div>
              <div className="absolute top-4/5 left-9/10 w-[140px] md:w-[200px]">{t('model.pprpp')}</div>
            </div>
          </div>
        </div>
        <div className="mt-16 model-bottom-box max-w-[580px] mx-auto">
          <div className={aniBottom + " animate__animated animate__delay-1000"}>
            <div className="text-[#8D73FF] text-center">{t('model.bottomContent')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
