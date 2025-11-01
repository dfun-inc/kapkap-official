'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect } from 'react';
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Main() {
  const t = useTranslations();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.main-logo', {
        opacity: 0.2,
        y: -50,
        scrollTrigger: {
          trigger:".main-section",
          start: '5% top',
          end: '35% top',
          scrub: 0.5,              // 稍微延迟跟随
          invalidateOnRefresh: true,
        },
      })

      gsap.to('.title-text-bottom', {
        opacity: 0.2,
        y: -50,
        scrollTrigger: {
          trigger:".main-section",
          start: '10% top',
          end: '40% top',
          scrub: 0.5,              // 稍微延迟跟随
          invalidateOnRefresh: true,
        },
      })

      gsap.to('.main-desc', {
        opacity: 0.2,
        y: -50,
        scrollTrigger: {
          trigger:".main-section",
          start: '30% top',
          end: '60% top',
          scrub: 0.5,              // 稍微延迟跟随
          invalidateOnRefresh: true,
        },
      })
    });

    return () => ctx?.revert();
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
              <div className="main-logo hidden md:block">
                <svg version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  x="0px"
                  y="0px"
                  viewBox="73 89 355 43"
                  width="568"
                  height="68"
                  xmlSpace="preserve"
                >
                  <style type="text/css">{`
                    .st0 { fill-rule:evenodd; clip-rule:evenodd; fill:#FEBD32; }
                    .st1 { fill:#FFFFFF; }
                    .st2 { fill-rule:evenodd; clip-rule:evenodd; fill:#FFFFFF; }
                  `}</style>
                  <g>
                    <rect x="73" y="91" className="st0" width="12" height="40" />
                    <polygon className="st0" points="106,91 123,91 103,111 123,131 106,131 86,111" />
                    <rect x="253" y="91" className="st0" width="12" height="40" />
                    <polygon className="st0" points="286,91 303,91 283,111 303,131 286,131 266,111" />
                    <path
                      className="st1"
                      d="M230,91h-29l-6,10h35c4,0,6,2,6,5s-2,5-6,5h-35v20h12v-10h23c13,0,18-8,18-15S243,91,230,91z"
                    />
                    <path
                      className="st1"
                      d="M410,91h-29l-6,10h35c4,0,6,2,6,5s-2,5-6,5h-35v20h12v-10h23c13,0,18-8,18-15S423,91,410,91z"
                    />
                    <polygon className="st2" points="356,131 339,110 322,131 305,131 339,89 373,131" />
                    <polygon className="st2" points="159,110 142,131 125,131 159,89 193,131 176,131" />
                  </g>
                </svg>
              </div>
              <div className="main-logo block md:hidden">
                <svg version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  x="0px"
                  y="0px"
                  viewBox="73 89 355 43"
                  width="284"
                  height="34"
                  xmlSpace="preserve"
                >
                  <style type="text/css">{`
                    .st0 { fill-rule:evenodd; clip-rule:evenodd; fill:#FEBD32; }
                    .st1 { fill:#FFFFFF; }
                    .st2 { fill-rule:evenodd; clip-rule:evenodd; fill:#FFFFFF; }
                  `}</style>
                  <g>
                    <rect x="73" y="91" className="st0" width="12" height="40" />
                    <polygon className="st0" points="106,91 123,91 103,111 123,131 106,131 86,111" />
                    <rect x="253" y="91" className="st0" width="12" height="40" />
                    <polygon className="st0" points="286,91 303,91 283,111 303,131 286,131 266,111" />
                    <path
                      className="st1"
                      d="M230,91h-29l-6,10h35c4,0,6,2,6,5s-2,5-6,5h-35v20h12v-10h23c13,0,18-8,18-15S243,91,230,91z"
                    />
                    <path
                      className="st1"
                      d="M410,91h-29l-6,10h35c4,0,6,2,6,5s-2,5-6,5h-35v20h12v-10h23c13,0,18-8,18-15S423,91,410,91z"
                    />
                    <polygon className="st2" points="356,131 339,110 322,131 305,131 339,89 373,131" />
                    <polygon className="st2" points="159,110 142,131 125,131 159,89 193,131 176,131" />
                  </g>
                </svg>
              </div>
              <div className="title-text-bottom mt-7">
                <span className="inline-block animate__animated animate__fadeInUp text-[#8A84A3] text-[16px] md:text-[18px]">{t('main.desc')}</span>
              </div>
            </div>
          </div>
          <div className="main-desc pb-[10vh] md:pb-[16vh] flex">
            <div className="animate__animated animate__fadeInUp w-full md:w-auto">
              <div className="w-full flex flex-wrap items-center space-x-6 justify-start mt-6">
                <div className="w-full md:w-auto">
                  <div className="text-[#8A84A3] text-[12px] uppercase">{t('main.partners')}</div>
                  <div className="flex items-center space-x-5 md:space-x-6 mt-2">
                    <img className="w-auto h-[26px]" src="/images/investors/par_BAYC.png" alt="" />
                    <img className="w-auto h-[34px]" src="/images/investors/par_ApeCoin.png" alt="" />
                    <img className="w-auto h-[23px]" src="/images/investors/par_DAOMaker.png" alt="" />
                  </div>
                </div>
                <div className="w-full md:w-auto ml-0 md:ml-4 mt-6 md:mt-0">
                  <div className="text-[#8A84A3] text-[12px] uppercase">{t('main.kol')}</div>
                  <div className="text-[#8A84A3] text-[16px] mt-3">Beanie</div>
                </div>
              </div>
              <div className="mt-6 md:mt-4">
                <div className="text-[#8A84A3] text-[12px] uppercase">{t('main.investors')}</div>
                <div className="flex flex-wrap lg:flex-no-wrap items-center space-x-5 space-y-3 lg:space-y-0 lg:space-x-8 justify-start mt-2">
                  <img className="w-auto h-[19px]" src="/images/investors/inv_ShiMa.png" alt="" />
                  <img className="w-auto h-[33px]" src="/images/investors/inv_Animoca.png" alt="" />
                  <img className="w-auto h-[32px]" src="/images/investors/inv_Mechanism.png" alt="" />
                  <img className="w-auto h-[34px]" src="/images/investors/inv_BigBrain.png" alt="" />
                  <img className="w-auto h-[22px]" src="/images/investors/inv_Klaytn.png" alt="" />
                  <img className="w-auto h-[31px]" src="/images/investors/inv_UnicornVerse.png" alt="" />
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
