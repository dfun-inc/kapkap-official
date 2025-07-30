'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Pool from '@/components/GamePartners/Pool';

gsap.registerPlugin(ScrollTrigger)

export default function Future() {
  const t = useTranslations();

  const gamePartners = ['fomo_hash.jpg', 'Mine XRP.jpg', 'BabyDoge PAWS.jpg', 'Beetz.jpg', 'bitsolara.jpg', 'bitsolara.jpg', 'Bounty Hash.jpg',
    'Boxing Star X.jpg', 'Bums.jpg', 'CapsGame.jpg', 'Cattea.jpg', 'cityhold.jpg', 'Dogiators.jpg', 'Dragonz Land.jpg', 'DRFT Party.jpg', 'Dropster.jpg', 'duck.jpg', 
    'Duckygram.jpg', 'Fight Me.jpg', 'GILF.jpg', 'Gold Striker.jpg', 'labrador.jpg', 'League of Llamas.jpg', 'LuckyGo.jpg', 'Majestic.jpg', 'Major.jpg', 'Memgift.jpg', 
    'MemHustle.jpg', 'Nuts Farm.jpg', 'PandaFiT.jpg', 'Planet X.jpg', 'pokergram.jpg', 'Prison.jpg', 'Puparty.jpg', 'Rich Dog.jpg', 'Spin the Bottle.jpg', 'Squad Game.jpg', 
    'TAPX.jpg', 'TON Kombat.jpg', 'TonDating.jpg', 'Trump\'s Empire.jpg', 'TTHero.jpg', 'Uni Jump.jpg', 'VIRUS.jpg', 'VOXEL.jpg', 'Your Waifu.jpg', 'ZarGates.jpg'
  ]
  const questionList = [1,2,3,4];
  const questionMap:any = {
    1: [1],
    2: [2],
    3: [3],
    4: [4],
  };

  const [curQuestionList, setCurQuestionList] = useState(questionList);
  const [curTypeIdx, setCurTypeIdx] = useState(0);
  const listTypes = [t('qa.all'), t('qa.contact'), t('qa.support'), t('qa.revenue'), t('qa.integratedSystem')];
  const [openIdx, setOpenIdx] = useState<number[]>([]);
  const [gpAniClass, setGpAniClass] = useState('opacity-0');
  const [apAniClass, setApAniClass] = useState('opacity-0');
  const [qaAniClass, setQaAniClass] = useState('opacity-0');

  const handleToggleOpen = (id: number) => {
    if(openIdx.includes(id)) {
      setOpenIdx(openIdx.filter((item) => item !== id));
    }
    else {
      setOpenIdx([...openIdx, id]);
    }
  }

  useEffect(() => {
    if(curTypeIdx) {
      setCurQuestionList(questionMap[curTypeIdx]);
    }
    else {
      setCurQuestionList(questionList);
    }
    setOpenIdx([]);

  }, [curTypeIdx]);


  useEffect(() => {
    const winW = window.innerWidth;
    if (winW < 768) {
      setGpAniClass('');
      setApAniClass('');
      setQaAniClass('');
    }
    else {
      ScrollTrigger.create({
        trigger: ".other-section",
        start: "top 80%",
        once: true,
        onEnter: () => {
          console.log('gpAniClass');
          setGpAniClass(_c => 'animate__fadeInUp')
        },
      }); 
      ScrollTrigger.create({
        trigger: ".other-section",
        start: "top 50%",
        once: true,
        onEnter: () => {
          console.log('apAniClass');
          setApAniClass(_c => 'animate__fadeInUp')
        },
      }); 
      ScrollTrigger.create({
        trigger: ".other-section",
        start: "top 20%",
        once: true,
        onEnter: () => {
          console.log('qaAniClass');
          setQaAniClass(_c => 'animate__fadeInUp')
        },
      }); 
    }
  }, []);

  return (
    <section id="home-section-4" className="other-section home-section-4 relative">
      <div className="w-full bg-[#151213] relative">
        <div className="absolute bottom-full left-0 w-2/3 pr-[45px] lg:pr-[60px]">
          <div className="w-full h-[33px] lg:h-[44px] bg-[#151213]"></div>
          <div className="absolute top-0 right-0 w-0 h-0 border-t-0 border-l-0 border-b-[#151213] border-r-transparent border-b-[33px] border-r-[45px] lg:border-b-[44px] lg:border-r-[60px]"></div>
        </div>
        <div className="max-w-[1920px] mx-auto px-3 lg:px-18 2xl:px-24 pb-20">
          <div className={gpAniClass + " animate__animated text-[20px] lg:text-[40px] font-ethnocentric-rg text-white inline-block border-b border-[#FEBD32] leading-tight"}>
            {t('other.gamePartners')}
          </div>
          <Pool />
        </div>
      </div>
      <div className="w-full bg-[#090909] relative">
        <div className="absolute bottom-full left-0 w-2/3 pr-[45px] lg:pr-[60px]">
          <div className="w-full h-[33px] lg:h-[44px] bg-[#090909]"></div>
          <div className="absolute top-0 right-0 w-0 h-0 border-t-0 border-l-0 border-b-[#090909] border-r-transparent border-b-[33px] border-r-[45px] lg:border-b-[44px] lg:border-r-[60px]"></div>
        </div>
        <div className="max-w-[1920px] mx-auto px-3 lg:px-18 2xl:px-24 pb-30">
          <div className={apAniClass + " animate__animated text-[20px] lg:text-[40px] font-ethnocentric-rg text-white inline-block border-b border-[#FEBD32] leading-tight"}>
            {t('other.adPartners')}
          </div>
          <div className={apAniClass + " animate__animated flex flex-wrap gap-x-2 justify-between items-center mt-12"}>
            <div className="overflow-x-hidden">
              <div className="ad-partner-list w-[3600px] md:w-[4000px] lg:w-[5000px] flex flex-nowrap items-center">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <div className="w-1/2 flex items-center" key={idx}>
                    <div className="w-[9%] text-center">
                      <img className="w-auto h-5 md:h-6 lg:h-7 mx-auto" src="/images/ad_partners/gigapub.png" />
                    </div>
                    <div className="w-[9%] text-center">
                      <img className="w-auto h-6 md:h-7 lg:h-8 mx-auto" src="/images/ad_partners/gram.png" />
                    </div>
                    <div className="w-[9%] text-center">
                      <img className="w-auto h-7 md:h-8 lg:h-9 mx-auto" src="/images/ad_partners/sonar.png" />
                    </div>
                    <div className="w-[9%] text-center">
                      <img className="w-auto h-6 md:h-7 lg:h-8 mx-auto" src="/images/ad_partners/monetag.png" />
                    </div>
                    <div className="w-[9%] text-center">
                      <img className="w-auto h-11 md:h-12 lg:h-13 mx-auto" src="/images/ad_partners/onclicka.png" />
                    </div>
                    <div className="w-[13%] text-center">
                      <img className="w-auto h-2 md:h-3 lg:h-4 mx-auto" src="/images/ad_partners/richads.png" />
                    </div>
                    <div className="w-[8%] text-center">
                      <img className="w-auto h-6 md:h-7 lg:h-8 mx-auto" src="/images/ad_partners/meta.png" />
                    </div>
                    <div className="w-[8%] text-center">
                      <img className="w-auto h-6 md:h-7 lg:h-8 mx-auto" src="/images/ad_partners/google.png" />
                    </div>
                    <div className="w-[9%] text-center">
                      <img className="w-auto h-4 md:h-5 lg:h-6 mx-auto" src="/images/ad_partners/applovin.png" />
                    </div>
                    <div className="w-[6%] text-center">
                      <img className="w-auto h-11 md:h-12 lg:h-13 mx-auto" src="/images/ad_partners/unity.png" />
                    </div>
                    <div className="w-[8%] text-center">
                      <img className="w-auto h-5 md:h-6 lg:h-7 mx-auto" src="/images/ad_partners/csj.png" />
                    </div>
                    <div className="w-[13%] text-center">
                      <img className="w-auto h-3 md:h-4 lg:h-5 mx-auto" src="/images/ad_partners/tiktok.png" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-[#121212] relative">
        <div className="absolute bottom-full left-0 w-2/3 pr-[45px] lg:pr-[60px]">
          <div className="w-full h-[33px] lg:h-[44px] bg-[#121212]"></div>
          <div className="absolute top-0 right-0 w-0 h-0 border-t-0 border-l-0 border-b-[#121212] border-r-transparent border-b-[33px] border-r-[45px] lg:border-b-[44px] lg:border-r-[60px]"></div>
        </div>
        <div className="max-w-[1920px] mx-auto px-3 lg:px-18 2xl:px-24 pb-20">
          <div className={qaAniClass + " animate__animated text-[20px] lg:text-[40px] font-ethnocentric-rg text-white inline-block border-b border-[#FEBD32] leading-tight mt-3 md:mt-6"}>
            {t('qa.title')}
          </div>
          <div className={qaAniClass + " animate__animated animate__delay-500 rounded-full mt-15 bg-[#201E2A] p-1 flex items-center"}>
            {listTypes.map((item, idx) => (
              <div key={item} className={"text-xs lg:text-xl px-2 lg:px-16 py-2 md:py-3 cursor-pointer rounded-full mr-2 " + (curTypeIdx == idx ? "bg-[#121212]" : "")} onClick={() => setCurTypeIdx(idx)}>
                {item}
              </div>
            ))}
          </div>
          <div className={qaAniClass + " animate__animated animate__delay-1000 mt-6 md:px-3"}>
            {curQuestionList.map((item, idx) => (
              <div key={item} className="border-b border-[#373447] py-2">
                <div className="flex justify-between items-center cursor-pointer" onClick={() => handleToggleOpen(item)}>
                  <div className={"flex-1 text-[18px] lg:text-[24px] " + (openIdx.includes(item) ? "text-[#8D73FF]" : "text-[#DDD5FF]")}>
                    {t('qa.q' + item)}
                  </div>
                  <div className="w-10 h-10 bg-[#352F52] rounded flex items-center justify-center">
                    <svg className={"scale-[0.9] md:scale-none mt-[1px] md:mt-[3px] origin-center duration-200 " + (openIdx.includes(item) ? "rotate-180" : "")} width="14" height="9" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M5.88212 7.14717L0.225124 1.49017L1.63912 0.0761714L6.58912 5.02617L11.5391 0.0761718L12.9531 1.49017L7.29612 7.14717C7.1086 7.33464 6.85429 7.43996 6.58912 7.43996C6.32396 7.43996 6.06965 7.33464 5.88212 7.14717Z" fill="#ffffff"/>
                    </svg>
                  </div>
                </div>
                <div className={"text-[18px] lg:text-[24px] mt-[14px] md:mt-[9px] transition-[max-height] duration-300 overflow-hidden " + (openIdx.includes(item) ? 'max-h-[1200px]' : 'max-h-0')}>
                  {t('qa.a' + item)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
