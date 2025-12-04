"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import Button from "@/components/ui/Button";
import { useErrCode } from "@/datas/errCode";
import { bindEvmAccount, bindTgAccount, bindTonAccount, getKScore, getKScoreHistory, getUserInfo } from "@/services/apis/user";
import { formatNumberWithCommas } from "@/utils/number";
import { getEvmMint721History, getTonMint721History, getNFTData, getEvmMint1155History, getNFT1155Data } from "@/services/apis/nft";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { readContract, signMessage, switchChain } from "@wagmi/core";
import {tgtChain, config as wagmiConfig} from "@/config/wagmi";
import NFT1155ABI from "@/config/abis/NFT1155.json";
import { getChainConfig } from "@/services/apis/config";
import Modal from 'react-modal';
import { formatDatetime } from "@/utils/time";
import { toast } from "react-toastify";
import Link from "next/link";
import BlindboxRulesModal from "@/components/BlindboxRulesModal";
// import { tonConnectUI } from "@/config/ton";

export default function personalInfo() {
  const t = useTranslations();
  const { configData, userInfo, handleSetUserInfo, triggerModalOpen } = useAppContext();
  const [addr, setAddr] = useState<string>('');
  const [kscore, setKscore] = useState<number>(0);
  const [kscoreLoading, setKscoreLoading] = useState<boolean>(false);

  const [NFTlist, setNFTList] = useState<any[]>([]);
  const [NFTlistLoading, setNFTListLoading] = useState<boolean>(false);

  const [bindEvmAccountLoading, setBindEvmAccountLoading] = useState<boolean>(false);
  const [bindTgAccountLoading, setBindTgAccountLoading] = useState<boolean>(false);
  const [bindTonAccountLoading, setBindTonAccountLoading] = useState<boolean>(false);
  const reBindTimeout = useRef<any>(null);

  const [NFTData, setNFTData] = useState<any>(null);

  const [mintHistoryModal, setMintHistoryModal] = useState<boolean>(false);
  const [mintHistory, setMintHistory] = useState<any[]>([]);
  const [mintHistoryLoading, setMintHistoryLoading] = useState<boolean>(false);
  const [historyTabIdx, setHistoryTabIdx] = useState(0)

  const [kscoreHistoryModal, setKscoreHistoryModal] = useState<boolean>(false);
  const [kscoreHistory, setKscoreHistory] = useState<any[]>([]);
  const [kscoreHistoryLoading, setKscoreHistoryLoading] = useState<boolean>(false);

  const { openConnectModal } = useConnectModal();
  const { address, isConnected, connector, isDisconnected } = useAccount();
  const { disconnect } = useDisconnect()
  const bindEvmForce = useRef<boolean>(false);

  const [showToTgModal, setShowToTgModal] = useState(false);
  const [tgLink, setTgLink] = useState<string>('');
  const [tgWebLoginToken, setTgWebLoginToken] = useState<string>('');

  const { errCodeHandler } = useErrCode();

  const [curNFTItem, setCurNFTItem] = useState<any>(null);
  const [showNFTDetailModal, setShowNFTDetailModal] = useState<boolean>(false);

  const [ownIdx, setOwnIdx] = useState(0);

  const [NFT1155Data, setNFT1155Data] = useState<any>(null);

  const blindboxRulesRef = useRef<any>(null);

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
          /*
          const a = document.createElement('a');
          a.href = data?.data.botUrl;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.click();
          */
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
          handleWalletDisconnect();
          errCodeHandler(data.status, data.msg)
        }
      })
      .catch(() => {
        handleWalletDisconnect();
      })
    }
    catch(err) {
      handleWalletDisconnect();
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
        errCodeHandler(data.status, data.msg)
      }
    })
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

  const handleOpenEvmConnectModal = () => {
    bindEvmForce.current = true;
    handleWalletDisconnect();
    openConnectModal?.();
  }

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

  const handleWalletDisconnect = async() => {
    localStorage.removeItem('wagmi.wallet');
    localStorage.removeItem('wagmi.connected')
    localStorage.removeItem('wagmi.store')
    localStorage.removeItem('wagmi.metaMask')
    sessionStorage.clear()
    await disconnect();
  }

  const handleGetOpbnbNFTList = async() => {
    if(!userInfo?.mpcAccount) {
      setNFTList([])
      return;
    }
    setNFTListLoading(true);

    let _addr:any = '';
    if(NFT1155Data?.nftContract) {
      _addr = process.env.NEXT_PUBLIC_BUILD_ENV == 'dev' ? NFT1155Data?.nftContract.test : NFT1155Data?.nftContract.prod;
    }

    let tokenIds:number[] = [];
    await readContract(wagmiConfig, {
      address: _addr,
      abi: NFT1155ABI,
      functionName: 'tokensOfOwner',
      args: [userInfo?.mpcAccount, 0, 1000],
    })
    .then((res:any) => {
      console.log(res)
      res.forEach((item:any) => {
        if(Number(item?.amount) > 0) {
          tokenIds.push(Number(item?.id));
        }
      })
    })

    let tempArr: any[] = [];
    console.log(tokenIds)
    if(tokenIds.length) {
      await getEvmMint1155History()
      .then(res => {
        const data = res?.data;
        if(data.status == 10000) {
          tokenIds.map((token) => {
            data?.data.forEach((item:any) => {
              const ids = item?.ids.split(',');
              if(ids.includes(token?.toString())) {
                let tempItem:any = { originalTokenId: token };
                Object.entries(NFT1155Data['ids']).find(([key, value]:any) => {
                  if(key == token) {
                    tempItem = {id:key, ...value}
                  }
                });
                tempArr.push({originalTokenId: token, item: tempItem})
              }
            })
          });
          console.log(tempArr)
        }
      })
    }
    setNFTList(tempArr)
    setNFTListLoading(false);
  }

  const handleGetTonNFTList = async() => {
    setNFTListLoading(true);

    await getTonMint721History()
    .then(res => {
      const data = res?.data;
      if(data.status == 10000) {
        let temp:any[] = [];
        data?.data.forEach((item:any) => {
          Object.entries(NFTData[item.project]['ids']).find(([key, value]:any) => {
            if(key == item.resId) {
              temp.push({...item, originalTokenId: item.id, project: NFTData[item.project].project, item: {project: item.project, ...value}});
            }
          });
        })
        console.log(temp)
        setNFTList(temp);
      }
      else {
        errCodeHandler(data.status, data.msg)
      }
    })
    setNFTListLoading(false);
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
        errCodeHandler(data.status, data.msg)
      }
    })
    setKscoreHistoryLoading(false);
  }

  const handleGetMintHistory = async (tab: number) => {
    setMintHistoryLoading(true);
    setMintHistory([])

    try {
      const res = tab ? await getEvmMint1155History() : await getTonMint721History();

      if(res) {
        const data = res?.data;
        if(data.status == 10000) {
          let temp:any[] = [];
          data?.data.forEach((item:any) => {
            if(tab == 0) {
              Object.entries(NFTData[item.project]['ids']).find(([key, value]:any) => {
                if(key == item.resId) {
                  temp.push({...item, item: value});
                }
              });
            }
            else {
              const ids = item?.ids.split(',');
              const amounts = item?.amounts.split(',');
              let items:any[]= [];
              Object.entries(NFT1155Data['ids']).find(([key, value]:any) => {
                if(ids.includes(key)) {
                  items.push({amount: amounts[ids.indexOf(key)], item: value});
                }
              });
              console.log(items)
              temp.push({...item, items});
            }
          })
          console.log(temp)
          setMintHistory(temp);
        }
        else {
          errCodeHandler(data.status, data.msg)
        }
      }
    }
    catch{}
    setMintHistoryLoading(false);
  }

  const handleShowNFTDetailModal = (item:any) => {
    setCurNFTItem(item);
    setShowNFTDetailModal(true);
  }

  const handleShowBlindboxRulesModal = () => {
    blindboxRulesRef.current.showModal();
  }

  const handleCopyMpcAccount = (text: string) => {
    navigator.clipboard.writeText(text)
    .then(() => {;
      toast.success(t('other.copySuccess'))
    })
    .catch((err) => {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        document.execCommand("copy");
        toast.success(t('other.copySuccess'))
      } catch (err) {
        console.log(err)
      }
      
      document.body.removeChild(textarea);
    })
  }

  useEffect(() => {
    if(kscoreHistoryModal) {
      handleGetKscoreHistory();
    }
  }, [kscoreHistoryModal])

  useEffect(() => {
    if(mintHistoryModal) {
      handleGetMintHistory(historyTabIdx);
    }
    else {
      setHistoryTabIdx(0);
    }
  }, [mintHistoryModal, historyTabIdx])

  useEffect(() => {
    if(userInfo?.tgAccount && NFTData) {
      if(ownIdx) {
        handleGetOpbnbNFTList();
      }
      else {
        handleGetTonNFTList();
      }
    }
  }, [userInfo, NFTData, ownIdx])

  useEffect(() => {
    if(userInfo && userInfo?.tgAccount) {
      handleGetKscore();

      if(!userInfo?.account) {
        handleWalletDisconnect();
      }
    }
    else {
      setAddr('');
    }

    if(!userInfo) {
      setKscore(0);
      setNFTList([]);
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
    handleGetNFT1155Data();
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
          <div className="blind-box-banner-sm rounded-[20px] overflow-hidden px-6 md:px-18 py-6 md:py-12">
            <div className="font-univia-pro-bold text-[20px] md:text-[60px] 2xl:text-[70px] leading-none">{t('blindbox.bannerTitle')}</div>
            <div className="text-[16px] md:text-[40px] 2xl:text-[50px] text-[#FEBD32] leading-none mt-6">{t('blindbox.bannerDesc')}</div>
            <div className="mt-9 flex justify-between md:justify-start">
              <Link href="/mysteryBox" className="btn-common w-[160px] md:w-[260px] cursor-pointer relative rounded-lg overflow-hidden pb-1 inline-block md:mr-15">
                <div className="btn-common-box py-2 md:py-4 text-[20px] md:text-[30px] text-center rounded-lg z-1 transition-all duration-200 bg-[#8FC31F] relative z-1">
                  {t('blindbox.joinNow')}
                </div>
                <div className="absolute bottom-0 left-0 w-full h-2 z-0 bg-[#638C0B]"></div>
              </Link>
              <Button className="w-[160px] md:w-[260px] py-2 md:py-4 text-[20px] md:text-[30px]" onClick={handleShowBlindboxRulesModal}>
                {t('blindbox.airdropRules')}
              </Button>
            </div>
          </div>
          {addr || userInfo ?
            <>
              <div className="bg-black/50 relative px-4 py-6 rounded-[20px] mt-9">
                <div className="flex justify-end">
                  <button className="text-[#8D73FF] cursor-pointer hover:underline" onClick={() => setKscoreHistoryModal(true)}>{t('personalInfo.viewHistory')}</button>
                </div>
                <div className="flex flex-wrap">
                  <div className="flex flex-wrap w-full md:w-[65%] md:border-r md:border-[#241E33] px-6 md:px-9 2xl:px-15 py-3 justify-between">
                    <div className="w-full md:w-[37.5%]">
                      <div className="text-[#8D73FF] text-[18px]">{t('personalInfo.yourTgAccount')}</div>
                      <div className="mt-2 leading-none">
                      {userInfo ? 
                        <>
                        {userInfo?.tgAccount ? 
                          <div className="text-[#FEBD32] text-[20px]">{userInfo?.tgAccount}</div>
                        :
                          bindTgAccountLoading ?
                            <div className="animate-spin w-7 h-7 border-2 border-[#8D73FF] border-t-transparent rounded-full"></div>
                          :
                          <button className="text-[#757895] flex items-end border-b border-b-transparent hover:border-b-[#757895]" onClick={() => handleBindTgAccount()}>
                            <div className="text-[20px]">{t('personalInfo.none')}</div>
                            <div className="text-[16px] ml-1 pb-1">({t('personalInfo.bindTgAccount')})&gt;</div>
                          </button>
                        }
                        </>
                        :
                        <div className="animate-pulse w-40 h-[30px] bg-gray-500 rounded-lg"></div>
                      }
                      </div>
                    </div>
                    <div className="w-full md:w-[37.5%] mt-12 md:mt-0">
                      <div className="text-[#8D73FF] text-[18px] md:pl-10">{t('personalInfo.yourWallet')}</div>
                      <div className="mt-1 leading-none flex items-center space-x-3">
                        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="26" height="26"><path d="M234.837333 156.842667L506.581333 0l271.701334 156.842667L678.4 214.784l-171.818667-98.901333-171.861333 98.901333-99.882667-57.941333zM778.24 354.645333L678.4 296.704l-171.818667 98.901333-171.861333-98.901333-99.882667 57.941333v115.882667l171.818667 98.901333v197.802667l99.925333 57.941333 99.882667-57.941333v-197.802667l171.818667-98.901333V354.645333z m0 313.685334v-115.882667L678.4 610.389333v115.882667l99.882667-57.941333z m70.954667 40.96l-171.818667 98.901333v115.882667l271.701333-156.842667V453.546667l-99.882666 57.941333v197.802667z m-99.882667-453.546667l99.84 57.941333v115.882667l99.925333-57.941333V255.744l-99.882666-57.941333-99.882667 57.941333zM406.613333 850.176v115.882667L506.581333 1024l99.882667-57.941333v-115.882667l-99.882667 57.941333-99.925333-57.941333z m-171.818666-181.845333l99.882666 57.941333v-115.882667l-99.882666-57.941333v115.882667z m171.818666-412.586667l99.925334 57.941333 99.882666-57.941333-99.882666-57.941333L406.613333 255.744z m-242.773333 57.941333l99.925333-57.941333L163.84 197.802667 64 255.744V371.626667l99.882667 57.941333V313.685333z m0 197.802667L64 453.546667v313.685333l271.744 156.885333v-115.925333L163.84 709.290667v-197.802667z" fill="#F0B90B"></path></svg>
                        {userInfo ? 
                          <>
                          {userInfo?.account ? 
                            <div className="text-[#FEBD32] text-[20px]">
                              {userInfo?.account?.length > 4 ? userInfo?.account?.substring(0, 4) + '...' + userInfo?.account?.substring(userInfo?.account?.length - 4, userInfo?.account?.length) : userInfo?.account}
                            </div>
                          :
                          bindEvmAccountLoading ?
                            <div className="animate-spin w-7 h-7 border-2 border-[#8D73FF] border-t-transparent rounded-full"></div>
                          :
                            <button className="text-[#757895] flex items-end border-b border-b-transparent hover:border-b-[#757895]" onClick={handleOpenEvmConnectModal}>
                              <div className="text-[20px]">{t('personalInfo.none')}</div>
                              <div className="text-[16px] ml-1 pb-1">({t('personalInfo.bindWallet')})&gt;</div>
                            </button>
                          }
                          </>
                          :
                          <div className="animate-pulse w-40 h-[30px] bg-gray-500 rounded-lg"></div>
                        }
                      </div>
                    </div>
                    <div className="w-full md:w-[25%] mt-12 md:mt-0">
                      <div className="text-[#8D73FF] text-[18px]">{t('personalInfo.custodialWallet')}</div>
                      <div className="mt-2 leading-none">
                        {userInfo ? 
                          <>
                          {userInfo?.mpcAccount && 
                            <div className="text-[#FEBD32] text-[20px] cursor-pointer underline" onClick={() => handleCopyMpcAccount(userInfo?.mpcAccount)}>
                              {userInfo?.mpcAccount?.length > 4 ? userInfo?.mpcAccount?.substring(0, 4) + '...' + userInfo?.mpcAccount?.substring(userInfo?.mpcAccount?.length - 4, userInfo?.mpcAccount?.length) : userInfo?.mpcAccount}
                            </div>
                          }
                          </>
                          :
                          <div className="animate-pulse w-40 h-[30px] bg-gray-500 rounded-lg"></div>
                        }
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-[35%] px-6 md:px-12 2xl:px-20 py-3 mt-12 md:mt-0">
                    <div className="flex items-center space-x-8">
                      <img className="w-12 md:w-18" src="/images/kscore.png" alt="kscore" />
                      <div>
                        <div className="text-[#8D73FF] text-[18px]">{t('personalInfo.yourKScore')}</div>
                        <div className="mt-2 leading-none">
                          {kscoreLoading ? 
                            <div className="animate-pulse w-40 h-[30px] bg-gray-500 rounded-lg"></div>
                          :
                            <div className="text-[#FEBD32] text-[24px]">{kscore ? formatNumberWithCommas(kscore) : 0}</div>
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
                <div className="relative">
                  <div className="flex justify-center py-3 mt-3">
                    <div className="flex bg-[#201E2A] rounded-[10px] p-2 justify-center space-x-3">
                      <button className={"w-30 text-[20px] text-white py-2 rounded-[10px] " + (ownIdx == 0 ? 'bg-[#FEBD32]' : 'hover:bg-[#FEBD32] bg-black/20')} onClick={() => setOwnIdx(0)}>{t('personalInfo.inGame')}</button>
                      <button className={"relative w-30 text-[20px] text-white py-2 rounded-[10px] " + (ownIdx == 1 ? 'bg-[#FEBD32] ' : 'hover:bg-[#FEBD32] bg-black/20')} onClick={() => setOwnIdx(1)}>
                        OP-BNB
                        <span className="text-[11px] text-zinc-200 bg-[#2EBD85] p-1 rounded-lg absolute bottom-full translate-y-1/2 -right-2">{t('nft.airdrop')}</span>
                      </button>
                    </div>
                  </div>
                  {ownIdx == 1 && <div className="absolute left-0 top-full w-full text-center text-[14px] text-[#8A84A3]">{t('personalInfo.bscListHint')}</div>}
                </div>
                <div className="">
                  {NFTlistLoading ? 
                    <div className="animate-pulse grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 lg:gap-15 mt-12">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="w-full aspect-[3/4] bg-gray-500 rounded-lg"></div>
                      ))}
                    </div>
                  :
                    <>{
                    NFTlist?.length > 0 ?
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 lg:gap-15 mt-12">
                      {configData != null && NFTlist.map((item, index) => (
                        <div key={index} className="w-full relative hover:scale-105 transition-transform duration-300 rounded-[20px]" onClick={() => handleShowNFTDetailModal(item?.item)}>
                          {ownIdx == 0 ?
                            <img className="w-full" src={configData?.IPFSTON + item?.project + '/image/' +  item?.item.name.replace(' ', '-') + '.png'} alt="" />
                          :
                          item?.item ? 
                            <img className="w-full rounded-lg" src={configData.IPFS1155 + 'image/' + item.originalTokenId + '.png'} alt={item?.id} />
                            :
                            <div className="w-full relaitve overflow-hidden">
                              <div className="absolute w-full h-full flex items-center justify-center z-2">
                                <div className="text-center">
                                  <img className="animate-spin w-8 h-8" src="/images/image_loading.png" />
                                  <div className="md:text-[20px]">{t('personalInfo.minting')}</div>
                                </div>
                              </div>
                              <img className="w-full opacity-50" src={configData?.IPFSTON + item?.project + '/image/' +  NFTData[10000].project + '-Advanced.png'} />
                            </div>
                          }
                          <div className="text-white truncate text-center">{item?.item?.name}</div>
                        </div>
                      ))}
                    </div>
                    :
                    <div className="py-16 text-center">
                      <div className="w-full">
                        <svg className="mx-auto" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="48" height="48"><path d="M855.6 427.2H168.5c-12.7 0-24.4 6.9-30.6 18L4.4 684.7C1.5 689.9 0 695.8 0 701.8v287.1c0 19.4 15.7 35.1 35.1 35.1H989c19.4 0 35.1-15.7 35.1-35.1V701.8c0-6-1.5-11.8-4.4-17.1L886.2 445.2c-6.2-11.1-17.9-18-30.6-18zM673.4 695.6c-16.5 0-30.8 11.5-34.3 27.7-12.7 58.5-64.8 102.3-127.2 102.3s-114.5-43.8-127.2-102.3c-3.5-16.1-17.8-27.7-34.3-27.7H119c-26.4 0-43.3-28-31.1-51.4l81.7-155.8c6.1-11.6 18-18.8 31.1-18.8h622.4c13 0 25 7.2 31.1 18.8l81.7 155.8c12.2 23.4-4.7 51.4-31.1 51.4H673.4zM819.9 209.5c-1-1.8-2.1-3.7-3.2-5.5-9.8-16.6-31.1-22.2-47.8-12.6L648.5 261c-17 9.8-22.7 31.6-12.6 48.4 0.9 1.4 1.7 2.9 2.5 4.4 9.5 17 31.2 22.8 48 13L807 257.3c16.7-9.7 22.4-31 12.9-47.8zM375.4 261.1L255 191.6c-16.7-9.6-38-4-47.8 12.6-1.1 1.8-2.1 3.6-3.2 5.5-9.5 16.8-3.8 38.1 12.9 47.8L337.3 327c16.9 9.7 38.6 4 48-13.1 0.8-1.5 1.7-2.9 2.5-4.4 10.2-16.8 4.5-38.6-12.4-48.4zM512 239.3h2.5c19.5 0.3 35.5-15.5 35.5-35.1v-139c0-19.3-15.6-34.9-34.8-35.1h-6.4C489.6 30.3 474 46 474 65.2v139c0 19.5 15.9 35.4 35.5 35.1h2.5z" fill="#757895"></path></svg>
                      </div>
                      {/*<div className="flex flex-wrap items-center md:space-x-6 justify-center">
                        {!userInfo?.account &&
                          <Button className="text-xl font-light text-white w-80 text-center py-3 md:py-4 mt-6" onClick={handleOpenEvmConnectModal}>
                            {t('personalInfo.bindWallet')}
                            {bindEvmAccountLoading && <div className="animate-spin w-5 h-5 border-2 border-[#8D73FF] border-t-transparent rounded-full ml-2"></div>}
                          </Button>
                        }

                        {!Boolean(userInfo?.tgAccount) &&
                          <Button className="text-xl font-light text-white w-80 text-center py-3 md:py-4 mt-6" onClick={() => handleBindTgAccount()}>
                            {t('personalInfo.bindTgAccount')}
                            {bindTgAccountLoading && <div className="animate-spin w-5 h-5 border-2 border-[#8D73FF] border-t-transparent rounded-full ml-2"></div>}
                          </Button>
                        }
                      </div>*/}
                    </div>
                    }
                    {/*Boolean(userInfo?.account) && Boolean(userInfo?.tgAccount) &&
                      <div className="text-center mt-6">
                        <Button href="/genkiMinerMint" className="text-xl font-light text-white w-60 text-center py-3 md:py-4">
                          {t('personalInfo.goToMint')}
                        </Button>
                      </div>
                    */}
                    </>
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
                <div key={index} className="flex text-[#CFC4FF] text-center text-white mt-3">
                  <div className="w-1/3">{formatDatetime(item?.createdAt)}</div>
                  <div className="w-1/3 px-2">{(item?.type?.indexOf('mint') >= 0 || (item?.type?.indexOf('buy') >= 0) ? <span className='text-[#F6465D]'>-{item?.amount}</span> : <span className='text-[#2EBD85]'>+{item?.amount}</span>)}</div>
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
          <div className="flex justify-center py-3">
            <div className="flex bg-[#201E2A] rounded-[10px] p-2 justify-center space-x-3">
              <button className={"w-20 text-[16px] text-white py-1 rounded-[10px] " + (historyTabIdx == 0 ? 'bg-[#FEBD32]' : 'hover:bg-[#FEBD32]')} onClick={() => setHistoryTabIdx(0)}>{t('personalInfo.inGame')}</button>
              <button className={"w-20 text-[16px] text-white py-1 rounded-[10px] " + (historyTabIdx == 1 ? 'bg-[#FEBD32] ' : 'hover:bg-[#FEBD32]')} onClick={() => setHistoryTabIdx(1)}>OP-BNB</button>
            </div>
          </div>
          <div className="max-h-[400px] min-h-[300px] overflow-y-auto text-[18px]">
            <div className="p-6">
              <div className="flex border-b border-[#8A84A3] text-[#8A84A3] text-center">
                <div className="w-1/5">{t('personalInfo.date')}</div>
                <div className="flex-1">{t('personalInfo.mint')}</div>
                {historyTabIdx == 0 && <div className="w-1/6">{t('personalInfo.cost')}</div>}
                <div className="w-1/6">{t('personalInfo.status')}</div>
                {historyTabIdx == 1 && <div className="w-1/6">{t('personalInfo.hash')}</div>}
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
                <div key={index} className="flex text-[#CFC4FF] text-center text-white mt-3 items-center text-[12px] md:text-[16px]">
                  <div className="w-1/5">{formatDatetime(item?.createdAt)}</div>
                  <div className="flex-1">
                    {historyTabIdx == 0 ?
                      <div>{item?.item?.name} <span className='text-[#2EBD85] ml-2'>x1</span></div>
                    :
                      item?.items?.map((item:any, index:number) => (
                        <div key={index} className="">{item?.item?.name} <span className='text-[#2EBD85] ml-2'>x{item?.amount}</span></div>
                      ))
                    }
                  </div>
                  {historyTabIdx == 0 && <div className="w-1/6 text-[#F6465D]">-{item?.item?.kscore}</div>}
                  <div className="w-1/6">
                    <span className="text-[#2EBD85]">{t('personalInfo.success')}</span>
                  </div>
                  {historyTabIdx == 1 && <div className="w-1/6">{configData && item?.txHash && <a className="text-[#757895] underline text-[12px] md:text-[16px]" href={configData?.OPBNBSCAN + item?.txHash} target="_blank">{t('personalInfo.viewHash')}</a>}</div>}
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
      <Modal
        isOpen={showNFTDetailModal}
        onRequestClose={() => setShowNFTDetailModal(false)}
        shouldCloseOnOverlayClick={true}
        className="w-9/10! lg:w-[400px]!"
      >
        <div className="w-full p-6 bg-black rounded-lg">
          <div className="relative text-white">
            <button className="absolute top-1/2 right-0 -translate-y-1/2 cursor-pointer hover:opacity-80" onClick={() => setShowNFTDetailModal(false)}>
              <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="22" height="22"><path d="M431.559111 512L149.959111 230.4a56.888889 56.888889 0 0 1 80.440889-80.440889L512 431.559111l281.6-281.6a56.888889 56.888889 0 0 1 80.440889 80.440889L592.440889 512l281.6 281.6a56.888889 56.888889 0 1 1-80.440889 80.440889L512 592.440889 230.4 874.040889a56.888889 56.888889 0 1 1-80.440889-80.440889L431.559111 512z" fill="#ffffff"></path></svg>
            </button>
          </div>
          {curNFTItem != null && (
            <div className="mt-6">
              <div className="text-white text-[20px]">{curNFTItem?.name}</div>
              <div className="text-[#FEBD32] mt-6">Lv. {curNFTItem?.level}</div>
              <div className="text-[#CFC4FF] mt-3">{t('personalInfo.game')}: {curNFTItem?.project}</div>
              <div className="text-[#2EBD85] mt-3"><span>{t('nft.airdropBonusLevel')}: {curNFTItem?.level}</span></div>
              <div className="text-[#8A84A3] mt-3">{curNFTItem?.desc}</div>
            </div>
          )}
        </div>
      </Modal>
      <BlindboxRulesModal ref={blindboxRulesRef} />
    </main>
  ); 
}