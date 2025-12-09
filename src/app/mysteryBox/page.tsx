"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { getBlindboxConfig } from "@/services/apis/blindbox";

import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import { useErrCode } from "@/datas/errCode";
import { getKScore } from "@/services/apis/user";
import BlindboxList from "@/components/Blindbox/BlindboxList";
import MysteryShop from "@/components/Blindbox/MysteryShop";
import PopularTask from "@/components/Blindbox/PopularTask";
import LooteryRecord from "@/components/Blindbox/LotteryRecord";
import { getNFTData } from "@/services/apis/nft";
import { formatNumberWithCommas } from "@/utils/number";
import Invite from "@/components/Blindbox/Invite";
import eventBus from "@/utils/eventBus";

export default function Blindbox() {
  const t = useTranslations();

  const { configData, userInfo, triggerModalOpen } = useAppContext();
  const [addr, setAddr] = useState<string>('');
  const [lotteryRecordOpen, setLotteryRecordOpen] = useState<boolean>(false);

  const [blindboxConfig, setBlindboxConfig] = useState<any>(null);
  const [onSaleBlindbox, setOnSaleBlindbox] = useState<any>(null);
  const [boxConfigLoading, setBoxConfigLoading] = useState<boolean>(true);
  const [NftData, setNftData] = useState<any>(null);

  const [myListTrigger, setMyListTrigger] = useState<number>(0);
  const [kscoreTrigger, setKscoreTrigger] = useState<number>(0);
  const [taskStatusTrigger, setTaskStatusTrigger] = useState<number>(0);
  const [kscore, setKscore] = useState<number>(0);
  const [kscoreLoading, setKscoreLoading] = useState<boolean>(true);

  const { errCodeHandler } = useErrCode();

  const historyRef = useRef<any>(null);

  const handleGetConfig = async() => {
    await getBlindboxConfig().then((res) => {
      const data = res?.data;
      if(data.status == 10000) {
        // let tempList:any[] = [];
        let tempItem:any = {}
        if(data.data) {
          Object.keys(data.data).forEach((key) => {
            // tempList.push(data.data[key]);
            if(data.data[key].price > 0) {
              tempItem = data.data[key]
            }
          })
        }
        // tempList.sort((a, b) => a.boxID - b.boxID);
        setBlindboxConfig(data.data);
        setOnSaleBlindbox(tempItem);
      }
      else {
        errCodeHandler(data.status, data.msg)
      }
    })
    setBoxConfigLoading(false);
  }

  const handleGetNftData = async() => {
    await getNFTData()
    .then((res) => {
      const data = res?.data;
      if(data.status == 10000) {
        let temp:any = {};
        Object.keys(data?.data).forEach((key) => {
          if(Object.keys(data?.data[key]['ids']).length) {
            Object.keys(data?.data[key]['ids']).forEach((id) => {
              temp[id] = {
                project: data?.data[key].project,
                ...data?.data[key]['ids'][id]
              }
            })
          }
        })
        setNftData(temp);
      }
      else {
        errCodeHandler(data.status, data.msg)
      }
    })
  }

  const handleGetKscore = async () => {
    setKscoreLoading(true);
    await getKScore(10000)
    .then((res) => {
      const data = res?.data;
      if(data.status == 10000 || data.status == 30082) {
        setKscore(data?.data?.have || 0);
      }
      else {
        errCodeHandler(data.status, data.msg)
      }
    })
    setKscoreLoading(false);
  }

  const handleUpdateMysteryBoxList = () => {
    setMyListTrigger(Date.now());
  }

  useEffect(() => {
    if(userInfo) {
      handleGetKscore();
    }
    else {
      setAddr('');
    }
  }, [userInfo, kscoreTrigger])

  useEffect(() => {
    handleGetConfig();
    handleGetNftData();

    const addr = localStorage.getItem('kkAddress');
    setAddr(addr || '');

    eventBus.addEventListener("updateMysteryBoxList", handleUpdateMysteryBoxList);

    return () => {
      eventBus.removeEventListener("updateMysteryBoxList", handleUpdateMysteryBoxList);
    }
  }, [])

  return (
    <main className="blindbox-page min-h-screen overflow-hidden relative">
      <div className="max-w-[1920px] mx-auto relative px-5 lg:px-18 2xl:px-24 pt-28 pb-20">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-auto animate__fadeInUp md:animate__animated text-[17px] lg:text-[30px] font-ethnocentric-rg text-white leading-tight">
            <div className="mx-auto inline-block border-b border-[#FEBD32]">{t('blindbox.title')}</div>
          </div>
          {userInfo != null &&<div className="w-full md:w-auto flex items-center animate__fadeInUp md:animate__animated mt-3 md:mt-0">
            <div className="text-[#8D73FF] text-[18px]">{t('personalInfo.yourKScore')}:</div>
            <div className="text-[#FEBD32] text-[24px] ml-2">{kscore ? formatNumberWithCommas(kscore) : 0}</div>
          </div>}
        </div>
        <BlindboxList userInfo={userInfo} blindboxConfig={blindboxConfig} boxConfigLoading={boxConfigLoading} triggerTaskStatus={setTaskStatusTrigger}
          myListTrigger={myListTrigger} triggerKscore={setKscoreTrigger} NftData={NftData} />
        <div className="mt-18 md:mx-10 pb-9 border-b-[2px] border-[#4C4081]">
          <div className="mt-18 flex items-center justify-between text-[#DDD5FF] text-[20px]">
            <div className="capitalize">{t('blindbox.rule')}:</div>
            {userInfo != null && <LooteryRecord userInfo={userInfo} blindboxConfig={blindboxConfig} NftData={NftData} />}
          </div>
          <div className="mt-6 text-[#DDD5FF] text-[20px]">
            <div className="">{t('blindbox.rule1')}</div>
            <div className="mt-6">{t('blindbox.rule2')}</div>
            <div className="mt-6">{t('blindbox.rule3')}</div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap justify-between md:space-x-12 2xl:space-x-15">
          <MysteryShop userInfo={userInfo} onSaleBlindbox={onSaleBlindbox} triggerKscore={setKscoreTrigger} kscoreLoading={kscoreLoading} kscore={kscore} triggerMyList={setMyListTrigger} />
          <PopularTask userInfo={userInfo} blindboxConfig={blindboxConfig} taskStatusTrigger={taskStatusTrigger} triggerKscore={setKscoreTrigger} triggerMyList={setMyListTrigger} />
        </div>

        <Invite userInfo={userInfo} rewardBlindbox={onSaleBlindbox} blindboxConfig={blindboxConfig} triggerMyList={setMyListTrigger} />
      </div>
        
      <div className="w-full flex-shrink-0 bg-[#090909] py-6 relative z-1 mt-12">
        <div className="max-w-[1920px] mx-auto px-5 lg:px-18 2xl:px-24">
          <Footer />
        </div>
      </div>
    </main>
  );
}