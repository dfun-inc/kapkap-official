"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useErrCode } from "@/datas/errCode";
import { getKScore } from "@/services/apis/user";
import { formatNumberWithCommas } from "@/utils/number";
import { getMintData, getNFTData } from "@/services/apis/nft";
import { getChainConfig } from "@/services/apis/config";
import mintNFT from "@/services/transactions/mintNFT";
import { useAccount } from "wagmi";

export default function YourNFTs() {
  const t = useTranslations();

  const { address, isConnected } = useAccount();
  const { userInfo, triggerModalOpen } = useAppContext();
  const [addr, setAddr] = useState<string>('');
  const [kscore, setKscore] = useState<number>(0);
  const [kscoreLoading, setKscoreLoading] = useState<boolean>(true);
  const [chainConfig, setChainConfig] = useState<any>({});
  const [NFTData, setNFTData] = useState<any>(null);

  const [choosed, setChoosed] = useState<any[]>([]);

  const { errCodeHandler } = useErrCode();

  const handleGetKscore = async () => {
    setKscoreLoading(true);
    await getKScore(10000)
    .then((res) => {
      const data = res?.data;
      if(data.status == 10000) {
        setKscore(data?.data.kScore);
      }
      else {
        errCodeHandler(data.status)
      }
    })
    setKscoreLoading(false);
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

  const handleMint = async () => {
    if(!userInfo) {
      triggerModalOpen();
      return;
    }
    if(!NFTData) {
      return;
    }

    let mintData:any = null;
    await getMintData({tokenId:[100000001], address, collect: chainConfig.NFT1155, mintContract: chainConfig.NFTFactory})
    .then((res) => {
      const data = res?.data;
      if(data.status == 10000) {
        mintData = data?.data;
      }
      else {
        errCodeHandler(data.status)
      }
    })

    if(!mintData) {
      return;
    }
    mintNFT(mintData, address, chainConfig);
  }

  useEffect(() => {
    if(userInfo && NFTData) {
      handleGetKscore();
    }
  }, [userInfo, NFTData])

  useEffect(() => {
    handleGetNFTData();
    handleGetChaninConfig();
    setChoosed([]);
    const addr = localStorage.getItem('kkAddress');
    setAddr(addr || '');
  }, [])

  return (
    <main className="mint-page min-h-screen overflow-hidden relative pt-[72px] flex flex-col">
      <div className="w-full flex-1 mt-9 relative z-2">
        <div className="max-w-[1920px] mx-auto px-5 lg:px-18 2xl:px-24">
          <div className="flex flex-col md:flex-row bg-black/50 rounded-[20px] overflow-hidden">
            <img className="w-full md:w-[280px]" src="/images/games/genkiminer2.jpg" alt="genki miner" />
            <div className="w-full md:w-auto md:flex-1">
              <div className="px-7 py-9">
                <div className="text-[20px] xl:text-[30px] font-ethnocentric-rg text-white inline-block border-b border-[#FEBD32] leading-tight">
                  {t('genkiMint.title')}
                </div>
                <div className="text-[18px] text-[#8D73FF] mt-3">
                  {t('genkiMint.desc')}
                </div>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto mt-10">
            <div className="min-w-[960px]">
              <div className="flex bg-black/50 rounded-[20px] text-center text-[#DDD5FF] py-2 text-[20px]">
                <div className="w-[80px] md:w-[100px] border-r-[2px] border-zinc-600/30 py-2">NFT</div>
                <div className="w-1/5 xl:min-w-[300px] border-r-[2px] border-zinc-600/30 py-2">{t('genkiMint.name')}</div>
                <div className="flex-1 border-r-[2px] border-zinc-600/30 py-2">{t('genkiMint.NFTPrivilege')}</div>
                <div className="w-1/5 border-r-[2px] border-zinc-600/30 py-2">{t('genkiMint.mintingCost')}</div>
                <div className="w-[160px] md:w-[200px] py-2">{t('genkiMint.mint')}</div>
              </div>

              <div className="mt-5 flex items-center bg-black/50 rounded-[20px] text-[20px]">
                <div className="w-[80px] md:w-[100px]">
                  <img className="w-full" src="/images/nft.png" alt="genki miner" />
                </div>
                <div className="w-1/5 xl:min-w-[300px] text-[#DDD5FF] text-center p-3">Genki Miner FanaticFan Medal</div>
                <div className="flex-1 text-[#69FFD3] p-3">
                  <div>Airdrop Benefits +200%</div>
                  <div>Genki Miner Gold Gain Efficiency +100%</div>
                </div>
                <div className="w-1/5 flex justify-center items-center space-x-3">
                  <img className="w-[40px]" src="/images/kscore.png" alt="kscore" />
                  <div className="text-[#FEBD32]">10000</div>
                </div>
                <div className="w-[160px] md:w-[200px] py-2">
                  {
                    !choosed.includes('10000') ?
                    <div className="w-8 h-8 mx-auto bg-[#FEBD32] flex items-center justify-center rounded-[10px] cursor-pointer">
                      <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="22" height="22"><path d="M954.843429 323.437714c0 14.299429-5.705143 28.562286-16.018286 38.838857L447.378286 853.723429c-10.276571 10.276571-24.576 16.018286-38.838857 16.018285s-28.562286-5.705143-38.838858-16.018285l-284.562285-284.562286c-10.276571-10.276571-16.018286-24.576-16.018286-38.838857s5.705143-28.562286 16.018286-38.838857l77.714285-77.714286c10.276571-10.276571 24.576-16.018286 38.838858-16.018286s28.562286 5.705143 38.838857 16.018286l168.009143 168.557714 374.857142-375.442286c10.276571-10.276571 24.576-16.018286 38.838858-16.018285s28.562286 5.705143 38.838857 16.018285l77.714285 77.714286c10.276571 10.276571 16.018286 24.576 16.018286 38.838857z" p-id="10474"></path></svg>
                    </div>
                    :
                    <div className="w-8 h-8 mx-auto border-[2px] border-[#8D73FF] rounded-[10px] cursor-pointer"></div>
                  }
                  <div className="text-[#8D73FF] text-[14px] mt-2 text-center">{t('genkiMint.limit')}: 1/1</div>
                </div>
              
              </div>
            </div>
          </div>
          
          <div className="mt-10 bg-black/50 rounded-[20px] px-12 py-8">
          {addr || userInfo ?
            <>
              <div className="text-[20px] text-[#FEBD32]">{t('genkiMint.needKScore')}</div>
              <div className="text-center mt-12">
                <Button className="text-xl font-light text-white w-40 md:w-60 text-center py-3 md:py-4" onClick={() => triggerModalOpen()}>
                  {t('genkiMint.mint')}
                </Button>
              </div>
              <div className="text-right mt-12 text-[#4E436A]">{t('genkiMint.costHint')}</div>
            </>
            :
            <div className="py-12 flex justify-center">
              <Button className="text-xl font-light text-white w-40 md:w-60 text-center py-3 md:py-4" onClick={() => triggerModalOpen()}>
                {t('menu.login')}
              </Button>
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
    </main>
  );
}