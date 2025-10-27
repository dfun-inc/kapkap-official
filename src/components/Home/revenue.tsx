'use client';

import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useEffect, useState } from 'react';

gsap.registerPlugin(ScrollTrigger)

export default function Revenue() {
  const t = useTranslations();
  const [aniTitle, setAniTitle] = useState<string>("opacity-0");
  const [aniItem, setAniItem] = useState<string>("opacity-0");

  useEffect(() => {
    const winW = window.innerWidth;
    let ctx:any = null;
    if(winW >= 768) {
      ScrollTrigger.create({
        trigger: ".revenue-section",
        start: "top 60%",
        once: true,
        onEnter: () => {
          setAniTitle("animate__fadeInUp");
          setAniItem("animate__fadeInUp");
        },
      }); 

      gsap.to('.revenue-content-box', {
        opacity: 0.2,
        y: -60,
        scrollTrigger: {
          trigger:".revenue-section",
          start: 'top+=50% top',
          end: 'top+=80% top',
          scrub: true,
        },
      })

      gsap.to('.revenue-title', {
        opacity: 0.2,
        y: -60,
        scrollTrigger: {
          trigger:".revenue-section",
          start: 'top-=10% top',
          end: 'top+=20% top',
          scrub: true,
        },
      })
    }
    else {
      setAniTitle("animate__fadeInUp");
      setAniItem("animate__fadeInLeft");
    }

    return () => ctx?.revert();
  }, [])

  return (
    <section className="revenue-section bg-[#121212] relative z-2">
      <div className="max-w-[1920px] mx-auto px-3 md:px-18 2xl:px-24 py-16">
        <div className="revenue-title">
          <div className={aniTitle + " animate__animated text-[20px] xl:text-[30px] font-ethnocentric-rg text-white inline-block border-b border-[#FEBD32] leading-tight"}>
            {t('revenue.title')}
          </div>
        </div>
        <div className="revenue-content-box md:mt-5">
          <div className={aniItem + " animate__animated animate__delay-500 flex flex-wrap items-stretch justify-center md:space-x-15 2xl:space-x-20"}>
            <div className="revenue-item aspect-[3/2] rounded-[20px] w-full md:w-[450px] mt-15">
              <div className="px-8 pt-[40%]">
                <div className="w-full text-[18px] text-[#8D73FF] text-center">{t('revenue.itemTitle1')}</div>
                <div className="w-full text-[16px] text-[#DDD5FF] mt-3 leading-[24px] text-center">{t('revenue.itemContent1')}</div>
              </div>
            </div>
            <div className="revenue-item aspect-[3/2] rounded-[20px] w-full md:w-[450px] mt-15">
              <div className="px-8 pt-[40%]">
                <div className="w-full text-[18px] text-[#8D73FF] text-center">{t('revenue.itemTitle2')}</div>
                <div className="w-full text-[16px] text-[#DDD5FF] mt-3 leading-[24px] text-center">{t('revenue.itemContent2')}</div>
              </div>
            </div>
            <div className="revenue-item aspect-[3/2] rounded-[20px] w-full md:w-[450px] mt-15">
              <div className="px-8 pt-[40%]">
                <div className="w-full text-[18px] text-[#8D73FF] text-center">{t('revenue.itemTitle3')}</div>
                <div className="w-full text-[16px] text-[#DDD5FF] mt-3 leading-[24px] text-center">{t('revenue.itemContent3')}</div>
              </div>
            </div>
            <div className="revenue-item aspect-[3/2] rounded-[20px] w-full md:w-[450px] mt-15">
              <div className="px-8 pt-[40%]">
                <div className="w-full text-[18px] text-[#8D73FF] text-center">{t('revenue.itemTitle4')}</div>
                <div className="w-full text-[16px] text-[#DDD5FF] mt-3 leading-[24px] text-center">{t('revenue.itemContent4')}</div>
              </div>
            </div>
            <div className="revenue-item aspect-[3/2] rounded-[20px] w-full md:w-[450px] mt-15">
              <div className="px-8 pt-[40%]">
                <div className="w-full text-[18px] text-[#8D73FF] text-center">{t('revenue.itemTitle5')}</div>
                <div className="w-full text-[16px] text-[#DDD5FF] mt-3 leading-[24px] text-center">{t('revenue.itemContent5')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
