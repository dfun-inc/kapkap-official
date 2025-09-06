"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import { getUrlParamsByName } from "@/utils/url";

export default function ProductPage() {
  const t = useTranslations();
  const [projectData, setProjectData] = useState<any>(null);

  const { appData, configData } = useAppContext();

  useEffect(() => {
    const id = getUrlParamsByName('id');
    if(appData && id) {
      if(appData[id]) {
        setProjectData({
          tagArr: appData[id].tag.split(' '),
          ...appData[id]
        });
      }
    }
  }, [appData]);

  return (
    <main className="min-h-screen overflow-hidden">
      {projectData == null ? (
        <div className="relative pb-12">
          <div className="max-w-[1920px] mx-auto relative z-1">
            <div className="px-5 lg:px-18 2xl:px-24 mt-10 md:mt-32">
              <div className="bg-black/50 rounded-[20px]">
                <div className="flex flex-wrap">
                  <div className="relative md:-left-3 md:-top-5 w-full md:w-[480px] xl:w-[520px] 2xl:w-[560px] bg-black rounded-[20px] overflow-hidden">
                    <div className="w-full aspect-[16/9] animate-pulse bg-gray-500/50 rounded-[20px]"></div>
                    <div className="px-8 py-6">
                      <div className="animate-pulse bg-gray-500/50 rounded-[20px] h-10 relative"></div>
                      <div className="mt-5 flex items-center justify-center md:justify-end">
                        <div className="animate-pulse bg-gray-500/50 rounded-[10px] h-10 w-10 mx-2 md:mx-5"></div>
                        <div className="animate-pulse bg-gray-500/50 rounded-[10px] h-10 w-10 mx-2 md:mx-5"></div>
                        <div className="animate-pulse bg-gray-500/50 rounded-[10px] h-10 w-10 mx-2 md:mx-5"></div>
                        <div className="animate-pulse bg-gray-500/50 rounded-[10px] h-10 w-10 mx-2 md:mx-5"></div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-auto md:flex-1 px-5 py-8">
                    <div className="flex">
                      <div className="animate-pulse bg-gray-500/50 rounded-[10px] h-[70px] w-[70px]"></div>
                      <div className="ml-4">
                        <div className="animate-pulse bg-gray-500/50 rounded-[10px] h-[28px] w-[120px]"></div>
                        <div className="animate-pulse bg-gray-500/50 rounded-[10px] h-[20px] w-[120px] mt-2"></div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="animate-pulse bg-gray-500/50 rounded-[10px] h-[20px] w-full"></div>
                      <div className="animate-pulse bg-gray-500/50 rounded-[10px] h-[20px] w-full mt-2"></div>
                      <div className="animate-pulse bg-gray-500/50 rounded-[10px] h-[20px] w-full mt-2"></div>
                      <div className="animate-pulse bg-gray-500/50 rounded-[10px] h-[20px] w-full mt-2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative pb-12">
          <div className="absolute w-full h-full top-0 left-0 z-0">
            <div className="max-w-[1920px] h-full mx-auto">
              {configData && <img className="w-full h-full object-cover relative z-0" src={configData.cdn + projectData.banner} />}
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
                    {configData && <img className="w-full" src={configData.cdn + projectData.banner} />}
                    <div className="px-8 py-6">
                      <div className="flex items-center">
                        <div className="flex-1 bg-[#5125B4] rounded-full h-10 relative">
                          <img className="h-18 absolute -top-3" style={{left: projectData.process + '%'}} src="/images/icon_launch.png" />
                        </div>
                        <div className="min-w-[100px] w-[15%] text-center text-[20px] text-white">{projectData.process}%</div>
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
                      {configData && <img className="w-[70px]" src={configData.cdn + projectData.icon} />}
                      <div className="ml-4">
                        <div className="text-white text-[24px] 2xl:text-[30px] leading-[1.1]">{projectData.name}</div>
                        <div className="flex mt-2">
                          {projectData.tagArr?.map((name:string, tagIdx:number) => (
                            <div key={tagIdx} className={"text-[12px] mr-2 md:text-[14px] px-4 py-[6px] rounded-full " + (tagIdx % 2 == 0 ? "bg-[#452C7A]" : "bg-[#6D4F0E]")}>{name}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-[#A6A6A6] text-lg" dangerouslySetInnerHTML={{__html: "Your throne's getting dusty – time to RULE! Today's secret code: DRAGONSNACKS (enter in settings!) The game's good – but YOU make it LEGENDARY! Dont forget to claim your AFK rewards with ACE coins  every 8 hours. Your throne's getting dusty – time to RULE! Today's secret code: DRAGONSNACKS (enter in settings!) The game's good – but YOU make it LEGENDARY! Dont forget to claim your AFK rewards with ACE coins  every 8 hours. Your throne's getting dusty – time to RULE! Today's secret code: DRAGONSNACKS (enter in settings!) The game's good – but YOU make it LEGENDARY! Dont forget to claim your AFK rewards with ACE coins  every 8 hours."}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
        
      <div className="bg-[#090909] py-6 mt-10">
        <div className="max-w-[1920px] mx-auto px-5 lg:px-18 2xl:px-24">
          <Footer />
        </div>
      </div>
    </main>
  );
}