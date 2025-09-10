'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger)

export default function Roadmap() {
  const t = useTranslations();
  const [aniTitleClass, setAniTitleClass] = useState<string>("opacity-0");
  const [aniItemClass, setAniItemClass] = useState<string>("opacity-0");

  const [roadMapData, setRoadMapData] = useState<any>(null);
  const currentProcess = [1, 4];

  const handleInit = () => {
    const raws:string[] = Object.keys(t.raw('roadmap'));
    let temp:any = {};
    
    raws.forEach((item) => {
      if(item.indexOf('step') >= 0 ) {
        const name = item.split('_');
        if(!temp[name[0]]) {
          temp[name[0]] = {sub: [], title: ''};
        }

        if(name.length == 1) {
          temp[name[0]]['title'] = t('roadmap.' + item);
        }
        else {
          temp[name[0]]['sub'].push(t('roadmap.' + item))
        }
      }
    })

    setRoadMapData(temp);
  }

  useEffect(() => {
    handleInit();

    const winW = window.innerWidth;
    let tween:any = null;
    if (winW < 768) {
      setAniTitleClass(_c => '')
      setAniItemClass(_c => '')
    }
    else {
      ScrollTrigger.create({
        trigger: ".roadmap-section",
        start: "top 60%",
        once: true,
        onEnter: () => {
          setAniTitleClass(_c => 'animate__fadeInUp')
          setAniItemClass(_c => 'animate__fadeInRight')
        },
      }); 

      /*
      gsap.to('.roadmap-title', {
        opacity: 0.2,
        y: -50,
        scrollTrigger: {
          trigger:".roadmap-section",
          start: 'top-=10% top',
          end: 'top+=20% top',
          scrub: true,
        },
      })

      tween = gsap.to('.roadmap-list', {
        opacity: 0.2,
        y: -80,
        scrollTrigger: {
          trigger:".roadmap-section",
          start: 'top+=500px top',
          end: 'top+=900px top',
          scrub: true,
        },
      })

      ScrollTrigger.refresh()
      */
    }

    return () => {
      // 清理动画和触发器，防止内存泄漏
      if(tween) {
        tween?.scrollTrigger?.kill()
        tween?.kill()
      }
    }
  }, []);
  
  return (
    <section id="home-section-3" className="roadmap-section home-section-3 bg-[#1a0b1d] relative">
      <div className="max-w-[1920px] section-box mx-auto px-5 lg:px-18 2xl:px-24 pt-9 pb-24 relative">
        <div className="absolute top-0 left-0 z-0 w-full h-full flex flex-col">
          <div className="relative z-1">
            <img className="w-full" src="/images/bg_roadmap.jpg" />
          </div>
          <div className="flex-1 w-full relative z-0">
            <img className="w-full h-full" src="/images/bg_roadmap_cover.jpg" />
          </div>
        </div>
        <div className="section-content relative z-1">
          <div className={aniTitleClass + " animate__animated text-[20px] lg:text-[30px] font-ethnocentric-rg text-white leading-tight"}>
            <div className="roadmap-title mx-auto inline-block border-b border-[#FEBD32]">{t('roadmap.title')}</div>
          </div>
          <div className="roadmap-list mt-15 text-[16px]">
            {roadMapData != null && Object.keys(roadMapData).map((key:string, i) => (
              <div key={i} className="relative z-1 pb-6">
                {i < (Object.keys(roadMapData).length - 1) && <div className={"absolute top-0 left-[9px] w-[2px] h-full z-0 " + 
                  (currentProcess[0] > i ? 'bg-[#8D73FF]' : 'bg-[#4B436F]')}></div>}
                <div className="flex items-center">
                  <div className={"relative z-1 border-[2px] bg-[#312a4d] rounded-full w-5 h-5 flex items-center justify-center " + (currentProcess[0] >= i ? 'border-[#8D73FF]' : 'border-[#4B436F]')}>
                    {currentProcess[0] > i && <div className="w-[10px] h-[10px] bg-[#C973FF] rounded-full"></div>}
                    {currentProcess[0] == i && <div className="w-[10px] h-[10px] bg-[#ffbd2f] rounded-full"></div>}
                  </div>
                  <div className={aniItemClass + " animate__animated ml-2 md:ml-4 leading-none flex-1 " + (currentProcess[0] > i ? 'text-[#8D73FF]' : (currentProcess[0] == i ? 'text-[#DDD5FF]' : 'text-[#8A84A3]'))}
                    style={{animationDelay: i * 0.5 + 's'}}>{roadMapData[key].title}</div>
                </div>
                <div className={aniItemClass + " pl-6 animate__animated "} style={{animationDelay: i * 0.5 + 's'}}>
                  {roadMapData[key]['sub'].map((sub: string, j: number) => (
                    <div key={j} className="ml-3 md:ml-6 leading-[1.25] flex items-center mt-3">
                      <div className={"w-[10px] h-[10px] rounded-full " + (currentProcess[0] > i ? 'bg-[#C973FF]' : (currentProcess[0] == i && currentProcess[1] >= j ? 'bg-[#FEBD32]' : 'bg-[#4B436F]'))}></div>
                      <div className={'flex-1 ml-3 ' + (currentProcess[0] > i ? 'text-[#8D73FF]' : (currentProcess[0] == i && currentProcess[1] >= j ? 'text-[#DDD5FF]' : 'text-[#8A84A3]'))}>{sub}</div>
                    </div>
                ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
