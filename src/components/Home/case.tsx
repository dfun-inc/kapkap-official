'use client';

import { useTranslations } from 'next-intl';
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import { useRef, useState } from 'react';

export default function Case() {
  const t = useTranslations();
  const list = ["Genki Miner", "Mars 2049", "TT Hero"];
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const swiperRef = useRef<any>(null);

  const handleSlideChange = (swiper: any) => {
    setActiveIdx(swiper.activeIndex);
  };

  const goToSlide = (index: number) => {
    swiperRef.current?.slideTo(index);
  };

  return (
    <section id="home-section-2" className="home-section-2 bg-[#121212]">
      <div className="max-w-[1920px] mx-auto px-10 lg:px-24 py-16">
        <div className="text-[20px] lg:text-[40px] font-ethnocentric-rg text-white inline-block border-b border-[#FEBD32] leading-tight">
          {t('case.title')}
        </div>
        <div className="rounded-full mt-11 bg-[#201E2A] p-1 flex">
          {list.map((item, idx) => (
            <div key={item} className={"lg:text-xl px-3 md:px-16 py-2 md:py-3 cursor-pointer rounded-full mr-2 " + (activeIdx == idx ? "bg-[#121212]" : "")} onClick={() => goToSlide(idx)}>
              {item}
            </div>
          ))}
        </div>
        <Swiper className="mt-5" onSlideChange={handleSlideChange} onSwiper={(swiper) => (swiperRef.current = swiper)}>
          {Array.from({ length: 3 }).map((_, index) => (
          <SwiperSlide key={index} className="overflow-hidden rounded-xl bg-[#201E2A]">
            <div className="relative">
              <div className="md:absolute flex flex-wrap top-0 left-0 w-full items-center justify-between px-6 py-1 md:py-0">
                <div className="md:-mt-1 bg-[#AFFE32] rounded-full text-[#3F5D24] px-2 md:px-5 py-1 text-lg">
                  {t('case.stablePeriod')}
                </div>
                <div className="w-full md:w-auto order-3 md:order-2 md:flex-1 flex flex-wrap justify-between items-center md:px-[8%] mt-2 md:mt-[2px]">
                  <div className="w-3/10 lg:w-auto text-center">
                    <div className="text-xs lg:text-sm text-[#8D73FF]">{t('case.player')}</div>
                    <div className="text-lg md:text-[26px]">0.00M</div>
                  </div>
                  <div className="w-4/10 lg:w-auto text-center">
                    <div className="text-xs lg:text-sm text-[#8D73FF]">{t('case.mau')}</div>
                    <div className="text-lg md:text-[26px]">0.00M</div>
                  </div>
                  <div className="w-3/10 lg:w-auto text-center">
                    <div className="text-xs lg:text-sm text-[#8D73FF]">{t('case.dailyPlaytime')}</div>
                    <div className="text-lg md:text-[26px]">0.00M</div>
                  </div>
                  <div className="w-3/10 lg:w-auto text-center">
                    <div className="text-xs lg:text-sm text-[#8D73FF]">{t('case.2dRet')}</div>
                    <div className="text-lg md:text-[26px]">0%</div>
                  </div>
                  <div className="w-3/10 lg:w-auto text-center">
                    <div className="text-xs lg:text-sm text-[#8D73FF]">{t('case.wRet')}</div>
                    <div className="text-lg md:text-[26px]">0%</div>
                  </div>
                  <div className="w-3/10 lg:w-auto text-center">
                    <div className="text-xs lg:text-base text-[#8D73FF]">{t('case.mRet')}</div>
                    <div className="text-lg md:text-[26px]">0%</div>
                  </div>
                </div>
                <a className="md:-mt-1 order-2 md:order-3 flex items-center hover:opacity-80" href="https://www.genkiminer.xyz/" target="_blank">
                  <span className="border-b leading-none mr-1 text-lg">{t('case.viewDetails')}</span>
                  <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="22" height="22"><path d="M644.896 514.656c-4.647-3.465-7.707-5.211-10.102-7.614-111.882-111.777-223.68-223.642-335.584-335.395-11.498-11.482-17.601-24.432-14.060-40.893 6.549-30.444 42.724-43.056 66.702-23.206 2.638 2.179 5.006 4.691 7.43 7.116 122.147 122.131 244.29 244.268 366.434 366.411 22.218 22.218 22.236 44.944 0.033 67.143-122.749 122.755-245.548 245.451-368.185 368.316-12.166 12.191-26.062 17.589-42.734 13.327-28.957-7.395-40.247-42.511-21.462-65.828 2.323-2.881 5.046-5.457 7.668-8.083 111.214-111.228 222.435-222.459 333.706-333.634 2.407-2.404 5.469-4.166 10.148-7.66z" fill="#ffffff" p-id="4665"></path></svg>
                </a>
              </div>
              <img className="w-full" src="/images/bg_case1.jpg" />
            </div>
          </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
