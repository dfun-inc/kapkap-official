'use client';

import Button from '@/components/ui/Button';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useAppContext } from '@/context/AppContext';

gsap.registerPlugin(ScrollTrigger)

export default function Main() {
  const t = useTranslations();
  const { triggerModalOpen } = useAppContext();

  const handleOpenModal = () => {
    triggerModalOpen();
  }

  useEffect(() => {
    gsap.to('.title-text-top', {
      opacity: 0.2,
      y: -50,
      scrollTrigger: {
        trigger:".main-section",
        start: '5% top',
        end: '35% top',
        scrub: true,
      },
    })

    gsap.to('.title-text-bottom', {
      opacity: 0.2,
      y: -50,
      scrollTrigger: {
        trigger:".main-section",
        start: '10% top',
        end: '40% top',
        scrub: true,
      },
    })

    gsap.to('.main-desc', {
      opacity: 0.2,
      y: -50,
      scrollTrigger: {
        trigger:".main-section",
        start: '15% top',
        end: '45% top',
        scrub: true,
      },
    })

    gsap.to('.main-btn-box', {
      opacity: 0.2,
      y: -80,
      scrollTrigger: {
        trigger:".main-section",
        start: '20% top',
        end: '50% top',
        scrub: true,
      },
    })
  })

  return (
    <section id="home-section-0" className="main-section home-section-0 bg-[#070709] h-screen min-h-[720px]">
      <div className="max-w-[1920px] mx-auto px-5 lg:px-18 2xl:px-24 h-full flex items-center">
        <div className="w-full">
          <div className="text-[32px] lg:text-[62px] xl:text-[72px] 2xl:text-[80px] font-ethnocentric-rg leading-tight uppercase">
            <div className="title-text-top"><span className="inline-block animate__animated animate__fadeInUp text-[#FEBD32]">{t('main.title1')}</span> <span className="inline-block animate__animated animate__fadeInUp">{t('main.title2')}</span></div>
            <div className="title-text-bottom"><span className="inline-block animate__animated animate__fadeInUp">{t('main.title3')}</span> <span className="inline-block animate__animated animate__fadeInUp text-[#6E4DFF]">{t('main.title4')}</span></div>
          </div>
          <div className="main-desc mt-5 lg:w-[876px] lg:max-w-[55%] ">
            <div className="animate__animated animate__fadeInUp text-[#8A84A3]">{t('main.desc')}</div>
          </div>
          <div className="main-btn-box mt-30">
            <div className="inline-block animate__animated animate__fadeInUp">
              <Button onClick={handleOpenModal} className="text-xl font-light text-white px-10 md:px-15 py-3 md:py-4">{t('main.getSupport')}</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
