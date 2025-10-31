'use client';

import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useEffect, useState } from 'react';

gsap.registerPlugin(ScrollTrigger)

export default function IP() {
  const t = useTranslations();
  const [aniTitle, setAniTitle] = useState<string>("opacity-0");

  useEffect(() => {
    const winW = window.innerWidth;
    let ctx:any = null;
    if(winW >= 768) {
      ScrollTrigger.create({
        trigger: ".ip-section",
        start: "top 60%",
        once: true,
        onEnter: () => {
          setAniTitle("animate__fadeInUp");
        },
      }); 
      
      gsap.to('.ip-title', {
        opacity: 0.2,
        y: -50,
        scrollTrigger: {
          trigger:".ip-section",
          start: 'top-=10% top',
          end: 'top+=20% top',
          scrub: true,
        },
      })
    }
    else {
      setAniTitle("animate__fadeInUp");
    }

    return () => ctx?.revert();
  }, [])

  return (
    <section className="ip-section bg-[#121212] relative z-2">
      <div className="max-w-[1920px] mx-auto relative">
        <div className="absolute bottom-0 left-0 w-1/3">
          <div className="w-full h-[44px] lg:h-[55px] bg-[#121212]"></div>
          <div className="absolute z-1 top-0 left-full w-0 h-0 border-t-0 border-l-0 border-b-[#121212] border-r-transparent border-b-[44px] border-r-[60px] lg:border-b-[55px] lg:border-r-[75px]"></div>
        </div>
        <div className="absolute top-0 right-0 w-1/2">
          <div className="w-full h-[44px] lg:h-[55px] bg-[#121212]"></div>
          <div className="absolute z-1 top-0 right-full w-0 h-0 border-b-0 border-r-0 border-t-[#121212] border-l-transparent border-t-[44px] border-l-[60px] lg:border-t-[55px] lg:border-l-[75px]"></div>
        </div>
        <div className="ip-title absolute top-2 md:top-12 left-3 md:left-18 z-1">
          <div className={aniTitle + " animate__animated text-[20px] xl:text-[30px] font-ethnocentric-rg text-white inline-block border-b border-[#FEBD32] leading-tight"}>
            {t('ip.title')}
          </div>
        </div>
        <img className="w-full block select-none" src="/images/image_IPcharacters.jpg" />
      </div>
    </section>
  );
}
