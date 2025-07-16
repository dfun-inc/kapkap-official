'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export default function Future() {
  const t = useTranslations();

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

  return (
    <section id="home-section-4" className="home-section-4 bg-[#121212]">
      <div className="max-w-[1920px] mx-auto px-10 lg:px-24 py-20">
        <div className="text-[20px] lg:text-[40px] font-ethnocentric-rg text-white inline-block border-b border-[#FEBD32] leading-tight">
          {t('other.gamePartners')}
        </div>
        <div className="flex flex-wrap gap-x-2 items-center mt-15">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="flex w-[60px] md:w-[80px] 2xl:w-[100px] mt-1">
            <img className="w-full opacity-70 hover:opacity-100" src={"/images/game_partners/" + (idx + 1) + ".png"} alt={"partner-" + (idx + 1)} />
          </div>
        ))}
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="flex w-[60px] md:w-[80px] 2xl:w-[100px] mt-1">
            <img className="w-full opacity-70 hover:opacity-100" src={"/images/game_partners/" + (idx + 1) + ".png"} alt={"partner-" + (idx + 1)} />
          </div>
        ))}
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="flex w-[60px] md:w-[80px] 2xl:w-[100px] mt-1">
            <img className="w-full opacity-70 hover:opacity-100" src={"/images/game_partners/" + (idx + 1) + ".png"} alt={"partner-" + (idx + 1)} />
          </div>
        ))}
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="flex w-[60px] md:w-[80px] 2xl:w-[100px] mt-1">
            <img className="w-full opacity-70 hover:opacity-100" src={"/images/game_partners/" + (idx + 1) + ".png"} alt={"partner-" + (idx + 1)} />
          </div>
        ))}
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="flex w-[60px] md:w-[80px] 2xl:w-[100px] mt-1">
            <img className="w-full opacity-70 hover:opacity-100" src={"/images/game_partners/" + (idx + 1) + ".png"} alt={"partner-" + (idx + 1)} />
          </div>
        ))}
        </div>
        <div className="text-[20px] lg:text-[40px] font-ethnocentric-rg text-white inline-block border-b border-[#FEBD32] leading-tight mt-20 md:mt-40">
          {t('other.adPartners')}
        </div>
        <div className="flex flex-wrap gap-x-2 justify-between items-center mt-12">
          <img className="w-[48%] md:w-auto h-auto md:h-10 mt-3" src="/images/ad_partners/gram.png" />
          <img className="w-[48%] md:w-auto h-auto md:h-10 mt-3" src="/images/ad_partners/sonar.png" />
          <img className="w-[48%] md:w-auto h-auto md:h-10 mt-3" src="/images/ad_partners/gigapub.png" />
          <img className="w-[48%] md:w-auto h-auto md:h-10 mt-3" src="/images/ad_partners/monetag.png" />
          <img className="w-[48%] md:w-auto h-auto md:h-10 mt-3" src="/images/ad_partners/onclicka.png" />
          <img className="w-[48%] md:w-auto h-auto md:h-4 mt-3" src="/images/ad_partners/richads.png" />
        </div>
        <div className="text-[20px] lg:text-[40px] font-ethnocentric-rg text-white inline-block border-b border-[#FEBD32] leading-tight mt-20 md:mt-40">
          {t('qa.title')}
        </div>
        <div className="rounded-full mt-15 bg-[#201E2A] p-1 flex items-center">
          {listTypes.map((item, idx) => (
            <div key={item} className={"text-xs lg:text-xl px-2 md:px-16 py-2 md:py-3 cursor-pointer rounded-full mr-2 " + (curTypeIdx == idx ? "bg-[#121212]" : "")} onClick={() => setCurTypeIdx(idx)}>
              {item}
            </div>
          ))}
        </div>
        <div className="mt-6 md:px-3">
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
    </section>
  );
}
