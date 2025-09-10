'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Button from '@/components/ui/Button';

gsap.registerPlugin(ScrollTrigger)

export default function Ecosystem() {
  const t = useTranslations();
  const [aniImg, setAniImg] = useState<string>("opacity-0");
  const [aniTitle, setAniTitle] = useState<string>("opacity-0");
  const [aniContent, setAniContent] = useState<string>("opacity-0");
  const [aniDesc, setAniDesc] = useState<string>("opacity-0");

  useEffect(() => {
    const winW = window.innerWidth;
    let ctx:any = null;
    if(winW >= 768) {
      ScrollTrigger.create({
        trigger: ".eco-section",
        start: "top 60%",
        once: true,
        onEnter: () => {
          setAniImg("animate__fadeInUp");
          setAniTitle("animate__fadeInUp");
          setAniContent("animate__fadeInUp");
          setAniDesc("animate__fadeInUp");
        },
      }); 

      gsap.to('.eco-img-box', {
        opacity: 0.2,
        y: -60,
        scrollTrigger: {
          trigger:".eco-section",
          start: 'top+=20% top',
          end: 'top+=50% top',
          scrub: true,
        },
      })

      gsap.to('.eco-title', {
        opacity: 0.2,
        y: -60,
        scrollTrigger: {
          trigger:".eco-section",
          start: 'top-=10% top',
          end: 'top+=20% top',
          scrub: true,
        },
      })

      gsap.to('.eco-content-box', {
        opacity: 0.2,
        y: -60,
        scrollTrigger: {
          trigger:".eco-section",
          start: 'top+=60% top',
          end: 'top+=80% top',
          scrub: true,
        },
      })
    }
    else {
      setAniImg("animate__fadeInUp");
      setAniTitle("animate__fadeInUp");
      setAniContent("animate__fadeInUp");
      setAniDesc("animate__fadeInUp");
    }

    return () => ctx?.revert();
  }, [])

  return (
    <section className="eco-section bg-[#121212]">
      <div className="max-w-[1920px] mx-auto py-16">
        <div className="eco-title px-5 lg:px-18 2xl:px-24">
          <div className={aniTitle + " animate__animated text-[20px] lg:text-[30px] font-ethnocentric-rg text-white inline-block border-b border-[#FEBD32] leading-tight"}>
            {t('ecosystem.title')}
          </div>
        </div>
        <div className={aniImg + " animate__animated relative animate__delay-500"}>
          <div className="eco-img-box ">
            <div className="max-w-[860px] mx-auto relative">
              <img className="eco-img w-full block" src="/images/eco_illus.png" alt="" />
              
              <div className="font-univia-pro-bold absolute top-[60%] left-[10%] md:top-[60%] md:left-[15.5%] text-[#CCA6FF] text-[12px] md:text-[20px] 2xl:text-[24px] w-[20%] md:w-[10%] text-center">{t('ecosystem.user')}</div>
              <div className="font-univia-pro-bold absolute top-[64%] left-[60%] md:top-[63%] md:left-[67%] text-[#FEBD32] text-[12px] md:text-[20px] 2xl:text-[24px] w-[35%] md:w-[20%] text-center">{t('ecosystem.allApps')}</div>
              <div className="font-univia-pro-bold absolute top-[25%] left-[56%] md:top-[25%] md:left-[61.5%] text-[#FEBD32] text-[12px] md:text-[20px] 2xl:text-[24px] w-[35%] md:w-[20%] text-center">{t('ecosystem.sTokens')}</div>
              <div className="font-univia-pro-bold absolute top-[88%] left-[13%] md:top-[88%] md:left-[21%] text-[#FEBD32] text-[12px] md:text-[20px] 2xl:text-[24px] w-[35%] md:w-[20%] text-center">{t('ecosystem.aTokens')}</div>
            </div>
          </div>
        </div>
        <div className="eco-content-box px-5 lg:px-18 2xl:px-24">
          <div className={aniContent + " animate__animated mt-11 animate__delay-1000"}>
            <div className="font-univia-pro-bold text-[20px] lg:text-[28px] text-[#8D73FF]">{t('ecosystem.content')}</div>
          </div>
          <div className={aniDesc + " animate__animated mt-3 md:mt-11 animate__delay-1500"}>
            <div className="flex flex-wrap justify-between">
              <div className="w-full md:w-auto md:flex-1 text-[16px] text-[#DDD5FF] leading-[1.75]">{t('ecosystem.desc')}</div>
              <div className="w-full md:w-[280px] md:ml-30 text-right md:text-center mt-3 md:mt-0">
                <Button href="/explore" className="text-xl font-light text-white w-40 md:w-60 text-center py-3 md:py-4">
                  {t('ecosystem.exploreNow')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
