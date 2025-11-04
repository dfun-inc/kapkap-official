'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Button from '@/components/ui/Button';

gsap.registerPlugin(ScrollTrigger)

export default function Ecosystem() {
  const t = useTranslations();
  const [aniTitle, setAniTitle] = useState<string>("opacity-0");
  const [aniDesc, setAniDesc] = useState<string>("opacity-0");
  const [aniItem1, setAniItem1] = useState<string>("opacity-0");
  const [aniItem2, setAniItem2] = useState<string>("opacity-0");

  useEffect(() => {
    const winW = window.innerWidth;
    let ctx:any = null;
    if(winW >= 768) {
      ScrollTrigger.create({
        trigger: ".eco-section",
        start: "top 60%",
        once: true,
        onEnter: () => {
          setAniTitle("animate__fadeInUp");
          setAniDesc("animate__fadeInUp");
          setAniItem1("animate__fadeInLeft");
          setAniItem2("animate__fadeInRight");
        },
      }); 

      ctx = gsap.context(() => {
        gsap.to('.eco-desc-box', {
          opacity: 0.2,
          y: -60,
          scrollTrigger: {
            trigger:".eco-section",
            start: 'top+=20% top',
            end: 'top+=50% top',
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        })

        gsap.to('.eco-title', {
          opacity: 0.2,
          y: -60,
          scrollTrigger: {
            trigger:".eco-section",
            start: 'top-=10% top',
            end: 'top+=20% top',
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        })

        gsap.to('.eco-item-box', {
          opacity: 0.2,
          y: -60,
          scrollTrigger: {
            trigger:".eco-section",
            start: 'top+=50% top',
            end: 'top+=70% top',
            scrub: 0.5,
            invalidateOnRefresh: true,
          }
        });
      })
    }
    else {
      setAniTitle("animate__fadeInUp");
      setAniDesc("animate__fadeInUp");
      setAniItem1("animate__fadeInLeft");
      setAniItem2("animate__fadeInRight");
    }

    return () => ctx?.revert();
  }, [])

  return (
    <section className="eco-section bg-[#121212]">
      <div className="eco-container max-w-[1920px] mx-auto pt-16 pb-48 px-5 lg:px-18 2xl:px-24">
        <div className="eco-title">
          <div className={aniTitle + " animate__animated text-[20px] xl:text-[30px] font-ethnocentric-rg text-white inline-block border-b border-[#FEBD32] leading-tight"}>
            {t('ecosystem.title')}
          </div>
        </div>
        <div className={aniDesc + " animate__animated relative animate__delay-500 mt-12"}>
          <div className="desc-desc-box">
            <div className="text-[#8D73FF] text-[22px]">{t('ecosystem.para1Title')}</div>
            <div className="text-[#CFC4FF]  md:text-[20px] mt-3">{t('ecosystem.para1Content')}</div>

            <div className="text-[#FEBD32] text-[22px] mt-15">{t('ecosystem.para2Title')}</div>
            <div className="text-[#FFDB8D]  md:text-[20px] mt-3">{t('ecosystem.para2Content')}</div>
          </div>
        </div>
        <div className="eco-item-box flex flex-wrap md:flex-nowrap md:space-x-[20px] mt-12">
          <div className={aniItem1 + " animate__animated animate__delay-1000 w-full md:w-1/2 bg-black/50 rounded-[20px] px-10 py-4"}>
            <div className="text-[#8D73FF] text-[22px]">{t('ecosystem.step1Content')}</div>
            <div className="flex space-x-2  mt-3">
              <div className="w-1 h-1 rounded-full bg-[#FEBD32] mt-2"></div>
              <div className="flex-1">
                <span className="text-[#8D73FF] mr-1">{t('ecosystem.step1Title1')}</span>{t('ecosystem.step1Desc1')}
              </div>
            </div>
            <div className="flex space-x-2 ">
              <div className="w-1 h-1 rounded-full bg-[#FEBD32] mt-2"></div>
              <div className="flex-1">
                <span className="text-[#8D73FF] mr-1">{t('ecosystem.step1Title2')}</span>{t('ecosystem.step1Desc2')}
              </div>
            </div>
            <div className="flex space-x-2 ">
              <div className="w-1 h-1 rounded-full bg-[#FEBD32] mt-2"></div>
              <div className="flex-1">
                <span className="text-[#8D73FF] mr-1">{t('ecosystem.step1Title3')}</span>{t('ecosystem.step1Desc3')}
              </div>
            </div>
            <div className="flex space-x-2 ">
              <div className="w-1 h-1 rounded-full bg-[#FEBD32] mt-2"></div>
              <div className="flex-1">
                <span className="text-[#8D73FF] mr-1">{t('ecosystem.step1Title4')}</span>{t('ecosystem.step1Desc4')}
              </div>
            </div>
          </div>
          <div className={aniItem2 + " animate__animated mt-6 md:mt-0 animate__delay-1000 w-full md:w-1/2 bg-black/50 rounded-[20px] px-10 py-4"}>
            <div className="text-[#8D73FF] text-[22px]">{t('ecosystem.step2Content')}</div>
            <div className="flex space-x-2  mt-3">
              <div className="w-1 h-1 rounded-full bg-[#FEBD32] mt-2"></div>
              <div className="flex-1">
                <span className="text-[#8D73FF] mr-1">{t('ecosystem.step2Title1')}</span>{t('ecosystem.step2Desc1')}
              </div>
            </div>
            <div className="flex space-x-2 ">
              <div className="w-1 h-1 rounded-full bg-[#FEBD32] mt-2"></div>
              <div className="flex-1">
                <span className="text-[#8D73FF] mr-1">{t('ecosystem.step2Title2')}</span>{t('ecosystem.step2Desc2')}
              </div>
            </div>
            <div className="flex space-x-2 ">
              <div className="w-1 h-1 rounded-full bg-[#FEBD32] mt-2"></div>
              <div className="flex-1">
                <span className="text-[#8D73FF] mr-1">{t('ecosystem.step2Title3')}</span>{t('ecosystem.step2Desc3')}
              </div>
            </div>
            <div className="flex space-x-2 ">
              <div className="w-1 h-1 rounded-full bg-[#FEBD32] mt-2"></div>
              <div className="flex-1">
                <span className="text-[#8D73FF] mr-1">{t('ecosystem.step2Title4')}</span>{t('ecosystem.step2Desc4')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
