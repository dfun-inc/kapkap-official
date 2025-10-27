'use client';

import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

gsap.registerPlugin(ScrollTrigger)

export default function Bottom() {
  const t = useTranslations();
  const [aniClass, setAniClass] = useState('opacity-0');

  useEffect(() => {
    const winW = window.innerWidth;
    if(winW >= 768) {
      ScrollTrigger.create({
        trigger: ".bottom-section",
        start: "top 90%",
        once: true,
        onEnter: () => {
          setAniClass('animate__fadeInUp');
        },
      }); 
    }
    else {
      setAniClass(_c => '')
    }
  }, [])

  return (
    <>
    <div className="relative w-full z-2">
      <div className="absolute bottom-0 left-0 w-3/5">
        <div className="w-full h-[44px] lg:h-[55px] bg-[#121212]"></div>
        <div className="absolute z-1 top-0 left-full w-0 h-0 border-t-0 border-l-0 border-b-[#121212] border-r-transparent border-b-[44px] border-r-[60px] lg:border-b-[55px] lg:border-r-[75px]"></div>
      </div>
      {/*
      <div className="absolute top-0 right-0 w-1/2">
        <div className="w-full h-[22px] lg:h-[33px] bg-[#121212]"></div>
        <div className="absolute z-1 top-0 right-full w-0 h-0 border-b-0 border-r-0 border-t-[#121212] border-l-transparent border-t-[22px] border-l-[30px] lg:border-t-[33px] lg:border-l-[40px]"></div>
      </div>
      */}
    </div>
    <section id="home-section-6" className="bottom-section home-section-6 bg-[#121212] relative z-1">
      <div className="max-w-[1920px] mx-auto px-3 md:px-18 2xl:px-24 pt-25 pb-9">
        <div className={aniClass + " animate__animated animate__delay-500 flex flex-wrap items-center justify-end"}>
          <div className="w-full lg:w-auto flex justify-center lg:justify-end order-1 md:order-2">
            <a className="block opacity-70 hover:opacity-100 mx-2 md:mx-5 mb-2" href="https://x.com/Kapkap_Hub" target="_blank">
              <img loading="lazy" className="w-11 md:w-12" src="/images/social/x.png" alt="x" />
            </a>
            <a className="block opacity-70 hover:opacity-100 mx-2 md:mx-5 mb-2" href="https://t.me/Kapkap_Hub" target="_blank">
              <img loading="lazy" className="w-11 md:w-12" src="/images/social/tg.png" alt="tg" />
            </a>
            <a className="block opacity-70 hover:opacity-100 mx-2 md:mx-5 mb-2" href="https://t.me/KapkapHub_ann" target="_blank">
              <img loading="lazy" className="w-11 md:w-12" src="/images/social/tg.png" alt="tg" />
            </a>
            <a className="block opacity-70 hover:opacity-100 mx-2 md:mx-5 mb-2" href="https://www.youtube.com/@KapKap_Hub" target="_blank">
              <img loading="lazy" className="w-11 md:w-12" src="/images/social/youtube.png" alt="youtube" />
            </a>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
