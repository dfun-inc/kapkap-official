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
        },
      }); 

      gsap.to('.eco-img-box', {
        opacity: 0.2,
        y: -60,
        scrollTrigger: {
          trigger:".eco-section",
          start: 'top+=200 top',
          end: 'top+=400 top',
          scrub: true,
        },
      })

      gsap.to('.eco-title', {
        opacity: 0.2,
        y: -60,
        scrollTrigger: {
          trigger:".eco-section",
          start: 'top+=400 top',
          end: 'top+=600 top',
          scrub: true,
        },
      })

      gsap.to('.eco-content-box', {
        opacity: 0.2,
        y: -60,
        scrollTrigger: {
          trigger:".eco-section",
          start: 'top+=500 top',
          end: 'top+=700 top',
          scrub: true,
        },
      })
    }
    else {
      setAniImg("animate__fadeInUp");
      setAniTitle("animate__fadeInUp");
      setAniContent("animate__fadeInUp");
    }

    return () => ctx?.revert();
  }, [])

  return (
    <section className="eco-section bg-[#121212]">
      <div className="max-w-[1920px] mx-auto px-5 lg:px-18 2xl:px-24 py-16">
        <div className={aniImg + " animate__animated relative"}>
          <div className="eco-img-box">
            <img className="eco-img w-full hidden md:block" src="/images/eco_illus.jpg" alt="" />
            <img className="w-full md:hidden" src="/images/eco_illus_m.jpg" alt="" />
            
            <div className="font-univia-pro-bold absolute top-[22%] left-[6.5%] md:top-[59%] md:left-[4.75%] text-[#CCA6FF] text-[14px] md:text-[20px] 2xl:text-[24px] w-[15%] md:w-[10%] text-center">{t('ecosystem.user')}</div>
            <div className="absolute top-[16.5%] left-[21.5%] md:top-[52%] md:left-[10%] text-[#4DE4FF] text-[14px] md:text-[20px] 2xl:text-[24px] w-[120px] md:w-[22%] text-center leading-[1.05]" dangerouslySetInnerHTML={{ __html: t('ecosystem.playForce') }}></div>
            <div className="absolute top-[26%] left-[5%] md:top-[75.5%] md:left-[6%] text-[#4DE4FF] text-[14px] md:text-[20px] 2xl:text-[24px] w-[120px] md:w-[22%] text-center leading-[1.05]" dangerouslySetInnerHTML={{ __html: t('ecosystem.obtainApp') }}></div>
            <div className="absolute top-[16.5%] left-[51%] md:top-[26%] md:left-[14%] text-[#CCA6FF] text-[14px] md:text-[20px] 2xl:text-[24px] w-[180px] md:w-[22%] md:text-right leading-[1.05]" dangerouslySetInnerHTML={{ __html: t('ecosystem.dictribute') }}></div>
            <div className="font-univia-pro-bold absolute top-[42%] left-[35%] md:top-[90%] md:left-[29.3%] text-[#FEBD32] text-[14px] md:text-[20px] 2xl:text-[24px] w-[160px] md:w-[15%] text-center">{t('ecosystem.allApps')}</div>
            <div className="absolute top-[40%] left-[81%] md:top-[10%] md:left-[48.5%] text-[#CCA6FF] text-[14px] md:text-[20px] 2xl:text-[24px] w-[60px] md:w-[10%] text-center">{t('ecosystem.online')}</div>
            <div className="absolute top-[46.5%] left-[10%] md:top-[58%] md:left-[44.5%] text-[#CCA6FF] text-[14px] md:text-[20px] 2xl:text-[24px] w-[150px] md:w-[18%] text-right md:text-center">{t('ecosystem.increaseAttention')}</div>
            <div className="font-univia-pro-bold absolute top-[61%] left-[67%] md:top-[27%] md:left-[59%] text-[#FEBD32] text-[14px] md:text-[20px] 2xl:text-[24px] w-[110px] md:w-[12%] text-center">{t('ecosystem.kapkapCoin')}</div>
            <div className="font-univia-pro-bold absolute top-[61%] left-[32%] md:top-[75%] md:left-[58.5%] text-[#FEBD32] text-[14px] md:text-[20px] 2xl:text-[24px] w-[130px] md:w-[13%] text-center">{t('ecosystem.attentionPoints')}</div>
            <div className="absolute top-[76%] left-[73%] md:top-[15%] md:left-[70%] text-[#CCA6FF] text-[14px] md:text-[20px] 2xl:text-[24px] w-[110px] md:w-[13%] text-center">{t('ecosystem.injectliquidity')}</div>
            <div className="absolute top-[67%] left-[2%] md:top-[68%] md:left-[71%] text-[#CCA6FF] text-[14px] md:text-[20px] 2xl:text-[24px] w-[180px] md:w-[20%] text-right md:text-center" dangerouslySetInnerHTML={{ __html: t('ecosystem.fullFilled') }}></div>
            <div className="font-univia-pro-bold absolute top-[88%] left-[28%] md:top-[55%] md:left-[76%] text-[#FEBD32] text-[14px] md:text-[20px] 2xl:text-[24px] w-[50%] md:w-[20%] text-center">{t('ecosystem.allTokens')}</div>
          </div>
        </div>
        <div className={aniTitle + " animate__animated mt-11"}>
          <div className="eco-title font-univia-pro-bold text-[24px] md:text-[40px] xl:text-[60px] text-[#8D73FF]">{t('ecosystem.title')}</div>
        </div>
        <div className={aniContent + " animate__animated mt-3 md:mt-11"}>
          <div className="eco-content-box flex flex-wrap justify-between">
            <div className="w-full md:w-auto md:flex-1 text-[18px] md:text-[20px] xl:text-[24px] text-[#D5D5D5]">{t('ecosystem.content')}</div>
            <div className="w-full md:w-[280px] md:ml-30 text-right md:text-center mt-3 md:mt-0">
              <Button href="/explore" className="text-xl font-light text-white w-40 md:w-60 text-center py-3 md:py-4">
                {t('ecosystem.exploreNow')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
