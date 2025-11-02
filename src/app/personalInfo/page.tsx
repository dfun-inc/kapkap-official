"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useErrCode } from "@/datas/errCode";
import { bindEvmAccount, bindTgAccount, getKScore, getKScoreHistory, getUserInfo } from "@/services/apis/user";
import { formatNumberWithCommas } from "@/utils/number";
import { getMintHistory, getNFTData } from "@/services/apis/nft";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { readContract, signMessage, switchChain } from "@wagmi/core";
import {tgtChain, config as wagmiConfig} from "@/config/wagmi";
import NFT1155ABI from "@/config/abis/NFT1155.json";
import { getChainConfig } from "@/services/apis/config";
import Modal from 'react-modal';
import { formatDatetime } from "@/utils/time";

export default function personalInfo() {
  const t = useTranslations();
  const { userInfo, handleSetUserInfo, triggerModalOpen } = useAppContext();
  const [addr, setAddr] = useState<string>('');
  const [kscore, setKscore] = useState<number>(0);
  const [kscoreLoading, setKscoreLoading] = useState<boolean>(true);

  const [chainConfig, setChainConfig] = useState<any>(null);

  const [NFTlist, setNFTList] = useState<any[]>([]);
  const [NFTlistLoading, setNFTListLoading] = useState<boolean>(false);

  const [bindEvmAccountLoading, setBindEvmAccountLoading] = useState<boolean>(false);
  const [bindTgAccountLoading, setBindTgAccountLoading] = useState<boolean>(false);
  const reBindTimeout = useRef<any>(null);

  const [NFTData, setNFTData] = useState<any>(null);

  const [mintHistoryModal, setMintHistoryModal] = useState<boolean>(false);
  const [mintHistory, setMintHistory] = useState<any[]>([]);
  const [mintHistoryLoading, setMintHistoryLoading] = useState<boolean>(false);

  const [kscoreHistoryModal, setKscoreHistoryModal] = useState<boolean>(false);
  const [kscoreHistory, setKscoreHistory] = useState<any[]>([]);
  const [kscoreHistoryLoading, setKscoreHistoryLoading] = useState<boolean>(false);

  const { openConnectModal } = useConnectModal();
  const { address, isConnected, connector, isDisconnected } = useAccount();
  const { disconnect } = useDisconnect()
  const bindEvmForce = useRef<boolean>(false);

  const { errCodeHandler } = useErrCode();

  const handleGetUserInfo = async() => {
    await getUserInfo().then((res) => {
      const data = res?.data;
      if(data.status == 10000) {
        handleSetUserInfo(data?.data);
      }
      else {
        errCodeHandler(data.status)
      }
    })
  }

  const handleBindTgAccount = async (tempToken = '', reqCount = 0) => {
    setBindTgAccountLoading(true);
    let reConnect = false;

    await bindTgAccount(tempToken)
    .then(async(res) => {
      const data = res?.data;
      if(data.status == 10000 && data?.data.botUrl) {
        window.open(data?.data.botUrl, '_blank');
        reConnect = true;
        reBindTimeout.current = setTimeout(() => {
          handleBindTgAccount(data?.data.webLoginToken, reqCount + 1);
        }, 5000);
      }
      else if(data?.data?.account) {
        clearTimeout(reBindTimeout.current);
        reBindTimeout.current = null;
        handleGetUserInfo();
      }
      else if(reqCount < 10) {
        if(data.status != 10002) {
          reConnect = false;
          clearTimeout(reBindTimeout.current);
          reBindTimeout.current = null;
          errCodeHandler(data.status);
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
          errCodeHandler(data.status);
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
          handleGetUserInfo();
        }
        else {
          handleDisconnect();
          errCodeHandler(data.status)
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

  const handleGetNFTData = async () => {
    await getNFTData()
    .then((res) => {
      const data = res?.data;
      if(data.status == 10000) {
        setNFTData(data?.data);
      }
      else {
        errCodeHandler(data.status)
      }
    })
  }

  const handleOpenEvmConnectModal = () => {
    bindEvmForce.current = true;
    handleDisconnect();
    openConnectModal?.();
  }

  const handleGetKscore = async () => {
    setKscoreLoading(true);
    await getKScore(10000)
    .then((res) => {
      const data = res?.data;
      if(data.status == 10000 || data.status == 30082) {
        setKscore(data?.data || 0);
      }
      else {
        errCodeHandler(data.status)
      }
    })
    setKscoreLoading(false);
  }

  const handleDisconnect = async() => {
    await disconnect();
  }

  const handleGetMyNFTList = async () => {
    setNFTListLoading(true);
    await readContract(wagmiConfig, {
      address: chainConfig.NFT1155,
      abi: NFT1155ABI,
      functionName: 'tokensOfOwner',
      args: [userInfo?.account, 0, 100],
    })
    .then((res:any) => {
      console.log(res)
      let tempArr:any[] = [];
      res.forEach((item:any) => {
        if(item?.amount > 0) {
          tempArr.push({id: Number(item?.id), amount: item?.amount});
        }
      })
      console.log(tempArr)
      setNFTList(tempArr);
    })
    setNFTListLoading(false);
  }

  const handleGetChaninConfig = async () => {
    await getChainConfig()
    .then((res) => {
      const data = res?.data;
      if(data.status == 10000) {
        setChainConfig(data?.data);
      }
      else {
        errCodeHandler(data.status)
      }
    })
  }

  const handleGetKscoreHistory = async () => {
    setKscoreHistoryLoading(true);
    await getKScoreHistory()
    .then((res) => {
      const data = res?.data;
      if(data.status == 10000) {
        setKscoreHistory(data?.data || []);
      }
      else {
        errCodeHandler(data.status)
      }
    })
    setKscoreHistoryLoading(false);
  }

  const handleGetMintHistory = async () => {
    setMintHistoryLoading(true);
    await getMintHistory()
    .then((res) => {
      const data = res?.data;
      if(data.status == 10000) {
        let temp:any[]= [];
        data?.data.forEach((item:any) => {
          let itemArr = item.ids.split(',');
          let tempItemArr:any[] = [];
          let tempCost = 0;
          itemArr.forEach((id:any) => {
            Object.entries(NFTData).find(([key, value]:any) => {
              Object.entries(value?.ids)?.map(([key2, value2]:any) => {
                if(key2 == id) {
                  tempItemArr.push({id: key2, ...value2});
                  tempCost += Number(value2?.kscore)
                }
              })
            });
          })
          temp.push({...item, item: tempItemArr, cost: tempCost});
        })
        setMintHistory(temp);
      }
      else {
        errCodeHandler(data.status)
      }
    })
    setMintHistoryLoading(false);
  }

  useEffect(() => {
    if(kscoreHistoryModal) {
      handleGetKscoreHistory();
    }
  }, [kscoreHistoryModal])

  useEffect(() => {
    if(mintHistoryModal && NFTData) {
      handleGetMintHistory();
    }
  }, [mintHistoryModal, NFTData])

  useEffect(() => {
    if(userInfo?.account && chainConfig) {
      handleGetMyNFTList();
    }
  }, [userInfo, chainConfig])

  useEffect(() => {
    if(userInfo) {
      handleGetKscore();

      if(!userInfo?.account) {
        handleDisconnect();
      }
    }
    else {
      setAddr('');
    }
  }, [userInfo])

  useEffect(() => {
    if (isConnected && address) {
      if(bindEvmForce.current) {
        handleBindEvmAccount();
      }
    }
    else {
      bindEvmForce.current = false;
    }
  }, [isConnected, address]);

  useEffect(() => {
    handleGetNFTData();
    handleGetChaninConfig();
    const addr = localStorage.getItem('kkAddress');
    setAddr(addr || '');

    return () => {
      clearTimeout(reBindTimeout.current);
      reBindTimeout.current = null;

      bindEvmForce.current = false;
    }
  }, [])

  return (
    <main className="your-nfts-page min-h-screen overflow-hidden relative pt-[72px] flex flex-col">
      <div className="w-full flex-1 mt-9 relative z-2">
        <div className="max-w-[1920px] mx-auto px-5 lg:px-18 2xl:px-24">
        {addr || userInfo ?
            <>
              <div className="bg-black/50 relative px-4 py-6 rounded-[20px]">
                <div className="flex justify-end">
                  <button className="text-[#8D73FF] cursor-pointer hover:underline" onClick={() => setKscoreHistoryModal(true)}>{t('personalInfo.viewHistory')}</button>
                </div>
                <div className="flex flex-wrap">
                  <div className="flex flex-wrap w-full md:w-1/2 md:border-r md:border-[#241E33] px-6 md:px-12 2xl:px-20 py-3 justify-between">
                    <div className="w-full md:w-auto">
                      <div className="text-[#8D73FF] text-[18px]">{t('personalInfo.yourTgAccount')}</div>
                      <div className="mt-2 leading-none">
                      {userInfo ? 
                        <>
                        {userInfo?.tgAccount ? 
                          <div className="text-[#FEBD32] text-[30px]">{userInfo?.tgAccount}</div>
                        :
                          bindTgAccountLoading ?
                            <div className="animate-spin w-7 h-7 border-2 border-[#8D73FF] border-t-transparent rounded-full"></div>
                          :
                          <button className="text-[#757895] flex items-end border-b border-b-transparent hover:border-b-[#757895]" onClick={() => handleBindTgAccount()}>
                            <div className="text-[30px]">{t('personalInfo.none')}</div>
                            <div className="text-[20px] ml-1 pb-1">({t('personalInfo.bindTgAccount')})&gt;</div>
                          </button>
                        }
                        </>
                        :
                        <div className="animate-pulse w-40 h-[30px] bg-gray-500 rounded-lg"></div>
                      }
                      </div>
                    </div>
                    <div className="w-full md:w-auto mt-12 md:mt-0">
                      <div className="text-[#8D73FF] text-[18px]">{t('personalInfo.yourWallet')}</div>
                      <div className="mt-2 leading-none">
                      {userInfo ? 
                        <>
                        {userInfo?.account ? 
                          <div className="text-[#FEBD32] text-[30px]">
                            {userInfo?.account?.length > 4 ? userInfo?.account?.substring(0, 4) + '...' + userInfo?.account?.substring(userInfo?.account?.length - 4, userInfo?.account?.length) : userInfo?.account}
                          </div>
                        :
                        bindEvmAccountLoading ?
                          <div className="animate-spin w-7 h-7 border-2 border-[#8D73FF] border-t-transparent rounded-full"></div>
                        :
                          <button className="text-[#757895] flex items-end border-b border-b-transparent hover:border-b-[#757895]" onClick={handleOpenEvmConnectModal}>
                            <div className="text-[30px]">{t('personalInfo.none')}</div>
                            <div className="text-[20px] ml-1 pb-1">({t('personalInfo.bindWallet')})&gt;</div>
                          </button>
                        }
                        </>
                        :
                        <div className="animate-pulse w-40 h-[30px] bg-gray-500 rounded-lg"></div>
                      }
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 px-6 md:px-12 2xl:px-20 py-3 mt-12 md:mt-0">
                    <div className="flex items-center space-x-8">
                      <img className="w-12 md:w-18" src="/images/kscore.png" alt="kscore" />
                      <div>
                        <div className="text-[#8D73FF] text-[18px]">{t('personalInfo.yourKScore')}</div>
                        <div className="mt-2 leading-none">
                          {kscoreLoading ? 
                            <div className="animate-pulse w-40 h-[30px] bg-gray-500 rounded-lg"></div>
                          :
                            <div className="text-[#FEBD32] text-[30px]">{formatNumberWithCommas(kscore)}</div>
                          }
                        </div>
                        <div className="mt-1 text-[14px] text-[#8A84A3]">{t('personalInfo.kscoreDesc')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-14">
                <div className="flex justify-center">
                  <div className="text-[20px] xl:text-[30px] font-ethnocentric-rg text-white inline-block border-b border-[#FEBD32] leading-tight">
                    {t('personalInfo.title')}
                  </div>
                </div>
                <div className="flex justify-end mt-3 md:mt-0 md:px-3">
                  <button className="text-[#8D73FF] cursor-pointer hover:underline" onClick={() => setMintHistoryModal(true)}>{t('personalInfo.viewHistory')}</button>
                </div>
                <div className="">
                  {NFTlistLoading ? 
                    <div className="animate-pulse grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 lg:gap-15 mt-12">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="w-full aspect-[3/4] bg-gray-500 rounded-lg"></div>
                      ))}
                    </div>
                  :
                    NFTlist?.length > 0 ?
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 lg:gap-15 mt-12">
                      {chainConfig != null &&NFTlist.map((item, index) => (
                        <div key={index} className="w-full relative hover:scale-105 transition-transform duration-300">
                          <img className="w-full rounded-lg" src={chainConfig.IPFS.replace('token', 'image') + item?.id + '.png'} alt={item?.id} />
                          <div className="absolute bottom-5 right-5 py-1 px-3 bg-[#FEBD32] text-white rounded-lg">x{item?.amount} </div>
                        </div>
                      ))}
                    </div>
                  :
                    <div className="py-16 text-center">
                      <svg className="mx-auto" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="48" height="48"><path d="M855.6 427.2H168.5c-12.7 0-24.4 6.9-30.6 18L4.4 684.7C1.5 689.9 0 695.8 0 701.8v287.1c0 19.4 15.7 35.1 35.1 35.1H989c19.4 0 35.1-15.7 35.1-35.1V701.8c0-6-1.5-11.8-4.4-17.1L886.2 445.2c-6.2-11.1-17.9-18-30.6-18zM673.4 695.6c-16.5 0-30.8 11.5-34.3 27.7-12.7 58.5-64.8 102.3-127.2 102.3s-114.5-43.8-127.2-102.3c-3.5-16.1-17.8-27.7-34.3-27.7H119c-26.4 0-43.3-28-31.1-51.4l81.7-155.8c6.1-11.6 18-18.8 31.1-18.8h622.4c13 0 25 7.2 31.1 18.8l81.7 155.8c12.2 23.4-4.7 51.4-31.1 51.4H673.4zM819.9 209.5c-1-1.8-2.1-3.7-3.2-5.5-9.8-16.6-31.1-22.2-47.8-12.6L648.5 261c-17 9.8-22.7 31.6-12.6 48.4 0.9 1.4 1.7 2.9 2.5 4.4 9.5 17 31.2 22.8 48 13L807 257.3c16.7-9.7 22.4-31 12.9-47.8zM375.4 261.1L255 191.6c-16.7-9.6-38-4-47.8 12.6-1.1 1.8-2.1 3.6-3.2 5.5-9.5 16.8-3.8 38.1 12.9 47.8L337.3 327c16.9 9.7 38.6 4 48-13.1 0.8-1.5 1.7-2.9 2.5-4.4 10.2-16.8 4.5-38.6-12.4-48.4zM512 239.3h2.5c19.5 0.3 35.5-15.5 35.5-35.1v-139c0-19.3-15.6-34.9-34.8-35.1h-6.4C489.6 30.3 474 46 474 65.2v139c0 19.5 15.9 35.4 35.5 35.1h2.5z" fill="#757895"></path></svg>
                      <Button href="/genkiMinerMint" className="text-xl font-light text-white w-40 md:w-60 text-center py-3 md:py-4 mt-6">
                        {t('personalInfo.goToMint')}
                      </Button>
                    </div>
                  }
                </div>
              </div>
            </>
          :
          <div className="py-24 flex min-h-[60vh] items-center justify-center">
            <Button className="text-xl font-light text-white w-40 md:w-60 text-center py-3 md:py-4" onClick={() => triggerModalOpen()}>
              {t('menu.login')}
            </Button>
          </div>
        }
        </div>
      </div>
        
      <div className="w-full flex-shrink-0 bg-[#090909] py-6 relative z-1 mt-12">
        <div className="max-w-[1920px] mx-auto px-5 lg:px-18 2xl:px-24">
          <Footer />
        </div>
      </div>

      <Modal
        isOpen={kscoreHistoryModal}
        onRequestClose={() => setKscoreHistoryModal(false)}
        shouldCloseOnOverlayClick={true}
        className="w-9/10! lg:w-[800px]!"
      >
        <div className="w-full text-center bg-[#101014] rounded-[20px] overflow-hidden">
          <div className="bg-[#201E2A] relative py-3 text-center text-[22px] text-white">
            <span className="">{t('personalInfo.kscoreHistory')}</span>
            <button className="absolute top-1/2 right-6 -translate-y-1/2 cursor-pointer hover:opacity-80" onClick={() => setKscoreHistoryModal(false)}>
              <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path d="M431.559111 512L149.959111 230.4a56.888889 56.888889 0 0 1 80.440889-80.440889L512 431.559111l281.6-281.6a56.888889 56.888889 0 0 1 80.440889 80.440889L592.440889 512l281.6 281.6a56.888889 56.888889 0 1 1-80.440889 80.440889L512 592.440889 230.4 874.040889a56.888889 56.888889 0 1 1-80.440889-80.440889L431.559111 512z" fill="#ffffff"></path></svg>
            </button>
          </div>
          <div className="max-h-[400px] min-h-[300px] overflow-y-auto text-[18px]">
            <div className="p-6">
              <div className="flex border-b border-[#8A84A3] text-[#8A84A3] text-center">
                <div className="w-1/3">{t('personalInfo.date')}</div>
                <div className="w-1/3">{t('personalInfo.count')}</div>
                <div className="w-1/3">{t('personalInfo.type')}</div>
              </div>
              {kscoreHistoryLoading ?
                <div className="animate-pulse">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="w-full h-6 bg-gray-500 rounded-md mt-4"></div>
                  ))}
                </div>
              :
              kscoreHistory?.length > 0 ?
              kscoreHistory.map((item, index) => (
                <div key={index} className="flex text-[#8A84A3] text-center text-white mt-3">
                  <div className="w-1/3">{formatDatetime(item?.createdAt)}</div>
                  <div className="w-1/3 px-2">{(item?.type == 'mint' ? <span className='text-[#F6465D]'>-{item?.amount}</span> : <span className='text-[#2EBD85]'>+{item?.amount}</span>)}</div>
                  <div className="w-1/3 capitalize">{item?.type}</div>
                </div>
              ))
              :
              <div className="py-16 text-center">
                <svg className="mx-auto" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="48" height="48"><path d="M855.6 427.2H168.5c-12.7 0-24.4 6.9-30.6 18L4.4 684.7C1.5 689.9 0 695.8 0 701.8v287.1c0 19.4 15.7 35.1 35.1 35.1H989c19.4 0 35.1-15.7 35.1-35.1V701.8c0-6-1.5-11.8-4.4-17.1L886.2 445.2c-6.2-11.1-17.9-18-30.6-18zM673.4 695.6c-16.5 0-30.8 11.5-34.3 27.7-12.7 58.5-64.8 102.3-127.2 102.3s-114.5-43.8-127.2-102.3c-3.5-16.1-17.8-27.7-34.3-27.7H119c-26.4 0-43.3-28-31.1-51.4l81.7-155.8c6.1-11.6 18-18.8 31.1-18.8h622.4c13 0 25 7.2 31.1 18.8l81.7 155.8c12.2 23.4-4.7 51.4-31.1 51.4H673.4zM819.9 209.5c-1-1.8-2.1-3.7-3.2-5.5-9.8-16.6-31.1-22.2-47.8-12.6L648.5 261c-17 9.8-22.7 31.6-12.6 48.4 0.9 1.4 1.7 2.9 2.5 4.4 9.5 17 31.2 22.8 48 13L807 257.3c16.7-9.7 22.4-31 12.9-47.8zM375.4 261.1L255 191.6c-16.7-9.6-38-4-47.8 12.6-1.1 1.8-2.1 3.6-3.2 5.5-9.5 16.8-3.8 38.1 12.9 47.8L337.3 327c16.9 9.7 38.6 4 48-13.1 0.8-1.5 1.7-2.9 2.5-4.4 10.2-16.8 4.5-38.6-12.4-48.4zM512 239.3h2.5c19.5 0.3 35.5-15.5 35.5-35.1v-139c0-19.3-15.6-34.9-34.8-35.1h-6.4C489.6 30.3 474 46 474 65.2v139c0 19.5 15.9 35.4 35.5 35.1h2.5z" fill="#757895"></path></svg>
              </div>  
              }
            </div>
          </div>
          <div className="w-full h-10 bg-[#201E2A]"></div>
        </div>
      </Modal>

      <Modal
        isOpen={mintHistoryModal}
        onRequestClose={() => setMintHistoryModal(false)}
        shouldCloseOnOverlayClick={true}
        className="w-9/10! lg:w-[800px]!"
      >
        <div className="w-full text-center bg-[#101014] rounded-[20px] overflow-hidden">
          <div className="bg-[#201E2A] relative py-3 text-center text-[22px] text-white">
            <span className="">{t('personalInfo.mintHistory')}</span>
            <button className="absolute top-1/2 right-6 -translate-y-1/2 cursor-pointer hover:opacity-80" onClick={() => setMintHistoryModal(false)}>
              <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path d="M431.559111 512L149.959111 230.4a56.888889 56.888889 0 0 1 80.440889-80.440889L512 431.559111l281.6-281.6a56.888889 56.888889 0 0 1 80.440889 80.440889L592.440889 512l281.6 281.6a56.888889 56.888889 0 1 1-80.440889 80.440889L512 592.440889 230.4 874.040889a56.888889 56.888889 0 1 1-80.440889-80.440889L431.559111 512z" fill="#ffffff"></path></svg>
            </button>
          </div>
          <div className="max-h-[400px] min-h-[300px] overflow-y-auto text-[18px]">
            <div className="p-6">
              <div className="flex border-b border-[#8A84A3] text-[#8A84A3] text-center">
                <div className="w-1/5">{t('personalInfo.date')}</div>
                <div className="w-2/5 px-2">{t('personalInfo.mint')}</div>
                <div className="w-1/5">{t('personalInfo.cost')}</div>
                <div className="w-1/5">{t('personalInfo.hash')}</div>
              </div>
              {mintHistoryLoading ?
                <div className="animate-pulse">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="w-full h-6 bg-gray-500 rounded-md mt-4"></div>
                  ))}
                </div>
              :
              mintHistory?.length > 0 ?
              mintHistory.map((item, index) => (
                <div key={index} className="flex text-[#8A84A3] text-center text-white mt-3 items-center text-[12px] md:text-[16px]">
                  <div className="w-1/5">{formatDatetime(item?.createdAt)}</div>
                  <div className="w-2/5 px-2">
                    {item?.item?.map((item2:any) => (
                      <div key={item2?.id}>{item2?.name} <span className='text-[#2EBD85] ml-2'>x1</span></div>
                    ))}
                  </div>
                  <div className="w-1/5 text-[#F6465D]">-{item?.cost}</div>
                  <div className="w-1/5">{chainConfig && <a className="text-[#757895] underline text-[12px] md:text-[16px]" href={chainConfig?.scan + item?.txHash} target="_blank">{t('personalInfo.viewHash')}</a>}</div>
                </div>
              ))
              :
              <div className="py-16 text-center">
                <svg className="mx-auto" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="48" height="48"><path d="M855.6 427.2H168.5c-12.7 0-24.4 6.9-30.6 18L4.4 684.7C1.5 689.9 0 695.8 0 701.8v287.1c0 19.4 15.7 35.1 35.1 35.1H989c19.4 0 35.1-15.7 35.1-35.1V701.8c0-6-1.5-11.8-4.4-17.1L886.2 445.2c-6.2-11.1-17.9-18-30.6-18zM673.4 695.6c-16.5 0-30.8 11.5-34.3 27.7-12.7 58.5-64.8 102.3-127.2 102.3s-114.5-43.8-127.2-102.3c-3.5-16.1-17.8-27.7-34.3-27.7H119c-26.4 0-43.3-28-31.1-51.4l81.7-155.8c6.1-11.6 18-18.8 31.1-18.8h622.4c13 0 25 7.2 31.1 18.8l81.7 155.8c12.2 23.4-4.7 51.4-31.1 51.4H673.4zM819.9 209.5c-1-1.8-2.1-3.7-3.2-5.5-9.8-16.6-31.1-22.2-47.8-12.6L648.5 261c-17 9.8-22.7 31.6-12.6 48.4 0.9 1.4 1.7 2.9 2.5 4.4 9.5 17 31.2 22.8 48 13L807 257.3c16.7-9.7 22.4-31 12.9-47.8zM375.4 261.1L255 191.6c-16.7-9.6-38-4-47.8 12.6-1.1 1.8-2.1 3.6-3.2 5.5-9.5 16.8-3.8 38.1 12.9 47.8L337.3 327c16.9 9.7 38.6 4 48-13.1 0.8-1.5 1.7-2.9 2.5-4.4 10.2-16.8 4.5-38.6-12.4-48.4zM512 239.3h2.5c19.5 0.3 35.5-15.5 35.5-35.1v-139c0-19.3-15.6-34.9-34.8-35.1h-6.4C489.6 30.3 474 46 474 65.2v139c0 19.5 15.9 35.4 35.5 35.1h2.5z" fill="#757895"></path></svg>
              </div>  
              }
            </div>
          </div>
          <div className="w-full h-10 bg-[#201E2A]"></div>
        </div>
      </Modal>
    </main>
  ); 
}