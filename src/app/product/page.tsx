"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/Footer";

export default function ProductPage() {
  const t = useTranslations();
  const [product, setProduct] = useState<any>(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const appData:any = {
    id: 1,
    title: 'Genki Miner',
    desc: 'Your throne\'s getting dusty – time to RULE!<br/>Today\'s secret code: DRAGONSNACKS (enter in settings!)<br/>The game\'s good – but YOU make it LEGENDARY!<br/>Dont forget to claim your AFK rewards with ACE coins  every 8 hours.',
    icon: '/images/app_GenkiMiner_icon.png',
    banner: '/images/app_GenkiMiner_view.jpg',
    tag: [
      { name: 'Game', color: 'bg-[#452C7A]'},
      { name: 'Play-Earn', color: 'bg-[#6D4F0E]'}
    ],
    process: '72.16'
  };

  useEffect(() => {
    console.log(id)
  }, []);

  return (
    <main className="min-h-screen overflow-hidden">
      <div className="absolute w-full h-full top-0 left-0 z-0">
        <div className="max-w-[1920px] h-full mx-auto">
          <img className="w-full h-full object-cover relative z-0" src={appData.banner} />
          <div className="w-full h-full bg-black/60 backdrop-blur-2xl absolute top-0 left-0 z-1" />
        </div>
      </div>
      <div className="max-w-[1920px] mx-auto relative z-1">
        <div className="h-[150px] md:h-auto relative">
          <img className="w-full h-full md:h-auto object-cover" src="/images/app_top_banner.png" />
          <div className="absolute top-0 left-0 w-full h-full flex items-center px-3 lg:px-18 2xl:px-24 leading-[1.1]">
            <div className="font-ethnocentric-rg pt-10 md:pt-12 text-center md:text-left text-[18px] md:text-[42px] 2xl:text-[60px] w-full md:w-[480px] 2xl:w-[680px]">
              {t('explore.title')}
            </div>
          </div>
        </div>

        <div className="px-5 lg:px-18 2xl:px-24 mt-10 md:mt-32">
          <div className="bg-black/50 rounded-[20px]">
            <div className="flex flex-wrap">
              <div className="relative md:-left-3 md:-top-5 w-full md:w-[480px] xl:w-[520px] 2xl:w-[560px] bg-black rounded-[20px] overflow-hidden">
                <img className="w-full" src={appData.banner} />
                <div className="px-8 py-6">
                  <div className="flex items-center">
                    <div className="flex-1 bg-[#5125B4] rounded-full h-10 relative">
                      <img className="h-18 absolute -top-3" style={{left: appData.process + '%'}} src="/images/icon_launch.png" />
                    </div>
                    <div className="min-w-[100px] w-[15%] text-center text-[20px] text-white">{appData.process}%</div>
                  </div>
                  <div className="mt-5 flex items-center justify-center md:justify-end">
                    <a className="block opacity-60 hover:opacity-100 mx-2 md:mx-5" href="" target="_blank">
                      <img loading="lazy" className="w-9 md:w-11" src="/images/social/x.png" alt="x" />
                    </a>
                    <a className="block opacity-60 hover:opacity-100 mx-2 md:mx-5" href="" target="_blank">
                      <img loading="lazy" className="w-9 md:w-11" src="/images/social/tg.png" alt="tg" />
                    </a>
                    <a className="block opacity-60 hover:opacity-100 mx-2 md:mx-5" href="" target="_blank">
                      <img loading="lazy" className="w-9 md:w-11" src="/images/social/tg.png" alt="tg" />
                    </a>
                    <a className="block opacity-60 hover:opacity-100 mx-2 md:mx-5" href="" target="_blank">
                      <img loading="lazy" className="w-9 md:w-11" src="/images/social/youtube.png" alt="youtube" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-auto md:flex-1 px-5 py-8">
                <div className="flex">
                  <img className="w-[70px]" src={appData.icon} />
                  <div className="ml-4">
                    <div className="text-white text-[24px] 2xl:text-[30px] leading-[1.1]">{appData.title}</div>
                    <div className="flex mt-2">
                      {appData.tag.map((item:any) => (
                        <div key={item.name} className={`text-[12px] mr-2 md:text-[14px] px-4 py-[6px] rounded-full ${item.color}`}>{item.name}</div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-[#A6A6A6] text-lg" dangerouslySetInnerHTML={{__html: "Your throne's getting dusty – time to RULE! Today's secret code: DRAGONSNACKS (enter in settings!) The game's good – but YOU make it LEGENDARY! Dont forget to claim your AFK rewards with ACE coins  every 8 hours. Your throne's getting dusty – time to RULE! Today's secret code: DRAGONSNACKS (enter in settings!) The game's good – but YOU make it LEGENDARY! Dont forget to claim your AFK rewards with ACE coins  every 8 hours. Your throne's getting dusty – time to RULE! Today's secret code: DRAGONSNACKS (enter in settings!) The game's good – but YOU make it LEGENDARY! Dont forget to claim your AFK rewards with ACE coins  every 8 hours."}}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-[#090909] py-6 mt-10">
          <div className="max-w-[1920px] mx-auto px-5 lg:px-18 2xl:px-24">
            <Footer />
          </div>
        </div>
      </div>
    </main>
  );
}