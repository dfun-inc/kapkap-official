'use client';

import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';

gsap.registerPlugin(ScrollTrigger)

export default function Bottom() {
  const t = useTranslations();
  const { triggerModalOpen } = useAppContext();
  const [aniClass, setAniClass] = useState('opacity-0');

  const handleOpenModal = () => {
    triggerModalOpen();
  }

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
    <section id="home-section-6" className="bottom-section home-section-6 bg-[#121212]">
      <div className="max-w-[1920px] mx-auto px-3 lg:px-18 2xl:px-24 py-20">
        <div className="flex flex-wrap items-center justify-between">
          <div className={aniClass + " animate__animated w-full lg:w-auto text-[30px] lg:text-[46px] xl:text-[60px]"}>
            <div>{t('bottom.text1')}</div>
            <div className="">{t('bottom.text2')}</div>
          </div>
          <div className={aniClass + " animate__animated w-full lg:w-auto text-center lg:text-start"}>
            <Button onClick={() => handleOpenModal()} className="text-xl font-light text-white px-10 md:px-15 py-3 md:py-4 mt-10 lg:mt-0">{t('bottom.getSupport')}</Button>
          </div>
        </div>
        <div className={aniClass + " animate__animated animate__delay-500 mt-10 md:mt-20 flex flex-wrap justify-center lg:justify-end"}>
          <a className="block opacity-80 hover:opacity-100 mx-2 md:mx-5 mb-2" href="https://twitter.com/GemixOfficial" target="_blank">
            <img className="w-11 md:w-12" src="/images/social/ins.png" alt="ins" />
          </a>
          <a className="block opacity-80 hover:opacity-100 mx-2 md:mx-5 mb-2" href="https://twitter.com/GemixOfficial" target="_blank">
            <img className="w-11 md:w-12" src="/images/social/tg.png" alt="tg" />
          </a>
          <a className="block opacity-80 hover:opacity-100 mx-2 md:mx-5 mb-2" href="https://twitter.com/GemixOfficial" target="_blank">
            <img className="w-11 md:w-12" src="/images/social/x.png" alt="x" />
          </a>
          <a className="block opacity-80 hover:opacity-100 mx-2 md:mx-5 mb-2" href="https://twitter.com/GemixOfficial" target="_blank">
            <img className="w-11 md:w-12" src="/images/social/youtube.png" alt="youtube" />
          </a>
          <a className="block opacity-80 hover:opacity-100 mx-2 md:mx-5 mb-2" href="https://twitter.com/GemixOfficial" target="_blank">
            <img className="w-11 md:w-12" src="/images/social/fb.png" alt="fb" />
          </a>
          <a className="block opacity-80 hover:opacity-100 mx-2 md:mx-5 mb-2" href="https://twitter.com/GemixOfficial" target="_blank">
            <img className="w-11 md:w-12" src="/images/social/threads.png" alt="threads" />
          </a>
        </div>
      </div>
    </section>
  );
}
