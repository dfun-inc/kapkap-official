"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Modal from "react-modal";

import { useAppContext } from "@/context/AppContext";
import Button from "@/components/ui/Button";
import { useErrCode } from "@/datas/errCode";
import { getKScore, getUserInfo } from "@/services/apis/user";
import { getUrlParamsByName } from "@/utils/url";
import { checkMissionProcess, claimMissionReward, getMissionConfig, getMissionProcess } from "@/services/apis/mission";

type Props = {
  userInfo: any;
  blindboxConfig: any;
  triggerMyList: (val: number) => void;
  triggerKscore: (val: number) => void;
};
export default function PopularTask({ userInfo, blindboxConfig, triggerMyList, triggerKscore }: Props) {
  const t = useTranslations();

  const { triggerModalOpen } = useAppContext();
  const [addr, setAddr] = useState<string>('');
  const [taskCheckIds, setTaskCheckIds] = useState<number[]>([]);
  const [taskClaimIds, setTaskClaimIds] = useState<number[]>([]);

  const [missionConfig, setMissionConfig] = useState<any>(null);
  const [missionConfigList, setMissionConfigList] = useState<any[]>([]);
  const [missionConfigLoading, setMissionConfigLoading] = useState<boolean>(true);
  const [missionProcess, setMissionProcess] = useState<any>(null);
  const [missionProcessLoading, setMissionProcessLoading] = useState<boolean>(true);
  const [checkingMission, setCheckingMission] = useState<boolean>(false);

  const checkMissionTimeout = useRef<any>(null);

  const { errCodeHandler } = useErrCode();

  const projectId = '99999';

  const handleGetMissionConfig = async () => {
    setMissionConfigLoading(true);
    await getMissionConfig(projectId)
    .then((res) => {
      const data = res?.data
      if(data.status == 10000) {
        setMissionConfig(data.data);
      }
      else {
        errCodeHandler(data.status);
      }
    })

    setMissionConfigLoading(false);
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
    setMissionProcessLoading(false);
  }

  const handleToTask = (task:any) => {
    if(taskCheckIds.includes(Number(task.id))) {
      return;
    }
    setTaskCheckIds([...taskCheckIds, Number(task.id)]);
    if(task.taskParam) {
      window.open(task.taskParam, '_blank');
      setTimeout(() => {
        handleCheckMissionProcess(task.id);
      }, 3000);
    }
    else {
      setTimeout(() => {
        handleCheckMissionProcess(task.id);
      }, 3000);
    }
  }

  const handleCheckMissionProcess = async(missionId: string, count: number = 0) => {
    let reCheck = true;

    await checkMissionProcess(projectId, missionId)
    .then((res) => {
      const data = res?.data
      if(data.status == 10000) {
        if(data.data.status == 2) {
          reCheck = false;
          setTaskCheckIds(taskCheckIds.filter((id) => id !== Number(missionId)));
          handleGetMissionProcess();
        }
      }
      else {
        errCodeHandler(data.status);
      }
    })

    if(reCheck) {
      if(count < 10) {
        const delay = count > 5 ? 10000 : 5000;
        checkMissionTimeout.current = setTimeout(() => {
          handleCheckMissionProcess(missionId, count + 1);
        }, delay);
      }
    }
    else {
      clearTimeout(checkMissionTimeout.current);
      checkMissionTimeout.current = null;
    }
  }

  const handleClaimReward = async(task:any) => {
    if(taskClaimIds.includes(Number(task.id))) {
      return;
    }
    setTaskClaimIds([...taskClaimIds, Number(task.id)]);
    await claimMissionReward(projectId, task.id)
    .then((res) => {
      const data = res?.data
      if(data.status == 10000) {
        handleGetMissionProcess();
        triggerMyList(Date.now())
        triggerKscore(Date.now())
      }
      else {
        errCodeHandler(data.status);
      }
    })
    setTaskClaimIds(taskClaimIds.filter((id) => id !== Number(task.id)));
  }

  useEffect(() => {
    if(missionConfig && blindboxConfig) {
      let temp:any[] = [];
      Object.keys(missionConfig).map((key) => {
        temp.push({
          reward: blindboxConfig[missionConfig[key]['rewardItem']],
          ...missionConfig[key]
        });
      })
      const sortArr = temp.sort((a: any, b: any) => {
        return a.id - b.id;
      })
      setMissionConfigList(sortArr);
    }
  }, [missionConfig, blindboxConfig])

  useEffect(() => {
    if(userInfo) {
      handleGetMissionConfig();
      handleGetMissionProcess();
    }
    else {
      setAddr('');
    }
  }, [userInfo])

  useEffect(() => {
    const addr = localStorage.getItem('kkAddress');
    setAddr(addr || '');

    return () => {
      clearTimeout(checkMissionTimeout.current);
      checkMissionTimeout.current = null;
    }
  }, [])

  return (
    <div className="w-full md:w-auto md:flex-1 p-7 bg-black rounded-[20px] mt-9 md:mt-0">
      <div className="text-[20px] md:text-[22px] 2xl:text-[24px] font-ethnocentric-rg text-[#FEBD32] uppercase pb-6 px-3 border-b border-[#FEBD32]">{t('blindbox.popularTask')}</div>
      <div className="mt-3 md:px-2">
        {addr || userInfo ?
          missionConfigLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="animate-pulse w-full flex flex-wrap items-center justify-between py-2 mt-2">
                <div className="w-full md:w-auto md:flex-1 rounded-lg h-5 bg-gray-500 mb-3 md:mb-0"></div>
                <div className="md:mx-6 w-15 h-10 rounded-lg bg-gray-500"></div>
                <div className="w-34 h-10 rounded-lg bg-gray-500"></div>
              </div>
            ))
          ) : (
            missionConfigList?.map((item, index) => (
              <div key={index} className="w-full flex flex-wrap items-center justify-between py-2 my-2 md:my-0 border-b border-[#4C4081] md:border-b-[0px]">
                <div className="w-full md:w-auto md:flex-1 text-[#DDD5FF] py-2 md:border-b md:border-[#4C4081] text-[20px]">{item.desc}</div>
                <div className="md:mx-9 flex items-center">
                  <div className="w-15 h-15 flex items-center justify-center">
                    {item.reward?.type == 'asset' ? 
                      <img className="h-14 block" src="/images/kscore.png" />
                      :
                      <img className="h-14 block rounded-lg" src={'/images/blindbox/' + item.reward?.img + '.jpg'} alt="" />
                    }
                  </div>
                  <div className="font-univia-pro-bold text-[30px] ml-2 text-white">x{item.rewardValue}</div>
                </div>
                {!missionProcessLoading && 
                  <div className="w-34">
                    {missionProcess?.[item.id]?.status == 1 && 
                      <Button className="text-lg font-light text-white text-center py-2" fullWidth={true} onClick={() => handleToTask(item)}>
                        {taskCheckIds.includes(Number(item.id)) && <span className="animate-spin mr-2 w-4 h-4 border-[3px]"></span>}
                        <span>{t('blindbox.toComplete')}</span>
                      </Button>
                    }
                    {missionProcess?.[item.id]?.status == 2 && 
                      <Button className="text-lg font-light text-white text-center py-2" fullWidth={true} onClick={() => handleClaimReward(item)}>
                        {taskClaimIds.includes(Number(item.id)) && <span className="animate-spin mr-2 w-4 h-4 border-[3px]"></span>}
                        <span>{t('blindbox.claim')}</span>
                      </Button>
                    }
                    {missionProcess?.[item.id]?.status == 0 && 
                      <div className="text-center"> {t('blindbox.completed')}</div>
                    }
                  </div>
                }
              </div>
            )))
          :
          <div className="py-12 flex justify-center">
            <Button className="text-lg font-light text-white text-center py-2 w-34" onClick={() => triggerModalOpen()}>
              <span>{t('menu.login')}</span>
            </Button>
          </div>
        }
      </div>
    </div>
  );
}