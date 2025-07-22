'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger)

export default function Roadmap() {
  const t = useTranslations();
  const [aniTitleClass, setAniTitleClass] = useState<string>("opacity-0");
  const [aniItemClass, setAniItemClass] = useState<string>("opacity-0");

  useEffect(() => {
    const winW = window.innerWidth;
    if (winW < 768) {
      setAniTitleClass(_c => '')
      setAniItemClass(_c => '')
    }
    else {
      ScrollTrigger.create({
        trigger: ".roadmap-section",
        start: "top 60%",
        once: true,
        onEnter: () => {
          setAniTitleClass(_c => 'animate__fadeInUp')
          setAniItemClass(_c => 'animate__fadeInRight')
        },
      }); 

      gsap.to('.roadmap-title', {
        opacity: 0.2,
        y: -60,
        scrollTrigger: {
          trigger:".roadmap-section",
          start: 'top-=100 top',
          end: 'top+=100 top',
          scrub: true,
        },
      })

      gsap.to('.roadmap-list', {
        opacity: 0.2,
        y: -60,
        scrollTrigger: {
          trigger:".roadmap-section",
          start: 'toptop top',
          end: 'top+=300 top',
          scrub: true,
        },
      })
    }
  }, []);
  
  return (
    <section id="home-section-3" className="roadmap-section home-section-3 bg-[##060608] relative">
      <div className="max-w-[1920px] mx-auto px-5 lg:px-18 2xl:px-24 pt-6 pb-12">
        <div className={aniTitleClass + " animate__animated text-[20px] lg:text-[40px] font-ethnocentric-rg text-white leading-tight"}>
          <div className="roadmap-title mx-auto inline-block border-b border-[#FEBD32]">{t('roadmap.title')}</div>
        </div>
        <div className="roadmap-list mt-15 text-lg">
          <div className="relative text-[#DDD5FF]">
            <div className="absolute top-0 left-[9px] w-[2px] h-full bg-[#8D73FF] z-0"></div>
            <div className="flex items-start relative z-1">
              <div className="border-[2px] border-[#8D73FF] bg-[#312a4d] rounded-full w-5 h-5 flex items-center justify-center">
                <div className="w-[10px] h-[10px] bg-[#ffbd2f] rounded-full"></div>
              </div>
              <div className={aniItemClass + " animate__animated animate__delay-250 ml-2 md:ml-4 leading-none flex-1"}>{t('roadmap.step1')}</div>
            </div>
            <div className="flex items-start relative z-1 mt-6">
              <div className="border-[2px] border-[#8D73FF] bg-[#312a4d] rounded-full w-5 h-5 flex items-center justify-center">
                <div className="w-[10px] h-[10px] bg-[#ffbd2f] rounded-full"></div>
              </div>
              <div className={aniItemClass + " animate__animated animate__delay-500 ml-2 md:ml-4 leading-none flex-1"}>{t('roadmap.step2')}</div>
            </div>
            <div className="flex items-start relative z-1 mt-6 pb-6">
              <div className="border-[2px] border-[#8D73FF] bg-[#312a4d] rounded-full w-5 h-5 flex items-center justify-center">
                <div className="w-[10px] h-[10px] bg-[#ffbd2f] rounded-full"></div>
              </div>
              <div className={aniItemClass + " animate__animated animate__delay-750 ml-2 md:ml-4 leading-none flex-1"}>{t('roadmap.step3')}</div>
            </div>
            <div className="flex items-start relative z-1 text-[#DDD5FF] mt-6 pb-6">
              <div className="border-[2px] border-[#8D73FF] bg-[#312a4d] rounded-full w-5 h-5 flex items-center justify-center">
                <div className="w-[10px] h-[10px] bg-[#ffbd2f] rounded-full"></div>
              </div>
              <div className={aniItemClass + " animate__animated animate__delay-1000 ml-2 md:ml-4 leading-none flex-1"}>{t('roadmap.step4')}</div>
            </div>
          </div>
          <div className="relative text-[#DDD5FF]">
            <div className="flex items-start relative z-1 text-[#8A84A3]">
              <div className="border-[2px] border-[#8D73FF] bg-[#312a4d] rounded-full w-5 h-5 flex items-center justify-center">
                <div className="w-[10px] h-[10px] bg-[#ffbd2f] rounded-full"></div>
              </div>
              <div className={aniItemClass + " animate__animated animate__delay-1250 ml-2 md:ml-4 leading-none flex-1"}>{t('roadmap.step5')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
