"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { getILEData, getIleClaimedReward, getCurSeasonReward } from "@/services/apis/app";
import { useAppContext } from "@/context/AppContext";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function ProductPage() {
  const t = useTranslations();
  const { configData, appData, ileData, handleSetIleData, userInfo, triggerModalOpen } = useAppContext();
  const [appList, setAppList] = useState<any>([]);
  const [listLoading, setListLoading] = useState<boolean>(true);

  const handleGetIleData = async () => {
    if(appData) {
      let temp:any = {};
      await Promise.all(Object.keys(appData).map(async (key:string) => {
        if(appData[key].process == 'launch') {
          await getILEData(appData[key].projectId).then((res) => {
            const data = res?.data;
            if(data.status == 10000 && data.data.length) {
              temp[appData[key].projectId] = data.data[0];
            }
          })
        }
      }));
      handleSetIleData(temp);
    }
  }

  const handleInitList = async() => {
    if(appData) {
      let temp:any[] = [];
      await Promise.all(Object.keys(appData).map(async (key:string) => {
        if(appData[key].process == 'launch') {
          let claimedAmount = 0;
          await getIleClaimedReward(appData[key].projectId).then((res) => {
            const data = res?.data;
            if(data.status == 10000 && data.data) {
              claimedAmount = Number(data.data);
            }
          })
          await getCurSeasonReward(appData[key].projectId).then((res) => {
            const data = res?.data;
            if(data.status == 10000 && data.data) {
              if(Number(data.data) || Number(claimedAmount)) {
                temp.push({
                  ...appData[key],
                  curSeasonAmount: Number(data.data),
                  claimedAmount
                })
              }
            }
          })
          
        }
      }));
      setAppList(temp);
    }
    setListLoading(false);
  }

  useEffect(() => {
    if(appData && !ileData) {
      handleGetIleData();
    }
  }, [appData, ileData])

  useEffect(() => {
    if(appData) {
      handleInitList();
    }
  }, [appData])

  return (
    <main className="min-h-screen overflow-hidden relative pt-[72px]">
      <div className="absolute w-full h-full top-0 left-0 z-0">
        <div className="max-w-[1920px] h-2/3 mx-auto">
          <img className="w-full h-full object-cover relative z-0" src="/images/app_top_banner.png" />
          <div className="w-full h-full bg-black/60 backdrop-blur-2xl absolute top-0 left-0 z-1" />
        </div>
      </div>
      <div className="mt-9 relative z-2">
        <div className="max-w-[1920px] mx-auto px-5 lg:px-18 2xl:px-24">
          <div className="inline font-ethnocentric-rg text-[26px] md:text-[40px] text-white text-center border-b border-[#FEBD32]">
            {t('profile.title')}
          </div>
          {userInfo ?
            listLoading ?
            <div className="flex justify-between flex-wrap gap-8 mt-8">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="w-full md:flex-1 rounded-[20px] overflow-hidden h-[320px] animate-pulse bg-gray-500/50"></div>
              ))}
            </div>
            :
            appList.length ?
              <div className="grid gap-[30px] mt-8 md:grid-cols-2 xl:grid-cols-3"> 
              {appList.map((item:any, idx:number) => (
                <Link href={'/project?id=' + item?.projectId} key={idx} className="group block flex-1 rounded-[20px] overflow-hidden bg-black hover:bg-[#201e2a] cursor-pointer">
                  <div className="aspect-[7/4] w-full relative overflow-hidden">
                    {configData != null && <img className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110" src={configData.cdn + item?.banner} />}
                    {ileData && ileData[item.projectId] && <div className="absolute top-3 left-2 rounded-full bg-black/70 text-right pl-13 pr-3 pt-[10px] pb-[6px]">
                      <img className="absolute w-13 -top-3 -left-1" src="/images/icon_launch.png" />
                      <span className="text-white text-[18px] md:text-[20px] leading-[16px] md:leading-[18px]">
                        {Math.floor(ileData[item.projectId]?.claimedAmount / ileData[item.projectId]?.allAmount * 10000) / 100}%
                      </span>
                    </div>}
                    <div className="absolute left-0 bottom-0 flex items-end w-full">
                      <div className="w-[15px] bg-black/70 h-[50px]"></div>
                      <div className="p-[5px] pb-[9px] rounded-t-[20px] bg-black/70 ">
                        {configData != null && <img className="w-[70px]" src={configData.cdn + item?.icon} />}
                      </div>
                      <div className="flex-1 h-[50px] bg-black/70">
                        <div className="text-white text-[24px] 2xl:text-[30px] leading-[1.1] pl-4 pt-4 2xl:pt-2">
                          { item?.name}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="pb-3 mb-3 border-b border-[#353244] flex items-center justify-between">
                      <img className="w-12 md:w-16" src="/images/icon_attentionPoints.png" />
                      <div className="text-right">
                        <div className="md:text-lg text-[#8D73FF]">{t('profile.attentionPoints')}</div>
                        <div className="text-[22px] md:text-[30px] text-[#F2CA9E]">{item.curSeasonAmount}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <img className="w-12 md:w-16" src="/images/icon_kkAppToke.png" />
                      <div className="text-right">
                        <div className="md:text-lg text-[#8D73FF]">{t('profile.appTokens')}</div>
                        <div className="text-[22px] md:text-[30px] text-[#F2CA9E]">{item.claimedAmount}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            :
            <div className="py-24 flex min-h-[60vh] items-center justify-center">
              <div className="text-center">
                <svg className="inline-block opacity-60" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4379" width="64" height="64"><path d="M855.6 427.2H168.5c-12.7 0-24.4 6.9-30.6 18L4.4 684.7C1.5 689.9 0 695.8 0 701.8v287.1c0 19.4 15.7 35.1 35.1 35.1H989c19.4 0 35.1-15.7 35.1-35.1V701.8c0-6-1.5-11.8-4.4-17.1L886.2 445.2c-6.2-11.1-17.9-18-30.6-18zM673.4 695.6c-16.5 0-30.8 11.5-34.3 27.7-12.7 58.5-64.8 102.3-127.2 102.3s-114.5-43.8-127.2-102.3c-3.5-16.1-17.8-27.7-34.3-27.7H119c-26.4 0-43.3-28-31.1-51.4l81.7-155.8c6.1-11.6 18-18.8 31.1-18.8h622.4c13 0 25 7.2 31.1 18.8l81.7 155.8c12.2 23.4-4.7 51.4-31.1 51.4H673.4zM819.9 209.5c-1-1.8-2.1-3.7-3.2-5.5-9.8-16.6-31.1-22.2-47.8-12.6L648.5 261c-17 9.8-22.7 31.6-12.6 48.4 0.9 1.4 1.7 2.9 2.5 4.4 9.5 17 31.2 22.8 48 13L807 257.3c16.7-9.7 22.4-31 12.9-47.8zM375.4 261.1L255 191.6c-16.7-9.6-38-4-47.8 12.6-1.1 1.8-2.1 3.6-3.2 5.5-9.5 16.8-3.8 38.1 12.9 47.8L337.3 327c16.9 9.7 38.6 4 48-13.1 0.8-1.5 1.7-2.9 2.5-4.4 10.2-16.8 4.5-38.6-12.4-48.4zM512 239.3h2.5c19.5 0.3 35.5-15.5 35.5-35.1v-139c0-19.3-15.6-34.9-34.8-35.1h-6.4C489.6 30.3 474 46 474 65.2v139c0 19.5 15.9 35.4 35.5 35.1h2.5z" p-id="4380" fill="#e6e6e6"></path></svg>
                <div className="mt-6">
                  <Button href="/explore" className="text-xl font-light text-white w-40 md:w-60 text-center py-3 md:py-4">
                    {t('ecosystem.exploreNow')}
                  </Button>
                </div>
              </div>
            </div>
          
          :
          <div className="py-24 flex min-h-[60vh] items-center justify-center">
            <Button className="text-xl font-light text-white w-40 md:w-60 text-center py-3 md:py-4" onClick={() => triggerModalOpen()}>
              {t('menu.login')}
            </Button>
          </div>
        }
        </div>
      </div>
        
      <div className="bg-[#090909] py-6 relative z-1 mt-12">
        <div className="max-w-[1920px] mx-auto px-5 lg:px-18 2xl:px-24">
          <Footer />
        </div>
      </div>
    </main>
  );
}