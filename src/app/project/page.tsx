"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import { getUrlParamsByName } from "@/utils/url";
import { getCurSeasonReward, getILEData } from "@/services/apis/app";
import { useErrCode } from "@/datas/errCode";
import Button from "@/components/ui/Button";
import { formatNumberWithCommas } from "@/utils/number";
import { formatDatetime } from "@/utils/time";
import { bindTgAccount, checkMissionProcess, getMissionConfig, getMissionProcess } from "@/services/apis/mission";
import { claim, getILEState } from "@/services/apis/app";
import { toast } from "react-toastify";

export default function ProductPage() {
  const t = useTranslations();
  const [projectData, setProjectData] = useState<any>(null);
  const [ileData, setIleData] = useState<any>(null);
  const [ileDataLoading, setIleDataLoading] = useState<boolean>(true);
  const [missionConfig, setMissionConfig] = useState<any>(null);
  const [missionConfigLoading, setMissionConfigLoading] = useState<boolean>(true);
  const [missionProcess, setMissionProcess] = useState<any>(null);
  const [missionProcessLoading, setMissionProcessLoading] = useState<boolean>(true);
  const [curProcessIdx, setCurProcessIdx] = useState<number>(0);
  const [checkingMission, setCheckingMission] = useState<boolean>(false);
  const [claimLoading, setClaimLoading] = useState<boolean>(false);
  const [ileState, setIleState] = useState<number>(0);
  const [curSeasonReward, setCurSeasonReward] = useState<string>('');

  const { errCodeHandler } = useErrCode();

  const { appData, configData, userInfo, triggerModalOpen } = useAppContext();

  const checkMissionTimeout = useRef<any>(null);
  const bindTgAccountTimeout = useRef<any>(null);

  const handleGetILEData = async () => {
    const id = getUrlParamsByName('id');
    await getILEData(id)
    .then((res) => {
      const data = res?.data
      if(data.status == 10000) {
        if(data.data.length) {
          setIleData(data.data[0]);
        }
      }
      else {
        errCodeHandler(data.status);
      }
    })

    setIleDataLoading(false);
  }

  const handleGetMissionConfig = async () => {
    const id = getUrlParamsByName('id');
    await getMissionConfig(id)
    .then((res) => {
      const data = res?.data
      if(data.status == 10000) {
        let temp:any[] = [];
        Object.keys(data.data).map((key) => {
          temp.push(data.data[key]);
        })
        const sortArr = temp.sort((a: any, b: any) => {
          return a.id - b.id;
        })
        setMissionConfig(sortArr);
      }
      else {
        errCodeHandler(data.status);
      }
    })

    setMissionConfigLoading(false);
  }

  const handleGetMissionProcess = async() => {
    const uid = await localStorage.getItem('kkGuid');
    if(uid) {
      const projectId = getUrlParamsByName('id');
      await getMissionProcess(projectId, uid)
      .then((res) => {
        const data = res?.data
        if(data.status == 10000) {
          let temp:any[] = [];
          Object.keys(data.data).map((key) => {
            temp.push(data.data[key]);
          })
          const sortArr = temp.sort((a: any, b: any) => {
            return a.id - b.id;
          })
          setMissionProcess(sortArr);

          let tempCompletedIdx = 0;
          sortArr.map((item: any, idx: number) => {
            if(item.status == 2) {
              tempCompletedIdx = idx + 1;
            }
          })

          setCurProcessIdx(tempCompletedIdx);
        }
        else {
          errCodeHandler(data.status);
        }
      })
    }
    setMissionProcessLoading(false);
  }

  const handleToTask = (task:any) => {
    if(task.taskType == 'MTBindTG') {
      handleBindTg(task.id);
    }
    else if(task.taskParam) {
      window.open(task.taskParam, '_blank');
      setTimeout(() => {
        setCheckingMission(true);
        handleCheckMissionProcess(task.id);
      }, 5000);
    }
  }

  const handleBindTg = async(missionId: string, tempToken = '', count = 0) => {
    await bindTgAccount(tempToken)
    .then(async(res) => {
      const data = res?.data;
      if(data.status == 10000 && data?.data.botUrl) {
        window.open(data?.data.botUrl, '_blank');
        bindTgAccountTimeout.current = setTimeout(() => {
          handleBindTg(missionId, data?.data.webLoginToken, count + 1);
        }, 5000);
      }
      else if(data?.data?.account) {
        clearTimeout(bindTgAccountTimeout.current);
        bindTgAccountTimeout.current = null;
        handleCheckMissionProcess(missionId);
      }
      else if(count < 10) {
        bindTgAccountTimeout.current = setTimeout(() => {
          handleBindTg(missionId, tempToken, count + 1);
        }, 5000);
      }
      else {
        clearTimeout(bindTgAccountTimeout.current);
        bindTgAccountTimeout.current = null;
      }
    })
  }

  const handleCheckMissionProcess = async(missionId: string, count: number = 0) => {
    const projectId = getUrlParamsByName('id');
    let reCheck = true;

    await checkMissionProcess(projectId, missionId)
    .then((res) => {
      const data = res?.data
      if(data.status == 10000) {
        if(data.data.status == 2) {
          reCheck = false;
          handleGetMissionProcess();
          setCheckingMission(false);
        }
      }
      else {
        errCodeHandler(data.status);
      }
    })

    if(reCheck) {
      if(count < 12) {
        const delay = count > 6 ? 10000 : 5000;
        setTimeout(() => {
          handleCheckMissionProcess(missionId, count + 1);
        }, delay);
      }
    }
    else {
      clearTimeout(checkMissionTimeout.current);
      checkMissionTimeout.current = null;
    }
  }

  const handleClaim = async() => {
    const id = getUrlParamsByName('id');
    setClaimLoading(true);
    await claim(id, ileData?.season)
    .then((res) => {
      const data = res?.data
      if(data.status == 10000) {
        setIleState(2);
        toast.success(t('project.claimSuccess'));
      }
      else {
        errCodeHandler(data.status);
      }
    })
    setClaimLoading(false);
  }

  const handleGetILEState = async() => {
    const id = getUrlParamsByName('id');
    await getILEState(id, ileData?.season)
    .then((res) => {
      const data = res?.data
      if(data.status == 10000) {
        setIleState(1);
      }
      else if(data.status == 30022) {
        setIleState(2);
      }
      else {
        errCodeHandler(data.status);
      }
    })
  }

  const handleGetCurSeasonReward = async() => {
    const id = getUrlParamsByName('id');
    await getCurSeasonReward(id)
    .then((res) => {
      const data = res?.data
      if(data.status == 10000) {
        setCurSeasonReward(data.data);
      }
      else {
        errCodeHandler(data.status);
      }
    })
  }

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

  useEffect(() => {
    if(projectData?.process == 'launch') {
      handleGetILEData();
    }
  }, [projectData]);

  useEffect(() => {
    if(userInfo && projectData?.process == 'launch') {
      handleGetILEData();
      handleGetMissionConfig();
      handleGetMissionProcess();

      if(userInfo?.tgAccount) {
        handleGetCurSeasonReward();
      }
    }
  }, [projectData, userInfo]);

  useEffect(() => {
    if(missionConfig && ileData) {
      if(curProcessIdx == missionConfig.length) {
        handleGetILEState();
      }
    }
  }, [ileData, curProcessIdx, missionConfig]);

  useEffect(() => {
    return () => {
      clearTimeout(checkMissionTimeout.current);
      checkMissionTimeout.current = null;

      clearTimeout(bindTgAccountTimeout.current);
      bindTgAccountTimeout.current = null;
    }
  }, []);

  return (
    <main className="min-h-screen overflow-hidden">
      {projectData == null ? (
        <div className="relative pb-12">
          <div className="h-[150px] md:h-[180px] lg:h-auto relative">
            <img className="w-full h-full md:h-auto object-cover" src="/images/app_top_banner.png" />
            <div className="absolute top-0 left-0 w-full h-full flex items-center px-3 lg:px-18 2xl:px-24 leading-[1.1]">
              <div className="font-ethnocentric-rg pt-10 md:pt-12 text-center xl:text-left text-[18px] lg:text-[42px] 2xl:text-[60px] w-full xl:w-[480px] 2xl:w-[680px]">
                {t('explore.title')}
              </div>
            </div>
          </div>
          <div className="max-w-[1920px] mx-auto relative z-1">
            <div className="px-5 lg:px-18 2xl:px-24 mt-10 md:mt-20">
              <div className="bg-black/50 rounded-[20px] overflow-hidden">
                <div className="flex flex-wrap">
                  <div className="relative md:-left-3 md:-top-5 w-full md:w-[480px] xl:w-[520px] 2xl:w-[560px] bg-black rounded-[20px] overflow-hidden">
                    <div className="w-full aspect-[16/9] animate-pulse bg-gray-500/50 rounded-[20px]"></div>
                    <div className="px-8 py-6">
                      <div className="animate-pulse bg-gray-500/50 rounded-[20px] h-10 relative"></div>
                      <div className="mt-5 flex items-center justify-center md:justify-end">
                        <div className="animate-pulse bg-gray-500/50 rounded-[10px] h-11 w-11 mx-2 md:mx-4"></div>
                        <div className="animate-pulse bg-gray-500/50 rounded-[10px] h-11 w-11 mx-2 md:mx-4"></div>
                        <div className="animate-pulse bg-gray-500/50 rounded-[10px] h-11 w-11 mx-2 md:mx-4"></div>
                        <div className="animate-pulse bg-gray-500/50 rounded-[10px] h-11 w-11 mx-2 md:mx-4"></div>
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
            <div className="h-[150px] md:h-[180px] lg:h-auto relative">
              <img className="w-full h-full md:h-auto object-cover" src="/images/app_top_banner.png" />
              <div className="absolute top-0 left-0 w-full h-full flex items-center px-3 lg:px-18 2xl:px-24 leading-[1.1]">
                <div className="font-ethnocentric-rg pt-10 md:pt-12 text-center xl:text-left text-[18px] lg:text-[42px] 2xl:text-[60px] w-full xl:w-[480px] 2xl:w-[680px]">
                  {t('explore.title')}
                </div>
              </div>
            </div>

            <div className="px-5 lg:px-18 2xl:px-24 mt-10 md:mt-20">
              <div className="bg-black/50 rounded-[20px]">
                <div className="flex flex-wrap">
                  <div className="relative md:-left-3 md:-top-5 w-full md:w-[480px] xl:w-[520px] 2xl:w-[560px] bg-black rounded-[20px] overflow-hidden">
                    {configData && <img className="w-full" src={configData.cdn + projectData.banner} />}
                    <div className="px-8 py-6">
                      <div className="flex items-center">
                        {ileData && <>
                          <div className="flex-1 bg-[#5125B4] rounded-full h-10 relative">
                            <img className="h-18 absolute -top-3" style={{left: Math.floor(ileData.claimedAmount / ileData.allAmount)}} src="/images/icon_attentionPoints.png" />
                          </div>
                          <div className="min-w-[100px] w-[15%] text-center text-[20px] text-white">{Math.floor(ileData.claimedAmount / ileData.allAmount * 10000) / 100}%</div>
                        </>}
                        {projectData.process == 'upcoming' && <div className="text-[#A1FF73] text-[20px] md:text-[30px]">{t('explore.upcoming')}...</div>}
                      </div>
                      <div className="mt-5 flex items-center justify-center md:justify-end">
                        {Object.keys(projectData.social).map((key) => (
                          <div key={key}>{
                            projectData.social[key] && <a className="block opacity-60 hover:opacity-100 mx-2 md:mx-3" href={projectData.social[key]} target="_blank">
                              {key.indexOf('tg') >= 0 && <img loading="lazy" className="w-9 md:w-11" src="/images/social/tg.png" alt="tg" />}
                              {key.indexOf('twitter') >= 0 && <img loading="lazy" className="w-9 md:w-11" src="/images/social/x.png" alt="x" />}
                              {key.indexOf('youtube') >= 0 && <img loading="lazy" className="w-9 md:w-11" src="/images/social/youtube.png" alt="youtube" />}
                              {key.indexOf('discord') >= 0 && <img loading="lazy" className="w-9 md:w-11" src="/images/social/discord.png" alt="discord" />}
                              {key.indexOf('ins') >= 0 && <img loading="lazy" className="w-9 md:w-11" src="/images/social/ins.png" alt="github" />}
                            </a>
                          }</div>
                        ))}
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
                            <div key={tagIdx} className={"text-[12px] mr-2 md:text-[14px] px-4 py-[6px] rounded-full capitalize " + (tagIdx % 2 == 0 ? "bg-[#452C7A]" : "bg-[#6D4F0E]")}>{name}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-[#A6A6A6] text-lg" dangerouslySetInnerHTML={{__html: projectData.desc}}></div>
                  </div>
                </div>

                {projectData != null && projectData?.process == 'launch' && (
                  <div className="bg-black mt-9 py-9 rounded-b-[20px] overflow-hidden">
                    <div className="mx-6 md:mx-12 px-3 md:px-8 py-3 md:py-6">
                      { (ileDataLoading || ileData) &&<div className="text-[22px] md:text-[30px] text-[#8D73FF] text-center border-b border-[#8D73FF] pb-2">
                        {t('project.totalAmount')}
                      </div>
                      }
                      { ileDataLoading ?
                      <div className="">
                        <div className="mt-12 flex justify-center">
                          <div className="animate-pulse bg-gray-500/50 rounded-[10px] h-11 w-2/3 lg:w-[800px]"></div>
                        </div>
                        <div className="mt-6 flex justify-center">
                          <div className="animate-pulse bg-gray-500/50 rounded-[10px] h-8 w-[300px] lg:w-[500px]"></div>
                        </div>
                      </div>
                      :
                      <>
                      {ileData && (
                      <div className="">
                        <div className="mt-8 flex flex-wrap justify-center items-center">
                          <div className="w-full md:w-auto text-center">
                            <img className="w-16 md:w-21 mr-2 inline-block" src="/images/icon_kkAppToke.png" />
                          </div>
                          <div className="flex flex-wrap items-end text-[#F2CA9E]">
                            <div className="w-full md:w-auto text-center text-[22px] md:text-[50px] md:leading-1">
                              {formatNumberWithCommas(ileData.claimedAmount)} / {formatNumberWithCommas(ileData.allAmount)}
                            </div>
                            <div className="w-full md:w-auto text-center text-[18px] md:text-[30px] md:leading-1 ml-1 relative top-1">({Math.floor(ileData.claimedAmount / ileData.allAmount * 10000) / 100}%)</div>
                          </div>
                        </div>
                        <div className="mt-3 text-center text-[#736357] md:text-[20px]">
                          {ileData.start > 0 && <span>{formatDatetime(ileData.start)}</span>}
                          {ileData.start > 0 && ileData.end > 0 && <span> - </span>}
                          {ileData.end > 0 && <span>{formatDatetime(ileData.end)}</span>}
                        </div>
                      </div>
                      )}
                      </>
                      }        
                    </div>

                    {userInfo != null ? 
                      <div className="mt-6 md:mt-12 px-6 md:px-12">
                        { (missionConfigLoading || missionConfig) &&<div className="inline font-ethnocentric-rg uppercase text-[22px] md:text-[30px] text-white text-center border-b border-[#FEBD32] pb-2">
                          {t('project.task')}
                        </div>
                        }
                        {missionConfigLoading ?
                          <div className="mt-9">
                            <div className="animate-pulse bg-gray-500/50 rounded-[10px] h-9 w-full"></div>
                            <div className="mt-3 animate-pulse bg-gray-500/50 rounded-[10px] h-9 w-full"></div>
                            <div className="mt-3 animate-pulse bg-gray-500/50 rounded-[10px] h-9 w-full"></div>
                            <div className="mt-3 animate-pulse bg-gray-500/50 rounded-[10px] h-9 w-full"></div>
                          </div>
                          :
                          <div className="mt-9">
                            <div className="md:px-6">
                              {missionConfig != null && missionConfig.map((item:any, idx:number) => (
                                <div key={idx} className="mt-6 flex flex-wrap justify-between items-center border-b border-[#38334a] pb-1 md:pb-0">
                                  <div className="w-full md:w-auto md:flex-1 flex items-center md:pb-1 text-[#DDD5FF] text-[18px] md:text-[24px] pb-1 md:pb-0">
                                    <div className={"flex-1 " + (curProcessIdx > idx ? 'text-[#96C03C]' : 'text-[#DDD5FF]')}>{item.desc}</div>
                                  </div> 
                                  {!missionProcessLoading && <div className="w-full md:w-36 md:pl-6 text-right pb-1">
                                    {curProcessIdx == idx && 
                                      <Button className="text-lg font-light text-white w-18 md:w-26 text-center py-1" onClick={() => handleToTask(item)}>
                                        {checkingMission && <span className="animate-spin mr-2 w-4 h-4 border-[3px]"></span>}
                                        <span>{t('project.go')}</span>
                                      </Button>
                                    }
                                    {curProcessIdx < idx && 
                                      <div className="inline-block text-lg font-light text-white w-18 md:w-26 text-center py-1 cursor-not-allowed opacity-50 rounded-lg bg-[#6e4cfe]">
                                        {t('project.go')}
                                      </div>
                                    }
                                    {curProcessIdx > idx && 
                                      <div className="text-xl font-light text-white/60 w-full flex items-center justify-end py-1">
                                        <svg className="rounded-xl" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3156" width="32" height="32"><path d="M859.115184 62.365396 161.97658 62.365396c-54.775534 0-99.590206 44.814672-99.590206 99.590206l0 697.139627c0 54.781674 44.814672 99.590206 99.590206 99.590206l697.138604 0c54.781674 0 99.590206-44.808532 99.590206-99.590206L958.70539 161.955602C958.70539 107.180068 913.896858 62.365396 859.115184 62.365396L859.115184 62.365396zM410.957211 759.505024l-248.980631-248.980631 69.710688-69.706595 179.269943 179.269943 378.452401-378.453425 69.705572 69.711711L410.957211 759.505024 410.957211 759.505024zM410.957211 759.505024" fill="#affe30" p-id="3157"></path></svg>
                                      </div>
                                    }
                                  </div>
                                  }
                                </div>
                              ))}
                            </div>
                            {missionConfig != null && 
                              <div className="mt-6 flex items-center rounded-[20px] overflow-hidden">
                                <div className="bg-[#240E46] w-40 md:w-80 h-24 flex justify-center items-center">
                                  <div className="text-center">
                                    <div className="font-ethnocentric-rg text-[14px] md:text-[26px] text-[#F2CA9E]">
                                      {t('project.taskBonus')}
                                    </div>
                                    <div className="text-[12px] md:text-[18px] text-[#8D73FF]">
                                      {t('project.taskBonusDesc')}
                                    </div>
                                  </div>
                                </div>
                                <div className="w-0 h-0 border-r-transparent border-r-[48px] border-t-[#240E46] border-t-[96px]"></div>
                                <div className="flex-1 flex flex-wrap justify-end items-center">
                                  {userInfo?.tgAccount ?  
                                  <div className="w-full md:w-auto flex items-center justify-center mr-6 mb-3 md:mb-0">
                                    <img className="w-10 md:w-14 mr-2 inline-block" src="/images/icon_kkAppToke.png" />
                                    <span className="text-[14px] md:text-[26px] text-[#F2CA9E]">{curSeasonReward}</span>    
                                  </div>
                                  :
                                  <div className="text-[12px] md:text-[18px] text-[#8D73FF]">{t('project.bindTgHint')}</div>
                                  }
                                  <div className="w-full md:w-auto min-w-40">
                                    {curProcessIdx < missionConfig.length ?
                                    <div className="text-center">
                                      <div className="flex justify-center items-end text-[#8D73FF]">
                                        <span className="text-2xl text-[#affe30]">{curProcessIdx}</span>
                                        <span className="mx-[2px]"> / </span>
                                        <span>{missionConfig.length}</span>
                                      </div>
                                      <div className="text-sm text-[#8D73FF]">{t('project.accomplished')}</div>
                                    </div>
                                    :
                                    <>
                                    {ileState == 1 &&
                                      <Button className="text-xl font-light text-white w-30 md:w-40 text-center py-2 md:py-3" onClick={() => handleClaim()}>
                                        {claimLoading && <span className="animate-spin mr-2 w-4 h-4 border-3"></span>}
                                        <span>{t('project.claim')}</span>
                                      </Button>
                                    }
                                    {ileState == 2 &&
                                      <div className="flex justify-center items-center">
                                        <svg className="inline-block" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6494" width="36" height="36"><path d="M731.733333 294.4L450.133333 631.466667l-134.4-134.4-53.333333 53.333333 194.133333 194.133333L789.333333 345.6l-57.6-51.2zM512 992C247.466667 992 32 776.533333 32 512S247.466667 32 512 32 992 247.466667 992 512 776.533333 992 512 992z" p-id="6495" fill="#636363"></path></svg>
                                        <span className="ml-2 text-[20px] md:text-[28px] text-[#636363]">{t('project.claimed')}</span>
                                      </div>
                                    }
                                    </>
                                    }
                                  </div>
                                </div>
                              </div>
                            }
                          </div>
                        }
                      </div>
                      :
                      <div className="py-12 flex justify-center">
                        <Button className="text-xl font-light text-white w-40 md:w-60 text-center py-3 md:py-4" onClick={() => triggerModalOpen()}>
                          {t('menu.login')}
                        </Button>
                      </div>
                    }
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
        
      <div className="bg-[#090909] py-6">
        <div className="max-w-[1920px] mx-auto px-5 lg:px-18 2xl:px-24">
          <Footer />
        </div>
      </div>
    </main>
  );
}