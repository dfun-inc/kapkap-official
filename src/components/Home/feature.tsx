'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import BlindboxRulesModal from '../BlindboxRulesModal';

gsap.registerPlugin(ScrollTrigger)

export default function feature() {
  const t = useTranslations();
  const [aniClassLeft, setAniClassLeft] = useState<string>("opacity-0");
  const [aniClassRight, setAniClassRight] = useState<string>("opacity-0");
  const [aniTitle, setAniTitle] = useState<string>("opacity-0");
  const [aniBanner, setAniBanner] = useState<string>("opacity-0");

  const blindboxRulesRef = useRef<any>(null);

  const handleShowBlindboxRulesModal = () => {
    blindboxRulesRef.current.showModal();
  }

  useEffect(() => {
    const winW = window.innerWidth;
    let ctx:any = null;
    if(winW >= 768) {
      ScrollTrigger.create({
        trigger: ".feature-section",
        start: "top 60%",
        once: true,
        onEnter: () => {
          setAniClassLeft("animate__fadeInLeft");
          setAniClassRight("animate__fadeInRight");
          setAniTitle("animate__fadeInUp");
          setAniBanner("animate__fadeInUp");
        },
      }); 

      ctx = gsap.context(() => {
        gsap.to('.feature-title', {
          opacity: 0.2,
          y: -60,
          scrollTrigger: {
            trigger:".feature-section",
            start: 'top+=50% top',
            end: 'top+=80% top',
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        })

        gsap.to('.feature-item-top', {
          opacity: 0.2,
          y: -60,
          scrollTrigger: {
            trigger:".feature-section",
            start: 'top+=60% top',
            end: 'top+=90% top',
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        })
      });
    }
    else {
      setAniClassLeft("animate__fadeInLeft");
      setAniClassRight("animate__fadeInRight");
      setAniTitle("animate__fadeInUp");
      setAniBanner("animate__fadeInUp");
    }

    return () => ctx?.revert();
  }, [])

  return (
    <section id="home-section-1" className="home-section-1 feature-section bg-[#121212]">
      <div className="airdrop-box fixed z-[10] right-3 md:right-9 top-24 w-[100px] cursor-pointer" onClick={handleShowBlindboxRulesModal}>
        <img className="w-full" src="/images/icon_airdropAD.png" />
        <div className="absolute leading-none w-full bottom-1 left-0 text-center text-white text-[16px] pr-2">{t('blindbox.airdropRules')}</div>
      </div>
      <div className="max-w-[1920px] mx-auto px-5 lg:px-18 2xl:px-24 py-16">
        <div className={aniBanner + " animate__animated blind-box-banner-big rounded-[20px] overflow-hidden px-6 md:px-18 py-6 md:py-12"}>
          <div className="font-univia-pro-bold text-[20px] md:text-[60px] 2xl:text-[70px] leading-none">{t('blindbox.bannerTitle')}</div>
          <div className="text-[16px] md:text-[40px] 2xl:text-[50px] text-[#FEBD32] leading-none mt-6">{t('blindbox.bannerDesc')}</div>
          <div className="mt-4 text-[#DDD5FF] text-[18px]">
            <div className="flex items-start">
              <div className="w-[6px] h-[6px] bg-[#DDD5FF] rounded-full mr-3 mt-[10px]"></div>
              <div className="flex-1 shrink-0">{t('blindbox.bannerContent1')}</div>
            </div>
            <div className="flex items-start mt-2">
              <div className="w-[6px] h-[6px] bg-[#DDD5FF] rounded-full mr-3 mt-[10px]"></div>
              <div className="flex-1 shrink-0">{t('blindbox.bannerContent2')}</div>
            </div>
            <div className="flex items-start mt-2">
              <div className="w-[6px] h-[6px] bg-[#DDD5FF] rounded-full mr-3 mt-[10px]"></div>
              <div className="flex-1 shrink-0">{t('blindbox.bannerContent2')}</div>
            </div>
          </div>
          <div className="mt-9 flex justify-between md:justify-center">
            <Link href="/mysteryBox" className="btn-common w-[160px] md:w-[260px] cursor-pointer relative rounded-lg overflow-hidden pb-1 inline-block md:mr-15">
              <div className="btn-common-box py-2 md:py-4 text-[20px] md:text-[30px] text-center rounded-lg z-1 transition-all duration-200 bg-[#8FC31F] relative z-1">
                {t('blindbox.joinNow')}
              </div>
              <div className="absolute bottom-0 left-0 w-full h-2 z-0 bg-[#638C0B]"></div>
            </Link>
            <Button className="w-[160px] md:w-[260px] py-2 md:py-4 text-[20px] md:text-[30px]" onClick={handleShowBlindboxRulesModal}>
              {t('blindbox.airdropRules')}
            </Button>
          </div>
        </div>
        <div className={aniTitle + " animate__animated text-[20px] xl:text-[30px] font-ethnocentric-rg text-white leading-tight mt-18"}>
          <div className="feature-title mx-auto inline-block border-b border-[#FEBD32]">{t('feature.title')}</div>
        </div>
        <div className="flex flex-wrap items-center justify-between mt-12 feature-item-top">
          <div className={aniClassLeft + " animate__animated animate__delay-500 w-full md:w-3/5 md:max-w-[820px] md:w-2/3"}>
            <div className="text-[18px] xl:text-[24px] text-[#8D73FF]">{t('feature.subTitle')}</div>
            <div className=" text-[#DDD5FF] mt-10 leading-[30px]">{t('feature.desc1')}</div>
            <div className=" text-[#DDD5FF] leading-[30px]">{t('feature.desc2')}</div>
            <div className=" text-[#DDD5FF] leading-[30px]">{t('feature.desc3')}</div>
          </div>
          <div className={aniClassRight + " animate__animated animate__delay-500 mt-12 md:mt-0 md:flex-1 w-full md:w-auto relative"}>
            <div className="relative w-3/5 max-w-[376px] mx-auto">
              <img className="w-full" src="./images/feature_illus.png" alt="" />
              <div className="absolute -top-7 xl:-top-8 left-1/2 -translate-x-1/2 text-[18px] xl:text-[24px] text-white font-univia-pro-bold">{t('feature.user')}</div>
              <div className="absolute top-2/5 right-3/4 text-[18px] xl:text-[24px] text-[#FEBD32] font-univia-pro-bold whitespace-nowrap">{t('feature.valueRewards')}</div>
              <div className="absolute top-2/5 left-3/4 text-[18px] xl:text-[24px] text-[#FEBD32] font-univia-pro-bold whitespace-nowrap">{t('feature.attention')}</div>
            </div>
          </div>
        </div>
      </div>
      <BlindboxRulesModal ref={blindboxRulesRef} />
    </section>
  );
}
