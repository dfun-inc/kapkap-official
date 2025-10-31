"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import Modal from "react-modal";
import { readContract } from "@wagmi/core";

import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import Button from "@/components/ui/Button";
import { useErrCode } from "@/datas/errCode";
import { getKScore } from "@/services/apis/user";
import { formatNumberWithCommas } from "@/utils/number";
import { getMintData, getNFTData, getRemintData, getRemintList } from "@/services/apis/nft";
import { getChainConfig } from "@/services/apis/config";
import mintNFT from "@/services/transactions/mintNFT";
import {config as wagmiConfig} from "@/config/wagmi";
import NFTFACTORYABI from "@/config/abis/NFTFactory.json";

export default function YourNFTs() {
  const t = useTranslations();

  const { address } = useAccount();
  const { userInfo, triggerModalOpen } = useAppContext();
  const [addr, setAddr] = useState<string>('');
  const [kscore, setKscore] = useState<number>(0);
  const [kscoreLoading, setKscoreLoading] = useState<boolean>(true);
  const [chainConfig, setChainConfig] = useState<any>(null);
  const [NFTData, setNFTData] = useState<any>(null);

  const [NFTListLoading, setNFTListLoading] = useState<boolean>(true);

  const [choosed, setChoosed] = useState<any[]>([]);
  const [minted, setMinted] = useState<any>({});
  const [mintedLoading, setMintedLoading] = useState<boolean>(false);
  const [choosedScore, setChoosedScore] = useState<number>(0);

  const { errCodeHandler } = useErrCode();

  const [showBindModal, setShowBindModal] = useState<boolean>(false);
  const [bindType, setBindType] = useState<string>('evm');

  const [menuIdx, setMenuIdx] = useState<number>(0);
  const [reMintList, setReMintList] = useState<any>({});

  const [mintLoading, setMintLoading] = useState<boolean>(false);

  const handleToggleChoose = (item:any) => {
    if(choosed.includes(item)) {
      setChoosed(choosed.filter((i:any) => i != item));
    }
    else {
      setChoosed([...choosed, item]);
    }
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
    setNFTListLoading(true);

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

    setNFTListLoading(false);
  }

  const handleToMint = () => {
    if(mintLoading) {
      return;
    }
    if(!userInfo) {
      triggerModalOpen();
      return;
    }
    if(!NFTData || !chainConfig) {
      return;
    }
    if(!userInfo?.account) {
      setBindType('evm');
      setShowBindModal(true);
      return;
    }
    if(!userInfo?.tgAccount) {
      setBindType('tg');
      setShowBindModal(true);
      return;
    }

    setMintLoading(true);
    if(menuIdx == 0) {
      handleMint();
    }
    else if(menuIdx == 1) {
      handleRemint();
    }
  }

  const handleMint = async () => {

    let mintData:any = null;
    await getMintData({tokenId:choosed, address, collect: chainConfig.NFT1155, mintContract: chainConfig.NFTFactory})
    .then((res) => {
      const data = res?.data;
      if(data.status == 10000) {
        mintData = data?.data;
      }
      else {
        errCodeHandler(data.status)
      }
    })
    .catch((err) => {
      toast.error(err?.message ? err.message : err);
    })

    if(!mintData) {
      return;
    }
    try{
      await mintNFT(mintData, address, chainConfig)
      .then((res) => {
        toast.success(t('genkiMint.mintSuccess'));
      });
    }
    catch(err) {
      console.log(err)
      return;
    }

    handleGetRemintList();
    handleCheckMinted();
    setMintLoading(false);
  }

  const handleRemint = async () => {
    let mintData:any = null;
    await getRemintData({tokenId:choosed, address, collect: chainConfig.NFT1155, mintContract: chainConfig.NFTFactory})
    .then((res) => {
      const data = res?.data;
      if(data.status == 10000) {
        mintData = data?.data;
      }
      else {
        errCodeHandler(data.status)
      }
    })
    .catch((err) => {
      toast.error(err?.message ? err.message : err);
    })

    if(!mintData) {
      return;
    }
    try{
      await mintNFT(mintData, address, chainConfig)
      .then((res) => {
        toast.success(t('genkiMint.mintSuccess'));
      });
    }
    catch(err) {
      console.log(err)
      return;
    }

    handleGetRemintList();
    handleCheckMinted();
    setMintLoading(false);
  }

  const handleGetRemintList = async () => {
    await getRemintList()
    .then((res) => {
      const data = res?.data;
      if(data.status == 10000) {
        setReMintList(data?.data ? data.data : {});
      }
      else {
        errCodeHandler(data.status)
      }
    })
    .catch((err) => {
      toast.error(err?.message ? err.message : err);
    })
  }

  const handleCheckMinted = async () => {
    let tempIds:string[] = [];
    Object.entries(NFTData[10000]?.ids).map(([key]) => {
      tempIds.push(key);
    })
    setMintedLoading(true);
    await readContract(wagmiConfig, {
      address: chainConfig.NFTFactory,
      abi: NFTFACTORYABI,
      functionName: 'getHistoryCount',
      args: [chainConfig?.NFT1155, userInfo?.account, '1155', tempIds],
    })
    .then((res:any) => {
      let tempObj:any = {};
      res.forEach((item:any, index:number) => {
        tempObj[tempIds[index]] = Number(item);
      })
      setMinted(tempObj);
    })
    setMintedLoading(false);
  }

  useEffect(() => {
    setChoosed([]);
  }, [menuIdx])

  useEffect(() => {
    if(userInfo) {
      handleGetKscore();
      handleGetRemintList();
    }
    else {
      setAddr('');
      setReMintList({});
      setKscore(0);
    }
  }, [userInfo])

  useEffect(() => {
    if(userInfo?.account && userInfo?.tgAccount && chainConfig && NFTData) {
      handleCheckMinted();
    }
  }, [userInfo, chainConfig, NFTData])

  useEffect(() => {
    if(NFTData) {
      let sum = 0;
      choosed.forEach((item:any) => {
        sum += NFTData[10000]?.ids[item]?.kscore;
      })
      setChoosedScore(sum);
    }
  }, [choosed, NFTData])

  useEffect(() => {
    setMenuIdx(0)
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
              <div className="flex justify-center">
                <div className="flex bg-black/50 rounded-[20px] p-3 justify-center space-x-3">
                  <button className={"w-30 text-[20px] text-white py-2 rounded-[10px] " + (menuIdx == 0 ? 'bg-[#FEBD32]' : 'hover:bg-[#FEBD32]')} onClick={() => setMenuIdx(0)}>
                    {t('genkiMint.mint')}
                  </button>
                  <button className={"w-30 text-[20px] text-white py-2 rounded-[10px] " + (menuIdx == 1 ? 'bg-[#FEBD32] ' : 'hover:bg-[#FEBD32]') + (userInfo == null ? ' cursor-not-allowed' : '')} onClick={userInfo ? () => setMenuIdx(1) : () => {}}>
                    {t('genkiMint.minting')}
                  </button>
                </div>
              </div>
              <div className="flex bg-black/50 rounded-[20px] text-center text-[#DDD5FF] py-2 text-[20px] mt-6">
                <div className="w-[80px] md:w-[100px] border-r-[2px] border-zinc-600/30 py-2">NFT</div>
                <div className="w-1/5 xl:min-w-[300px] border-r-[2px] border-zinc-600/30 py-2">{t('genkiMint.name')}</div>
                <div className="flex-1 border-r-[2px] border-zinc-600/30 py-2">{t('genkiMint.NFTPrivilege')}</div>
                <div className="w-1/5 border-r-[2px] border-zinc-600/30 py-2">{t('genkiMint.mintingCost')}</div>
                <div className="w-[160px] md:w-[200px] py-2">{t('genkiMint.mint')}</div>
              </div>

              {NFTListLoading ?
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="animate-pulse mt-5 flex items-center bg-black/50 rounded-[20px] text-[20px]">
                    <div className="w-[80px] md:w-[100px] py-2">
                      <div className="rounded-[10px] bg-gray-500 w-full aspect-[1/1.25]"></div>
                    </div>
                    <div className="w-1/5 xl:min-w-[300px]">
                      <div className="w-2/5 h-[20px] bg-gray-500 rounded-[10px] mx-auto"></div>
                    </div>
                    <div className="flex-1">
                      <div className="w-4/5 h-[20px] bg-gray-500 rounded-[10px]"></div>
                      <div className="w-4/5 h-[20px] bg-gray-500 rounded-[10px] mt-2"></div>
                    </div>
                    <div className="w-1/5">
                      <div className="w-20 h-[20px] bg-gray-500 rounded-[10px] mx-auto"></div>
                    </div>
                    <div className="w-[160px] md:w-[200px]">
                      <div className="w-8 h-8 bg-gray-500 rounded-[10px] mx-auto"></div>
                    </div>
                  </div>
                ))
              :
              <>
              {Object.entries(NFTData[10000]?.ids)?.map(([key, value]:[string, any], index:number) => (
              <div key={index} className="">
                {(menuIdx == 0 && (!reMintList[key] || Boolean(minted[key])) || menuIdx == 1 && Boolean(reMintList[key]) && !minted[key]) && <div key={index} className="mt-5 flex items-center bg-black/50 rounded-[20px] text-[20px]">
                  <div className="w-[80px] md:w-[100px]">
                    {chainConfig != null && <img className="w-full" src={chainConfig.IPFS.replace('token', 'image') + key + '.png'} alt="" />}
                  </div>
                  <div className="w-1/5 xl:min-w-[300px] text-[#DDD5FF] text-center p-3">{value?.name}</div>
                  <div className="flex-1 text-[#69FFD3] p-3">{value?.desc}</div>
                  <div className="w-1/5 flex justify-center items-center space-x-3">
                    <img className="w-[40px]" src="/images/kscore.png" alt="kscore" />
                    <div className="text-[#FEBD32]">{formatNumberWithCommas(value.kscore)}</div>
                  </div>
                  <div className="w-[160px] md:w-[200px] py-2">
                    {userInfo != null ?
                      mintedLoading ? 
                        <div className="w-8 h-8 bg-gray-500 rounded-[10px] mx-auto"></div>
                        :
                        <>
                        {minted[key] >= 1 ?
                          <>
                            <div className="w-8 mx-auto cursor-not-allowed opacity-50">
                              <div className="w-full h-8 border-[2px] border-[#8D73FF] rounded-[10px]"></div>
                            </div>
                            <div className="text-[#FF4575] text-[14px] mt-2 text-center">{t('genkiMint.limit')}: 0/{value?.limit}</div>
                          </>
                          :
                          <>
                            <div className="w-8 cursor-pointer mx-auto" onClick={() => handleToggleChoose(key)}>
                            {
                              choosed.includes(key) ?
                                <div className="w-full h-8 bg-[#FEBD32] flex items-center justify-center rounded-[10px]">
                                  <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="22" height="22"><path d="M954.843429 323.437714c0 14.299429-5.705143 28.562286-16.018286 38.838857L447.378286 853.723429c-10.276571 10.276571-24.576 16.018286-38.838857 16.018285s-28.562286-5.705143-38.838858-16.018285l-284.562285-284.562286c-10.276571-10.276571-16.018286-24.576-16.018286-38.838857s5.705143-28.562286 16.018286-38.838857l77.714285-77.714286c10.276571-10.276571 24.576-16.018286 38.838858-16.018286s28.562286 5.705143 38.838857 16.018286l168.009143 168.557714 374.857142-375.442286c10.276571-10.276571 24.576-16.018286 38.838858-16.018285s28.562286 5.705143 38.838857 16.018285l77.714285 77.714286c10.276571 10.276571 16.018286 24.576 16.018286 38.838857z" p-id="10474"></path></svg>
                                </div>
                                :
                              <div className="w-full h-8 border-[2px] border-[#8D73FF] rounded-[10px]"></div>
                            }
                            </div>
                            <div className="text-[#8D73FF] text-[14px] mt-2 text-center">{t('genkiMint.limit')}: {value?.limit}/{value?.limit}</div>
                          </>
                        }
                        </>
                      :
                      <>
                        <div className="w-8 mx-auto cursor-not-allowed opacity-50">
                          <div className="w-full h-8 border-[2px] border-[#8D73FF] rounded-[10px]"></div>
                        </div>
                        <div className="text-[#8D73FF] text-[14px] mt-2 text-center">{t('genkiMint.limit')}: {value?.limit}/{value?.limit}</div>
                      </>
                    }
                  </div>
                </div>}
              </div>
              ))}
              </>
              }
            </div>
          </div>
          
          <div className="mt-10 bg-black/50 rounded-[20px] px-12 py-8">
          {addr || userInfo ?
            <>
              <div className="text-[20px] text-[#FEBD32]">{t('genkiMint.needKScore')}</div>
              <div className="mt-2 bg-[#e79f2e] rounded-[10px] w-full h-[40px] flex items-center relative">
                <div className="text-center text-[20px] leading-none w-full relative z-2 ">
                  {choosedScore} / {kscoreLoading ? '-' : kscore}
                </div>
                {kscore > 0 && <div className={"absolute top-0 left-0 h-full rounded-[10px] z-1 " + (choosedScore <= kscore || kscoreLoading ? 'bg-[#9358ff]' : 'bg-[#dc4a4a]')}
                style={{"width": (choosedScore/kscore > 1 ? 1 : choosedScore/kscore) * 100 + "%"}}></div>}
              </div>
              <div className="text-center mt-12">
                <Button className={"text-xl font-light text-white w-40 md:w-60 text-center py-3 md:py-4 " + (choosed?.length > 0 ? '' : 'cursor-not-allowed')} onClick={choosed?.length > 0 ? handleToMint : () => {}}>
                  {t('genkiMint.mint')}
                  {mintLoading && <span className="animate-spin inline-block w-5 h-5 border-2 border-t-white border-b-white/10 ml-2"></span>}
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

      <Modal
        isOpen={showBindModal}
        onRequestClose={() => setShowBindModal(false)}
        shouldCloseOnOverlayClick={true}
        className=""
      >
        <div className="w-9/10 md:w-[400px] text-center p-6 bg-black rounded-lg">
          <div className="text-[20px] text-white text-center">
            {bindType == 'evm' ? t('error.notBindEvmAccount') : t('error.notBindTgAccount')}
          </div>
          
          <Button href="/personalInfo" className="text-xl font-light text-white w-50 md:w-60 text-center py-3 md:py-4 mt-6" onClick={() => triggerModalOpen()}>
            {t('genkiMint.goToBind')}
          </Button>
        </div>
      </Modal>
    </main>
  );
}