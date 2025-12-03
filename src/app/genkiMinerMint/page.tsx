"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useDisconnect } from "wagmi";
import Modal from "react-modal";
import { signMessage, switchChain } from "@wagmi/core";

import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import Button from "@/components/ui/Button";
import { useErrCode } from "@/datas/errCode";
import { bindEvmAccount, bindTgAccount, bindTonAccount, getKScore, getUserInfo } from "@/services/apis/user";
import { formatNumberWithCommas } from "@/utils/number";
import { getNFT1155Data, getNFTData, getRemintList, mappingBscChain, mappingEvm1155, mintTonNFT } from "@/services/apis/nft";
import {tgtChain, config as wagmiConfig} from "@/config/wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import History from "@/components/GenkiMinerMint/history";

export default function YourNFTs() {
  const t = useTranslations();

  const { address, isConnected } = useAccount();
  const { configData, userInfo, handleSetUserInfo, triggerModalOpen } = useAppContext();
  const [addr, setAddr] = useState<string>('');
  const [kscore, setKscore] = useState<number>(0);
  const [kscoreLoading, setKscoreLoading] = useState<boolean>(true);
  const [NFTData, setNFTData] = useState<any>(null);
  const [NFTList, setNFTList] = useState<any[]>([]);

  const [NFTListLoading, setNFTListLoading] = useState<boolean>(true);

  const [mintedLoading, setMintedLoading] = useState<boolean>(false);

  const { errCodeHandler } = useErrCode();

  const [showBindModal, setShowBindModal] = useState<boolean>(false);
  const [stepIdx, setstepIdx] = useState<number>(0);

  const [reMintList, setReMintList] = useState<any>({});

  const [mintLoading, setMintLoading] = useState<any[]>([]);
  const [mappingLoading, setMappingLoading] = useState<any>([])

  const reconnectForce = useRef(false);
  const { openConnectModal } = useConnectModal();

  const [bindEvmAccountLoading, setBindEvmAccountLoading] = useState<boolean>(false);
  const [bindTgAccountLoading, setBindTgAccountLoading] = useState<boolean>(false);
  const [bindTonAccountLoading, setBindTonAccountLoading] = useState<boolean>(false);
  const reBindTimeout = useRef<any>(null);

  const [showToTgModal, setShowToTgModal] = useState(false);
  const [tgLink, setTgLink] = useState<string>('');
  const [tgWebLoginToken, setTgWebLoginToken] = useState<string>('');

  const { disconnect } = useDisconnect()
  const bindEvmForce = useRef<boolean>(false);

  const historyRef = useRef<any>(null);


  const [NFT1155Data, setNFT1155Data] = useState<any>(null);

  const [firstSortList, setFirstSortList] = useState<boolean>(true);

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

  const handleGetNFTData = async () => {
    setNFTListLoading(true);

    await getNFTData()
    .then((res) => {
      const data = res?.data;
      if(data.status == 10000) {
        setNFTData(data?.data);
        let temp:any[] = []
        Object.entries(data?.data[10000].ids).map(([key, value]) => {
          temp.push({project:data?.data[10000].project, id: Number(key), ...(value as any)})
        });
        setNFTList(temp);
      }
      else {
        errCodeHandler(data.status, data.msg)
      }
    })

    setNFTListLoading(false);
  }

  const handleGetNFT1155Data = async () => {
    await getNFT1155Data()
    .then((res) => {
      const data = res?.data;
      if(data.status == 10000) {
        setNFT1155Data(data?.data);
      }
      else {
        errCodeHandler(data.status, data.msg)
      }
    })
  }

  const handleMint = async(id:number, project:number) => {
    reconnectForce.current = false;
    if(!userInfo) {
      triggerModalOpen();
      return;
    }
    /*
    if(!userInfo?.account || !userInfo?.tgAccount) {
      setShowBindModal(true);
      return;
    }
    */
    if(mintLoading.length) {
      return;
    }

    setMintLoading([id]);

    await mintTonNFT({resId: id, project})
    .then((res) => {
      const data = res?.data;
      if(data.status == 10000) {
        toast.success(t('genkiMint.mintSuccess'));
      }
      else {
        errCodeHandler(data.status, data.msg)
      }
    })

    handleGetRemintList();
    handleGetKscore();
    setMintLoading([]);
  }

  const handleMapping = async(id:number) => {
    if(mappingLoading.length) {
      return;
    }
    setMappingLoading([id]);

    await mappingEvm1155({resId: id})
    .then((res) => {
      const data = res?.data;
      if(data.status == 10000) {
        toast.success(t('genkiMint.mappingSuccess'));
      }
      else {
        errCodeHandler(data.status, data.msg)
      }
    })

    handleGetRemintList();
    setMappingLoading([]);
  }

  const handleGetRemintList = async () => {
    setMintedLoading(true);
    await getRemintList()
    .then((res) => {
      const data = res?.data;
      if(data.status == 10000) {
        setReMintList(data?.data ? data.data : {});
      }
      else {
        errCodeHandler(data.status, data.msg)
      }
    })
    .catch((err) => {
      toast.error(err?.message ? err.message : err);
    })
    setMintedLoading(false);
  }

  const handleBindTgAccount = async (tempToken = '', reqCount = 0) => {
    setBindTgAccountLoading(true);
    let reConnect = false;

    await bindTgAccount(tempToken)
    .then(async(res) => {
      const data = res?.data;
      if(data.status == 10000 && data?.data.botUrl) {
        if(/Mobi|Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)){
          setTgLink(data?.data.botUrl);
          setTgWebLoginToken(data?.data.webLoginToken);
          setShowToTgModal(true);
        }
        else {
          window.open(data?.data.botUrl, '_blank');
          reConnect = true;
          reBindTimeout.current = setTimeout(() => {
            handleBindTgAccount(data?.data.webLoginToken, reqCount + 1);
          }, 5000);
        }
      }
      else if(data?.data?.account) {
        clearTimeout(reBindTimeout.current);
        reBindTimeout.current = null;
        toast.success(t('personalInfo.bindTgAccountSuccess'));
        handleGetUserInfo();
      }
      else if(reqCount < 10) {
        if(data.status != 10002) {
          reConnect = false;
          clearTimeout(reBindTimeout.current);
          reBindTimeout.current = null;
          errCodeHandler(data.status, data.msg)
        }
        else {
          reConnect = true;
          
          reBindTimeout.current = setTimeout(() => {
            handleBindTgAccount(tempToken, reqCount + 1);
          }, 5000);
        }
      }
      else {
        if(data.status != 10002) {
          errCodeHandler(data.status, data.msg)
        }
        clearTimeout(reBindTimeout.current);
        reBindTimeout.current = null;
      }
    })
    if(!reConnect) {
      setBindTgAccountLoading(false);
    }
  }

  const handleBindEvmAccount = async() => {
    if(!bindEvmForce.current) {
      return;
    }
    bindEvmForce.current = false;
    setBindEvmAccountLoading(true);

    try {
      const signMsgStr = 'address=' + address + ',chain_id=' + tgtChain?.id;
      await switchChain(wagmiConfig, { chainId: tgtChain?.id });
      await new Promise(resolve => setTimeout(resolve, 1500));
      const signedMessage = await signMessage(wagmiConfig, {message: signMsgStr});

      await bindEvmAccount({
        address: address,
        sign: signedMessage.replace(/['"]+/g, ''),
        chain_id: tgtChain?.id
      })
      .then(res => {
        const data = res?.data;
        if(data.status == 10000) {
          toast.success(t('personalInfo.bindEvmAccountSuccess'));
          handleGetUserInfo();
        }
        else {
          handleDisconnect();
          errCodeHandler(data.status, data.msg)
        }
      })
      .catch(() => {
        handleDisconnect();
      })
    }
    catch(err) {
      handleDisconnect();
    }
    setBindEvmAccountLoading(false);
  }

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

  const handleDisconnect = async() => {
    localStorage.removeItem('wagmi.wallet');
    localStorage.removeItem('wagmi.connected')
    localStorage.removeItem('wagmi.store')
    localStorage.removeItem('wagmi.metaMask')
    sessionStorage.clear()
    await disconnect();
  }

  const handleUpdateStep = (skipCheck = false) => {
    if(!userInfo.tgAccount) {
      setstepIdx(0);
    }
    else if(!userInfo.account) {
      if(skipCheck) {
        setstepIdx(1);
      }
      else {
        setstepIdx(2);
      }
    }
    else {
      setstepIdx(3);
    }
  }

  const handleOpenEvmConnectModal = () => {
    bindEvmForce.current = true;
    handleDisconnect();
    openConnectModal?.();
  }

  const handleShowHistoryModal = () => {
    historyRef.current?.handleShowModal();
  }

  useEffect(() => {
    if(reMintList && Object.keys(reMintList).length > 0 && NFTList?.length) {
      if(firstSortList) {
        setFirstSortList(false);

        let temp = [...NFTList];
        const getRank = (t:number) => {
          if (t == 1) return 0; // 最前
          if (t == 2) return 2; // 最后
          return 1;              // 中间
        };

        temp.sort((a, b) => {
          return getRank(reMintList[a.id]) - getRank(reMintList[b.id]);
        })
        setNFTList(temp);
      }
    }
  }, [reMintList, NFTList])

  useEffect(() => {
    if(userInfo) {
      handleGetKscore();
      handleUpdateStep();

      if(!userInfo?.account) {
        handleDisconnect();
      }
    }
    else {
      setAddr('');
      setReMintList({});
      setKscore(0);
    }
  }, [userInfo])

  useEffect(() => {
    if(userInfo && NFTData) {
      handleGetRemintList();
    }
  }, [userInfo, NFTData])

  useEffect(() => {
    if (isConnected && address) {
      if(reconnectForce.current) {
        reconnectForce.current = false;
      }
      if(bindEvmForce.current) {
        handleBindEvmAccount();
      }
    }
    else {
      reconnectForce.current = false;
    }
  }, [isConnected, address]);

  useEffect(() => {
    handleGetNFTData();
    handleGetNFT1155Data();
    const addr = localStorage.getItem('kkAddress');
    setAddr(addr || '');

    return () => {
      reconnectForce.current = false;
      setMintLoading([]);
    }
  }, [])

  return (
    <main className="mint-page min-h-screen overflow-hidden relative pt-[72px] flex flex-col">
      <div className="w-full flex-1 mt-9 relative z-2">
        <div className="max-w-[1920px] mx-auto px-5 lg:px-18 2xl:px-24">
          <div className="flex flex-col md:flex-row bg-black/50 rounded-[20px] overflow-hidden">
            <img className="w-full md:w-[280px]" src="/images/games/genkiminer2.jpg" alt="genki miner" />
            <div className="w-full md:w-auto md:flex-1">
              <div className="px-3 md:px-7 py-9">
                <div className="text-[18px] xl:text-[30px] font-ethnocentric-rg text-white inline-block border-b border-[#FEBD32] leading-tight">
                  {t('genkiMint.title')}
                </div>
                <div className="text-[18px] text-[#8D73FF] mt-3">
                  {t('genkiMint.desc')}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-10">
            {userInfo != null && 
              <div className="flex justify-end px-3">
                <button className="text-[#8D73FF] cursor-pointer hover:underline" onClick={handleShowHistoryModal}>{t('personalInfo.viewHistory')}</button>
              </div>
            }
            {NFTListLoading ?
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="animate-pulse mt-5 flex flex-wrap bg-black/50 rounded-[20px] md:text-[20px] p-3">
                  <div className="w-1/3 md:w-[130px] 2xl:w-[168px]">
                    <div className="rounded-[10px] bg-gray-500 w-w-full aspect-[1/1.25]"></div>
                  </div>
                  <div className="w-2/3 md:w-auto md:flex-1 py-3 md:py-0 px-3">
                    <div className="w-full md:w-80 h-[30px] bg-gray-500 rounded-[10px]"></div>
                    <div className="w-4/5 h-[20px] bg-gray-500 rounded-[10px] mt-3"></div>
                    <div className="w-4/5 h-[20px] bg-gray-500 rounded-[10px] mt-2"></div>
                  </div>
                  <div className="w-full md:w-[300px] flex items-end justify-end flex-col pt-6">
                    <div className="w-3/5 h-[30px] bg-gray-500 rounded-[10px] mx-auto"></div>
                    <div className="w-full h-[60px] bg-gray-500 rounded-[10px] mt-3"></div>
                  </div>
                </div>
              ))
            :
            <div className="flex flex-wrap">
            {NFTList?.map((item:any, index:number) => (
            <div key={index} className={"w-full " + (reMintList && reMintList[item.id] ? (reMintList[item.id] == 2 ? 'order-2 opacity-50' : 'order-1') : 'order-1')}>
              <div key={index} className="mt-5 flex flex-wrap bg-black/50 rounded-[20px] md:text-[20px] p-3">
                <div className="w-1/3 md:w-[130px] 2xl:w-[168px]">
                  {configData != null && <img className="w-full" src={configData?.IPFSTON + item?.project + '/image/' +  item?.name.replace(' ', '-') + '.png'} alt="" />}
                </div>
                <div className="w-2/3 md:w-auto md:flex-1 px-3">
                  <div className="text-[#DDD5FF] text-[20px] md:text-[30px]">{item?.name} <span className="text-[#8D73FF]">(Lv.{item.level})</span></div>
                  <div className="text-[#8A84A3]">{item?.desc}</div>
                  {item?.airdropBoost > 0 && <div className="text-[#FEBD32] mt-3">{t('nft.inGameBenefits')}</div>}
                </div>
                <div className="w-full md:w-[300px] flex flex-col justify-center md:justify-end items-center md:items-end pt-6">
                {userInfo != null && (mintedLoading || kscoreLoading) && 
                  <div className="flex justify-center w-full">
                    <span className="animate-spin w-8 h-8 border-3 border-b-white/50 border-t-transparent rounded-full"></span>
                  </div>
                }
                {userInfo != null ?
                  !mintedLoading && reMintList != null && reMintList[item.id] !== undefined && !kscoreLoading &&
                  <> {
                      reMintList[item.id] == 0 ?
                        <>
                        <div className="w-full flex items-center justify-center space-x-3">
                          <img className="w-[38px]" src="/images/kscore.png" />
                          <div className="md:text-[20px]">{item.kscore}/{kscore}</div>
                        </div>
                        {item?.airdropBoost > 0 && <div className="w-full text-center">
                          <span className="text-[#69FFD3] mt-1">{t('nft.airdropBonusLevel')}: {item?.level}</span>
                        </div>}
                        <Button className={"relative text-[20px] font-light text-white w-[300px] text-center py-3 md:py-4 mt-3 " + (item.kscore > kscore ? "cursor-not-allowed" : "")} 
                          onClick={item.kscore > kscore ?() => {} : () => handleMint(Number(item.id), 10000)} disabled={item.kscore > kscore}>
                          {t('genkiMint.mint')}
                          {mintLoading.includes(Number(item.id)) && <span className="ml-2 animate-spin w-5 h-5 border-2 border-[#8D73FF] border-t-transparent rounded-full"></span>}
                          <span className="absolute left-1/2 -translate-x-1/2 bottom-[2px] text-[12px] text-white">(0/2)</span>
                        </Button>
                      </>
                      :
                      (reMintList[item.id] == 1 || reMintList[item.id] == 2) && <>
                        {item?.airdropBoost > 0 && <div className="w-full text-center">
                          <span className="text-[#69FFD3]">{t('nft.benefits')}: {t('nft.airdrop')} +{item?.airdropBoost}%</span>
                        </div>}
                        {reMintList[item.id] == 1 &&
                        <>
                          <Button className="relative text-[20px] font-light text-white w-[300px] text-center py-3 md:py-4 mt-3" onClick={() => handleMapping(Number(item.id))}>
                            {t('genkiMint.mapToBscChain')}
                            {mappingLoading.includes(Number(item.id)) && <span className="ml-2 animate-spin w-5 h-5 border-2 border-[#8D73FF] border-t-transparent rounded-full"></span>}
                            <span className="absolute left-1/2 -translate-x-1/2 bottom-[2px] text-[12px] text-white">(1/2)</span>
                          </Button>
                        <div className="text-center text-[14px] text-[#8A84A3]">{t('genkiMint.mappingHint')}</div>
                        </>}
                      </> 
                  }
                  </>
                  :
                  <Button className="relative text-[20px] font-light text-white w-[300px] text-center py-3 md:py-4 mt-3" onClick={() => triggerModalOpen()}>
                    {t('menu.login')}
                  </Button>
                }
                </div>
              </div>
            </div>
            ))}
            </div>
            }
          </div>
        </div>
      </div>
        
      <div className="w-full flex-shrink-0 bg-[#090909] py-6 relative z-1 mt-12">
        <div className="max-w-[1920px] mx-auto px-5 lg:px-18 2xl:px-24">
          <Footer />
        </div>
      </div>

      <Modal
        isOpen={showBindModal}
        onRequestClose={() => setShowBindModal(false)}
        shouldCloseOnOverlayClick={true}
        className="w-9/10! xl:w-[1000px]!"
      >
        <div className="w-full rounded-[20px] bg-black">
          <div className="w-full bind-step-modal">
            <div className="relative text-white text-right p-6 ">
              <button className="cursor-pointer hover:opacity-80" onClick={() => setShowBindModal(false)}>
                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="22" height="22"><path d="M431.559111 512L149.959111 230.4a56.888889 56.888889 0 0 1 80.440889-80.440889L512 431.559111l281.6-281.6a56.888889 56.888889 0 0 1 80.440889 80.440889L592.440889 512l281.6 281.6a56.888889 56.888889 0 1 1-80.440889 80.440889L512 592.440889 230.4 874.040889a56.888889 56.888889 0 1 1-80.440889-80.440889L431.559111 512z" fill="#ffffff"></path></svg>
              </button>
            </div>
            <div className="max-h-[85vh] overflow-y-auto p-6">
              <div className="bg-black/50 rounded-[20px] p-3 flex flex-wrap items-end jsutify-between mt-3">
                <div className="w-full md:flex-1 md:w-auto">
                  <div className="text-[#FEBD32] text-[18px] md:text-[24px] font-ethnocentric-rg">{t('genkiMint.step')}: 1</div>
                  <div className="text-[#DDD5FF] 2xl:text-[20px] mt-1">{t('genkiMint.step1')}</div>
                </div>
                <div className="w-full md:w-60 text-center py-6 md:py-2 flex items-center justify-center">
                  {stepIdx == 0 ?
                    <Button className="w-60 text-[18px] font-light text-white text-center py-3" onClick={() => handleBindTgAccount()}>
                      {t('personalInfo.bindTgAccount')}
                      {bindTgAccountLoading && <span className="ml-2 animate-spin w-5 h-5 border-2 border-[#8D73FF] border-t-transparent rounded-full"></span>}
                    </Button>
                    :
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#06bf7c]">
                      <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="36" height="36"><path d="M913.017 237.02c-25.311-25.312-66.349-25.312-91.66 0l-412.475 412.474-206.237-206.237c-25.312-25.312-66.35-25.312-91.661 0s-25.312 66.35 0 91.66l252.067 252.067c0.729 0.73 1.439 1.402 2.134 2.029 25.434 23.257 64.913 22.585 89.527-2.029l458.303-458.303c25.313-25.312 25.313-66.35 0.001-91.661z" fill="#ffffff"></path></svg>
                    </div>
                  }
                </div>
              </div>

              <div className="bg-black/50 rounded-[20px] p-3 flex flex-wrap items-end jsutify-between mt-3">
                <div className="w-full md:flex-1 md:w-auto">
                  <div className="text-[#FEBD32] text-[18px] md:text-[24px] font-ethnocentric-rg">{t('genkiMint.step')}: 2</div>
                  <div className="text-[#DDD5FF] 2xl:text-[20px] mt-1">{t('genkiMint.step2')}</div>
                </div>
                <div className="w-full md:w-60 text-center py-6 md:py-2 flex items-center justify-center">
                  {stepIdx == 1 ?
                    <Button className="w-60 text-[18px] font-light text-white text-center py-3" onClick={() => handleUpdateStep(true)}>
                      {t('genkiMint.check')}
                    </Button>
                    :
                    stepIdx < 1 ?
                      <Button className="w-60 text-[18px] font-light text-white text-center py-3" disabled={true}>
                        {t('genkiMint.check')}
                      </Button>
                      :
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#06bf7c]">
                        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="36" height="36"><path d="M913.017 237.02c-25.311-25.312-66.349-25.312-91.66 0l-412.475 412.474-206.237-206.237c-25.312-25.312-66.35-25.312-91.661 0s-25.312 66.35 0 91.66l252.067 252.067c0.729 0.73 1.439 1.402 2.134 2.029 25.434 23.257 64.913 22.585 89.527-2.029l458.303-458.303c25.313-25.312 25.313-66.35 0.001-91.661z" fill="#ffffff"></path></svg>
                      </div>
                  }
                </div>
              </div>

              <div className="bg-black/50 rounded-[20px] p-3 flex flex-wrap items-end jsutify-between mt-3">
                <div className="w-full md:flex-1 md:w-auto">
                  <div className="text-[#FEBD32] text-[18px] md:text-[24px] font-ethnocentric-rg">{t('genkiMint.step')}: 3</div>
                  <div className="text-[#DDD5FF] 2xl:text-[20px] mt-1">{t('genkiMint.step3')}</div>
                </div>
                <div className="w-full md:w-60 text-center py-6 md:py-2 flex items-center justify-center">
                  {stepIdx == 2 ?
                    <Button className="w-60 text-[18px] font-light text-white text-center py-3" onClick={() => handleOpenEvmConnectModal()}>
                      {t('personalInfo.bindWallet')}
                      {bindEvmAccountLoading && <span className="ml-2 animate-spin w-5 h-5 border-2 border-[#8D73FF] border-t-transparent rounded-full"></span>}
                    </Button>
                    :
                    stepIdx < 2 ?
                      <Button className="w-60 text-[18px] font-light text-white text-center py-3" disabled={true}>
                        {t('personalInfo.bindWallet')}
                      </Button>
                      :
                      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#06bf7c]">
                        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="36" height="36"><path d="M913.017 237.02c-25.311-25.312-66.349-25.312-91.66 0l-412.475 412.474-206.237-206.237c-25.312-25.312-66.35-25.312-91.661 0s-25.312 66.35 0 91.66l252.067 252.067c0.729 0.73 1.439 1.402 2.134 2.029 25.434 23.257 64.913 22.585 89.527-2.029l458.303-458.303c25.313-25.312 25.313-66.35 0.001-91.661z" fill="#ffffff"></path></svg>
                      </div>
                  }
                </div>
              </div>

              <div className="bg-black/50 rounded-[20px] p-3 flex flex-wrap items-end jsutify-between mt-3">
                <div className="w-full md:flex-1 md:w-auto">
                  <div className="text-[#FEBD32] text-[18px] md:text-[24px] font-ethnocentric-rg">{t('genkiMint.step')}: 4</div>
                  <div className="text-[#DDD5FF] 2xl:text-[20px] mt-1">{t('genkiMint.step4')}</div>
                </div>
                <div className="w-full md:w-60 text-center py-6 md:py-2 flex items-center justify-center">
                  {stepIdx == 3 ?
                    <Button className="w-60 text-[18px] font-light text-white text-center py-3" onClick={() => setShowBindModal(false)}>
                      {t('genkiMint.mintNFT')}
                    </Button>
                    :
                    <Button className="w-60 text-[18px] font-light text-white text-center py-3" disabled={true}>
                      {t('genkiMint.mintNFT')}
                    </Button>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
          isOpen={showToTgModal}
          onRequestClose={() => setShowToTgModal(false)}
          shouldCloseOnOverlayClick={true}
          className=""
        >
          <div className="w-80 text-center p-6 bg-black rounded-lg">
            <div className="text-white text-center text-[20px] mb-6">{t('menu.tgLogin')}</div>
            <a id="open-tg-link" className="open-tg-link w-60 text-white md:text-[20px] px-6 py-2 md:px-12 md:py-3 bg-[#6E4DFF] mt-6 rounded-lg"
            href={tgLink}
            target="_blank"
            onClick={() => {
              setShowToTgModal(false);
              reBindTimeout.current = setTimeout(() => {
                handleBindTgAccount(tgWebLoginToken, 1);
              }, 5000);
            }}>
              <span className="text-sm md:text-base font-medium ml-2">{t('menu.openTgToLogin')}</span>
            </a>
            <div className="text-center text-white/60 text-[12px] mt-6">{t('common.openTgHint')}</div>
          </div>
      </Modal>
      <History ref={historyRef} NFT1155Data={NFT1155Data} NFTData={NFTData} />
    </main>
  );
}