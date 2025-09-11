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
import Tag from "@/components/Project/Tag";

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
    setCheckingMission(true);
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
        setCheckingMission(false);
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
        setCheckingMission(false);
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
          if(missionConfig[curProcessIdx]?.taskType == 'MTBindTG') {
            handleGetCurSeasonReward();
          }
          setCheckingMission(false);
          handleGetMissionProcess();
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
                  <div className="relative md:-left-4 md:-top-6 w-full md:w-[480px] xl:w-[520px] 2xl:w-[560px] bg-black rounded-[20px] overflow-hidden">
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
                        <div className="animate-pulse bg-gray-500/50 rounded-[10px] h-[30px] w-[120px]"></div>
                        <div className="animate-pulse bg-gray-500/50 rounded-[10px] h-[24px] w-[120px] mt-2"></div>
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
                  <div className="relative md:-left-4 md:-top-6 w-full md:w-[480px] xl:w-[520px] 2xl:w-[560px] bg-black rounded-[20px] overflow-hidden">
                    {configData && <img className="w-full" src={configData.cdn + projectData.banner} />}
                    <div className="px-8 py-6">
                      {ileData && <>
                        <div className="bg-[#210D40] rounded-full h-10 relative p-[3px] flex justify-end items-center">
                          <img className="h-18 absolute -top-3 left-0 z-2" src="/images/icon_launch.png" />
                          <div className="h-[34px] top-[3px] left-[3px] absolute rounded-full bg-[#5125B4] z-0" style={{"width": (Math.floor(ileData.claimedAmount / ileData.allAmount) * 100) + '%'}}></div>
                          <div className="text-[20px] text-white pr-6 relative z-1">{Math.floor(ileData.claimedAmount / ileData.allAmount * 10000) / 100}%</div>
                        </div>
                      </>}
                      {projectData.process == 'upcoming' && <div className="text-[#A1FF73] text-[20px] md:text-[30px]">{t('explore.upcoming')}...</div>}
                      <div className="mt-5 flex items-center justify-center md:justify-end">
                        {Object.keys(projectData.social).map((key) => (
                          <div key={key}>{
                            projectData.social[key] && <a className="block opacity-30 hover:opacity-100 mx-2 md:mx-3" href={projectData.social[key]} target="_blank">
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
                  <div className="w-full md:w-auto md:flex-1 md:flex flex-col justify-between px-5 py-8">
                    <div className="w-full">
                      <div className="flex items-start">
                        {configData && <img className="w-[70px]" src={configData.cdn + projectData.icon} />}
                        <div className="flex-1 ml-4">
                          <div className="text-white text-[24px] 2xl:text-[30px] leading-[1.1]">{projectData.name}</div>
                          <div className="flex mt-[6px] flex-wrap">
                            {projectData.tagArr?.map((name:string, tagIdx:number) => (
                              <div key={tagIdx} className="mr-2">
                                <Tag name={name} index={tagIdx} />
                              </div>  
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 text-[#A6A6A6] text-lg" dangerouslySetInnerHTML={{__html: projectData.desc}}></div>
                    </div>
                    {projectData.url && <div className="mt-12 text-center md:text-right">
                      <Button href={projectData.url} target="_blank" className="inline-block text-xl font-light text-white w-40 md:w-60 text-center py-3 md:py-4">
                        {t('project.play')}
                      </Button>
                    </div>}
                  </div>
                </div>

                {projectData != null && projectData?.process == 'launch' && (
                  <div className="bg-black mt-9 py-9 rounded-b-[20px] overflow-hidden">
                    <div className="mx-6 md:mx-12 px-3 md:px-8">
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
                        { (missionConfigLoading || missionConfig) &&<div className="inline-block font-ethnocentric-rg uppercase text-[22px] md:text-[30px] text-white text-center border-b border-[#FEBD32]">
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
                                  <div className="w-full md:w-auto md:flex-1 flex items-center md:pb-1 text-[#DDD5FF] md:text-[18px] pb-1 md:pb-0">
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
                                        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9461" width="26" height="26"><path d="M896 0H128C57.6 0 0 57.6 0 128v768c0 70.4 57.6 128 128 128h768c70.4 0 128-57.6 128-128V128c0-70.4-57.6-128-128-128zM448 794.496l-237.248-237.248 90.496-90.496L448 613.504l306.752-306.752 90.496 90.496L448 794.496z" p-id="9462" fill="#b4fe32"></path></svg>
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
                                  {curSeasonReward != '' ?  
                                  <div className="w-full md:w-auto flex items-center justify-center mr-6 mb-3 md:mb-0">
                                    <span className="text-[14px] md:text-[22px] text-[#F2CA9E]">{curSeasonReward}</span>   
                                    <img className="w-7 md:w-8 ml-1 inline-block" src="/images/icon_kkAppToke.png" /> 
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
                                        <svg className="inline-block" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16105" width="26" height="26"><path d="M499.894797 53.404559C231.810984 53.404559 14.538132 270.677412 14.538132 538.643334S231.810984 1024 499.894797 1024 985.133572 806.727147 985.133572 538.643334 767.86072 53.404559 499.894797 53.404559z m239.436335 382.437946l-273.506793 273.506793c-9.077596 9.077596-21.338245 14.146903-34.070458 14.146903-12.732213 0-24.992862-5.187198-34.070458-14.264794l-34.188349-34.188349-102.447157-102.447157c-9.077596-9.077596-14.146903-21.338245-14.146903-34.188349 0-12.850104 5.069307-25.110753 14.146903-34.188349 9.077596-9.077596 21.338245-14.146903 34.188349-14.146903 12.850104 0 25.110753 5.069307 34.18835 14.146903l102.447156 102.447157 239.200553-239.200553c18.980428-18.273083 49.042597-18.037301 67.669352 0.589454 18.626756 18.626756 18.862537 48.806816 0.589455 67.787244z" fill="#636363" p-id="16106"></path></svg>
                                        <span className="ml-2 text-[18px] md:text-[22px] text-[#636363] leading-0">{t('project.claimed')}</span>
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