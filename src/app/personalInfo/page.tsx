"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useErrCode } from "@/datas/errCode";
import { bindTgAccount, getKScore, getUserInfo } from "@/services/apis/user";
import { formatNumberWithCommas } from "@/utils/number";
import { getNFTData } from "@/services/apis/nft";

export default function YourNFTs() {
  const t = useTranslations();
  const { userInfo, handleSetUserInfo, triggerModalOpen } = useAppContext();
  const [addr, setAddr] = useState<string>('');
  const [kscore, setKscore] = useState<number>(0);
  const [kscoreLoading, setKscoreLoading] = useState<boolean>(true);

  const [NFTlist, setNFTList] = useState<any[]>([]);
  const [NFTlistLoading, setNFTListLoading] = useState<boolean>(true);

  const [bindEvmAccountLoading, setBindEvmAccountLoading] = useState<boolean>(false);
  const [bindTgAccountLoading, setBindTgAccountLoading] = useState<boolean>(false);
  const reBindTimeout = useRef<any>(null);

  const [NFTData, setNFTData] = useState<any>(null);

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

    const refCode = localStorage.getItem('kkRefCode') ? localStorage.getItem('kkRefCode') : '';
    await bindTgAccount(tempToken)
    .then(async(res) => {
      const data = res?.data;
      if(data.status == 10000 && data?.data.botUrl) {
        window.open(data?.data.botUrl, '_blank');
        reConnect = true;
        reBindTimeout.current = setTimeout(() => {
          handleBindTgAccount(data?.data.bindToken, reqCount + 1);
        }, 5000);
      }
      else if(data?.data?.account) {
        clearTimeout(reBindTimeout.current);
        reBindTimeout.current = null;
        handleGetUserInfo();
      }
      else if(reqCount < 10) {
        reConnect = true;
        
        reBindTimeout.current = setTimeout(() => {
          handleBindTgAccount(tempToken, reqCount + 1);
        }, 5000);
      }
      else {
        clearTimeout(reBindTimeout.current);
        reBindTimeout.current = null;
      }
    })
    if(!reConnect) {
      setBindTgAccountLoading(false);
    }
  }

  const handleBindEvmAccount = () => {
    setBindEvmAccountLoading(true);
    
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

  const handleGetKscore = async () => {
    setKscoreLoading(true);
    await getKScore(10000)
    .then((res) => {
      const data = res?.data;
      if(data.status == 10000) {
        setKscore(data?.data || 0);
      }
      else {
        errCodeHandler(data.status)
      }
    })
    setKscoreLoading(false);
  }

  useEffect(() => {
    if(userInfo && NFTData) {
      handleGetKscore();
    }
  }, [userInfo, NFTData])

  useEffect(() => {
    handleGetNFTData();
    const addr = localStorage.getItem('kkAddress');
    setAddr(addr || '');

    return () => {
      clearTimeout(reBindTimeout.current);
      reBindTimeout.current = null;
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
                  <button className="text-[#8D73FF] cursor-pointer hover:underline">{t('yourNFTs.viewHistory')}</button>
                </div>
                <div className="flex flex-wrap">
                  <div className="flex flex-wrap w-full md:w-1/2 md:border-r md:border-[#241E33] px-6 md:px-20 py-3 justify-between">
                    <div className="w-full md:w-auto">
                      <div className="text-[#8D73FF] text-[18px]">{t('yourNFTs.yourTgAccount')}</div>
                      <div className="mt-2 leading-none">
                      {userInfo ? 
                        <>
                        {userInfo?.tgAccount ? 
                          <div className="text-[#FEBD32] text-[30px]">{userInfo?.tgAccount}</div>
                        :
                          <button className="text-[#757895] flex items-end border-b border-b-transparent hover:border-b-[#757895]" onClick={() => handleBindTgAccount()}>
                            <div className="text-[30px]">{t('yourNFTs.none')}</div>
                            <div className="text-[20px] ml-1 pb-1">({t('yourNFTs.bindTgAccount')})&gt;</div>
                          </button>
                        }
                        </>
                        :
                        <div className="animate-pulse w-40 h-[30px] bg-gray-500 rounded-lg"></div>
                      }
                      </div>
                    </div>
                    <div className="w-full md:w-auto mt-12 md:mt-0">
                      <div className="text-[#8D73FF] text-[18px]">{t('yourNFTs.yourWallet')}</div>
                      <div className="mt-2 leading-none">
                      {userInfo ? 
                        <>
                        {userInfo?.account ? 
                          <div className="text-[#FEBD32] text-[30px]">
                            {userInfo?.account?.length > 4 ? userInfo?.account?.substring(0, 4) + '...' + userInfo?.account?.substring(userInfo?.account?.length - 4, userInfo?.account?.length) : userInfo?.account}
                          </div>
                        :
                          <button className="text-[#757895] flex items-end border-b border-b-transparent hover:border-b-[#757895]" onClick={handleBindEvmAccount}>
                            <div className="text-[30px]">{t('yourNFTs.none')}</div>
                            <div className="text-[20px] ml-1 pb-1">({t('yourNFTs.bindWallet')})&gt;</div>
                          </button>
                        }
                        </>
                        :
                        <div className="animate-pulse w-40 h-[30px] bg-gray-500 rounded-lg"></div>
                      }
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 px-6 md:px-20 py-3 mt-12 md:mt-0">
                    <div className="flex items-center space-x-8">
                      <img className="w-12 md:w-18" src="/images/kscore.png" alt="kscore" />
                      <div>
                        <div className="text-[#8D73FF] text-[18px]">{t('yourNFTs.yourKScore')}</div>
                        <div className="mt-2 leading-none">
                          {kscoreLoading ? 
                            <div className="animate-pulse w-40 h-[30px] bg-gray-500 rounded-lg"></div>
                          :
                            <div className="text-[#FEBD32] text-[30px]">{formatNumberWithCommas(kscore)}</div>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-14">
                <div className="text-[20px] xl:text-[30px] font-ethnocentric-rg text-white inline-block border-b border-[#FEBD32] leading-tight">
                  {t('yourNFTs.title')}
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
    </main>
  );
}