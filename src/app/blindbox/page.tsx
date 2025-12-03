"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { getBlindboxConfig } from "@/services/apis/blindbox";

import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import Button from "@/components/ui/Button";
import { useErrCode } from "@/datas/errCode";
import { getKScore, getUserInfo } from "@/services/apis/user";
import BlindboxList from "@/components/Blindbox/BlindboxList";
import MysteryShop from "@/components/Blindbox/MysteryShop";
import PopularTask from "@/components/Blindbox/PopularTask";
import LooteryRecord from "@/components/Blindbox/LotteryRecord";
import { getNFTData } from "@/services/apis/nft";

export default function Blindbox() {
  const t = useTranslations();

  const { configData, userInfo, handleSetUserInfo, triggerModalOpen } = useAppContext();
  const [addr, setAddr] = useState<string>('');
  const [lotteryRecordOpen, setLotteryRecordOpen] = useState<boolean>(false);

  const [blindboxConfig, setBlindboxConfig] = useState<any>(null);
  const [onSaleBlindbox, setOnSaleBlindbox] = useState<any>(null);
  const [boxConfigLoading, setBoxConfigLoading] = useState<boolean>(true);
  const [NftData, setNftData] = useState<any>(null);

  const [myListTrigger, setMyListTrigger] = useState<number>(0);
  const [kscoreTrigger, setKscoreTrigger] = useState<number>(0);
  const [taskStatusTrigger, setTaskStatusTrigger] = useState<number>(0);

  const { errCodeHandler } = useErrCode();

  const historyRef = useRef<any>(null);

  const handleGetUserInfo = async() => {
    await getUserInfo().then((res) => {
      const data = res?.data;
      if(data.status == 10000) {
        handleSetUserInfo(data?.data);
      }
      else {
        errCodeHandler(data.status, data.msg)
      }
    })
  }

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

  useEffect(() => {
    if(!userInfo) {
      setAddr('');
    }
  }, [userInfo])

  useEffect(() => {
    handleGetConfig();
    handleGetNftData();

    const addr = localStorage.getItem('kkAddress');
    if(addr) {
      handleGetUserInfo();
    }
    setAddr(addr || '');
  }, [])

  return (
    <main className="blindbox-page min-h-screen overflow-hidden relative">
      <div className="max-w-[1920px] mx-auto relative px-5 lg:px-18 2xl:px-24 pt-28 pb-20">
        <div className="animate__fadeInUp md:animate__animated text-[17px] lg:text-[30px] font-ethnocentric-rg text-white leading-tight">
          <div className="mx-auto inline-block border-b border-[#FEBD32]">{t('blindbox.title')}</div>
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
          <MysteryShop userInfo={userInfo} onSaleBlindbox={onSaleBlindbox} kscoreTrigger={kscoreTrigger} triggerMyList={setMyListTrigger} />
          <PopularTask userInfo={userInfo} blindboxConfig={blindboxConfig} taskStatusTrigger={taskStatusTrigger} triggerKscore={setKscoreTrigger} triggerMyList={setMyListTrigger} />
        </div>
      </div>
        
      <div className="w-full flex-shrink-0 bg-[#090909] py-6 relative z-1 mt-12">
        <div className="max-w-[1920px] mx-auto px-5 lg:px-18 2xl:px-24">
          <Footer />
        </div>
      </div>

      <div className=""></div>
    </main>
  );
}