'use client';

import { useTranslations } from "next-intl";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import Modal from "react-modal";
import Button from "@/components/ui/Button";
import { useAppContext } from "@/context/AppContext";
import { useErrCode } from "@/datas/errCode";
import { claimMissionReward, getMissionConfig, getMissionProcess } from "@/services/apis/mission";
import eventBus from "@/utils/eventBus";
import { getBlindboxConfig } from "@/services/apis/blindbox";
import { toast } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";

export default function DailyCheckIn() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const [showModal, setShowModal] = useState<boolean>(false);
  const { userInfo } = useAppContext();
  const [checkInMission, setCheckInMission] = useState<any>(null);
  const [missionProcess, setMissionProcess] = useState<any>(null);
  const [claimLoading, setClaimLoading] = useState<boolean>(false);
  const [blindboxConfig, setBlindboxConfig] = useState<any>(null);

  const { errCodeHandler } = useErrCode();

  const projectId = '99999';

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
      }
      else {
        errCodeHandler(data.status, data.msg)
      }
    })
  }

  const handleGetMissionConfig = async () => {
    await getMissionConfig(projectId)
    .then((res) => {
      const data = res?.data
      if(data.status == 10000) {
        Object.keys(data.data).map((key) => {
          if(data.data[key].taskType?.toLowerCase().indexOf('checkin') >= 0) {
            setCheckInMission(data.data[key]);
          }
        })
      }
      else {
        errCodeHandler(data.status);
      }
    })
  }

  const handleGetMissionProcess = async() => {
    await getMissionProcess(projectId, userInfo?.guid)
    .then((res) => {
      const data = res?.data
      if(data.status == 10000) {
        setMissionProcess(data.data);
      }
      else {
        errCodeHandler(data.status);
      }
    })
  }

  const handleClaimReward = async(task:any) => {
    if(claimLoading) {
      return;
    }
    setClaimLoading(true);
    await claimMissionReward(projectId, checkInMission?.id)
    .then((res) => {
      const data = res?.data
      if(data.status == 10000) {
        toast.success(t('dailyCheckIn.claimSuccess'));
        setClaimLoading(false);
        setShowModal(false);
        eventBus.dispatchEvent(new CustomEvent("updateMysteryBoxList"));
        if (pathname !== "/mysteryBox") {
          setTimeout(() => {
            router.push('/mysteryBox');
          }, 500);
        }
      }
      else {
        errCodeHandler(data.status);
      }
    })
    
    setClaimLoading(false);
  }
  

  useEffect(() => {
    if(userInfo) {
      handleGetConfig();
      handleGetMissionConfig();
      handleGetMissionProcess();
    }
    else {
      setCheckInMission(null);
      setMissionProcess(null);
    }
  }, [userInfo])

  useEffect(() => {
    if(checkInMission && missionProcess && missionProcess?.[checkInMission.id]) {
      if(missionProcess?.[checkInMission.id]?.status != 0) {
        setShowModal(true);
      }
    }
  }, [checkInMission, missionProcess])

  return (
    <Modal
      isOpen={showModal}
      onRequestClose={() => setShowModal(false)}
      shouldCloseOnOverlayClick={true}
      preventScroll={true}
      className="w-9/10! lg:w-[440px]!"
      >
      <div className="w-full bg-[#101014] rounded-[20px] overflow-hidden">
        <div className="p-6 relative bg-[#201e2a]">
            <div className="text-[20px] md:text-[24px] font-ethnocentric-rg text-[#FEBD32] text-center uppercase">{t('dailyCheckIn.title')}</div>
            <button className="cursor-pointer hover:opacity-80 absolute top-1/2 right-6 -translate-y-1/2" onClick={() => setShowModal(false)}>
              <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="30" height="30"><path d="M431.559111 512L149.959111 230.4a56.888889 56.888889 0 0 1 80.440889-80.440889L512 431.559111l281.6-281.6a56.888889 56.888889 0 0 1 80.440889 80.440889L592.440889 512l281.6 281.6a56.888889 56.888889 0 1 1-80.440889 80.440889L512 592.440889 230.4 874.040889a56.888889 56.888889 0 1 1-80.440889-80.440889L431.559111 512z" fill="#ffffff"></path></svg>
            </button>
          </div>
          <div className="p-6">
            <div className="text-[#8A84A3] text-[14px] md:text-[20px] text-center">{t('dailyCheckIn.desc')}</div>
            {blindboxConfig != null && checkInMission != null && 
              <img className="w-1/2 block rounded-lg mx-auto rounded-[10px] my-6" src={'/images/blindbox/' + blindboxConfig[checkInMission?.rewardItem]?.img + '.jpg'} alt="" />}
          </div>
          <div className="px-12 py-5 mt-6 bg-[#1d1b27]">
            <Button className="text-[24px] text-[30px] py-3 md:py-5 capitalize flex items-center justify-center" 
              fullWidth={true} onClick={handleClaimReward}>
              <span className="mr-2">{t('dailyCheckIn.claim')}</span>
              {claimLoading && <span className="w-5 h-5 border-[3px] border-white animate-spin ml-2"></span>}
            </Button>
          </div>
      </div>
    </Modal>
  )
}