'use client';

import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useEffect, useState } from 'react';
import { CountUp } from 'countup.js';

gsap.registerPlugin(ScrollTrigger)

export default function SocialData() {
  const t = useTranslations();
  const [aniTitle, setAniTitle] = useState<string>("opacity-0");
  const [aniItem, setAniItem] = useState<string>("opacity-0");
  const [aniBottom, setAniBottom] = useState<string>("opacity-0");

  useEffect(() => {
    const winW = window.innerWidth;
    let ctx:any = null;
    if(winW >= 768) {
      ScrollTrigger.create({
        trigger: ".social-data-section",
        start: "top 60%",
        once: true,
        onEnter: () => {
          setAniTitle("animate__fadeInUp");
          setAniItem("animate__fadeInUp");
          setAniBottom("animate__fadeInUp");
      
          setTimeout(() => {
            const mauNum = new CountUp('mau-num', 1.7);
            mauNum.start();
            const dauNum = new CountUp('dau-num', 25);
            dauNum.start();
            const userNum = new CountUp('user-num', 3);
            userNum.start();
            const cmNum = new CountUp('cm-num', 185);
            cmNum.start();
            const csNum = new CountUp('cs-num', 572);
            csNum.start();
            const tfNum = new CountUp('tf-num', 130);
            tfNum.start();
          }, 1000);
        },
      }); 

      gsap.to('.social-data-item-box', {
        opacity: 0.2,
        y: -60,
        scrollTrigger: {
          trigger:".social-data-section",
          start: 'top+=40% top',
          end: 'top+=60% top',
          scrub: true,
        },
      })

      gsap.to('.social-data-title', {
        opacity: 0.2,
        y: -60,
        scrollTrigger: {
          trigger:".social-data-section",
          start: 'top-=10% top',
          end: 'top+=20% top',
          scrub: true,
        },
      })

      gsap.to('.social-data-bottom-box', {
        opacity: 0.2,
        y: -60,
        scrollTrigger: {
          trigger:".social-data-section",
          start: 'top+=60% top',
          end: 'top+=80% top',
          scrub: true,
        },
      })
    }
    else {
      setAniTitle("animate__fadeInUp");
      setAniItem("animate__fadeInUp");
      setAniBottom("animate__fadeInUp");
      
      setTimeout(() => {
        const mauNum = new CountUp('mau-num', 1.7);
        mauNum.start();
        const dauNum = new CountUp('dau-num', 25);
        dauNum.start();
        const userNum = new CountUp('user-num', 3);
        userNum.start();
        const cmNum = new CountUp('cm-num', 185);
        cmNum.start();
        const csNum = new CountUp('cs-num', 572);
        csNum.start();
        const tfNum = new CountUp('tf-num', 130);
        tfNum.start();
      }, 1000);
    }

    return () => ctx?.revert();
  }, [])

  return (
    <section className="social-data-section bg-[#121212] relative z-1">
      <div className="social-data-section-container max-w-[1920px] mx-auto px-3 md:px-18 2xl:px-24 pt-32 pb-16">
        <div className="social-data-title">
          <div className={aniTitle + " animate__animated text-[20px] xl:text-[30px] font-ethnocentric-rg text-white inline-block border-b border-[#FEBD32] leading-tight"}>
            {t('model.title')}
          </div>
        </div>
        <div className="social-data-item-box md:px-5">
          <div className={aniItem + " animate__animated animate__delay-500"}>
            <div className="flex flex-wrap justify-between items-stretch leading-none">
              <div className="w-full md:w-2/5 xl:w-2/7 mt-12 md:mt-20 bg-[#0b0916] rounded-[20px] relative overflow-hidden">
                <div className="text-[24px] text-[#FEBD32] text-center pt-4 pb-3 leading-none bg-[#1a1630] relative z-2">{t('socialData.mau')}</div>
                <div className="flex items-end justify-center text-white font-univia-pro-bold py-12 relative z-2">
                  <div id="mau-num" className="text-[60px]"></div>
                  <div className="text-[30px] ml-2 pb-1">M+</div>
                </div>
                <div className="bg-box absolute block z-1 select-none w-[200%] aspect-square top-1/3 left-1/2 -translate-x-1/2"></div>
              </div>
              <div className="w-full md:w-2/5 xl:w-2/7 mt-12 md:mt-20 bg-[#0b0916] rounded-[20px] relative overflow-hidden">
                <div className="text-[24px] text-[#FEBD32] text-center pt-4 pb-3 leading-none bg-[#1a1630] relative z-2">{t('socialData.dau')}</div>
                <div className="flex items-end justify-center text-white font-univia-pro-bold py-12 relative z-2">
                  <div id="dau-num" className="text-[60px]"></div>
                  <div className="text-[30px] ml-2 pb-1">K+</div>
                </div>
                <div className="bg-box absolute block z-1 select-none w-[200%] aspect-square top-1/3 left-1/2 -translate-x-1/2"></div>
              </div>
              <div className="w-full md:w-2/5 xl:w-2/7 mt-12 md:mt-20 bg-[#0b0916] rounded-[20px] relative overflow-hidden">
                <div className="text-[24px] text-[#FEBD32] text-center pt-4 pb-3 leading-none bg-[#1a1630] relative z-2">{t('socialData.user')}</div>
                <div className="flex items-end justify-center text-white font-univia-pro-bold py-12 relative z-2">
                  <div id="user-num" className="text-[60px]"></div>
                  <div className="text-[30px] ml-2 pb-1">M+</div>
                </div>
                <div className="bg-box absolute block z-1 select-none w-[200%] aspect-square top-1/3 left-1/2 -translate-x-1/2"></div>
              </div>
              <div className="w-full md:w-2/5 xl:w-2/7 mt-12 md:mt-20 bg-[#0b0916] rounded-[20px] relative overflow-hidden">
                <div className="text-[24px] text-[#FEBD32] text-center pt-4 pb-3 leading-none bg-[#1a1630] relative z-2">{t('socialData.communityMembers')}</div>
                <div className="flex items-end justify-center text-white font-univia-pro-bold py-12 relative z-2">
                  <div id="cm-num" className="text-[60px]"></div>
                  <div className="text-[30px] ml-2 pb-1">K</div>
                </div>
                <div className="bg-box absolute block z-1 select-none w-[200%] aspect-square top-1/3 left-1/2 -translate-x-1/2"></div>
              </div>
              <div className="w-full md:w-2/5 xl:w-2/7 mt-12 md:mt-20 bg-[#0b0916] rounded-[20px] relative overflow-hidden">
                <div className="text-[24px] text-[#FEBD32] text-center pt-4 pb-3 leading-none bg-[#1a1630] relative z-2">{t('socialData.channelSubscribers')}</div>
                <div className="flex items-end justify-center text-white font-univia-pro-bold py-12 relative z-2">
                  <div id="cs-num" className="text-[60px]"></div>
                  <div className="text-[30px] ml-2 pb-1">K</div>
                </div>
                <div className="bg-box absolute block z-1 select-none w-[200%] aspect-square top-1/3 left-1/2 -translate-x-1/2"></div>
              </div>
              <div className="w-full md:w-2/5 xl:w-2/7 mt-12 md:mt-20 bg-[#0b0916] rounded-[20px] relative overflow-hidden">
                <div className="text-[24px] text-[#FEBD32] text-center pt-4 pb-3 leading-none bg-[#1a1630] relative z-2">{t('socialData.twitterFollowers')}</div>
                <div className="flex items-end justify-center text-white font-univia-pro-bold py-12 relative z-2">
                  <div id="tf-num" className="text-[60px]"></div>
                  <div className="text-[30px] ml-2 pb-1">K</div>
                </div>
                <div className="bg-box absolute block z-1 select-none w-[200%] aspect-square top-1/3 left-1/2 -translate-x-1/2"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 social-data-bottom-box mx-auto">
          <div className={aniBottom + " animate__animated animate__delay-1000"}>
            <div className="text-white">{t('socialData.bottomText1')}</div>
            <div className="text-[#CFC4FF]"><span className="text-[#8D73FF]">{t('socialData.bottomItem1Name')}</span>{t('socialData.bottomItem1Content')}</div>
            <div className="text-[#CFC4FF]"><span className="text-[#8D73FF]">{t('socialData.bottomItem2Name')}</span>{t('socialData.bottomItem2Content')}</div>
            <div className="text-[#CFC4FF]">{t('socialData.bottomText2')}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
