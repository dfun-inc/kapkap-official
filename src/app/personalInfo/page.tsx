"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import Button from "@/components/ui/Button";
import { useErrCode } from "@/datas/errCode";
import { bindEvmAccount, bindTgAccount, bindTonAccount, getKScore, getKScoreHistory, getUserInfo } from "@/services/apis/user";
import { formatNumberWithCommas } from "@/utils/number";
import { getEvmMint721History, getTonMint721History, getNFTData } from "@/services/apis/nft";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { readContract, signMessage, switchChain } from "@wagmi/core";
import {tgtChain, config as wagmiConfig} from "@/config/wagmi";
import NFT721ABI from "@/config/abis/NFT721.json";
import { getChainConfig } from "@/services/apis/config";
import Modal from 'react-modal';
import { formatDatetime } from "@/utils/time";
import { toast } from "react-toastify";
// import { tonConnectUI } from "@/config/ton";
import { toUserFriendlyAddress, useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';

export default function personalInfo() {
  const t = useTranslations();
  const { configData, userInfo, handleSetUserInfo, triggerModalOpen } = useAppContext();
  const [addr, setAddr] = useState<string>('');
  const [kscore, setKscore] = useState<number>(0);
  const [kscoreLoading, setKscoreLoading] = useState<boolean>(true);

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

  const [tonConnectUI] = useTonConnectUI();
  const userFriendlyAddress = useTonAddress();
  const firstTonForce = useRef(true);

  const [curNFTItem, setCurNFTItem] = useState<any>(null);
  const [showNFTDetailModal, setShowNFTDetailModal] = useState<boolean>(false);

  const [ownIdx, setOwnIdx] = useState(0);

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

  const handleBindTon = async() => {
    try {
      if(userFriendlyAddress) {
        await tonConnectUI.disconnect();
      }

      // Step 2️⃣ 调用连接钱包
      await tonConnectUI.openModal();

      // Step 3️⃣ 监听 wallet 变化
      const unsubscribe = tonConnectUI.onStatusChange(async (wallet) => {
        if (wallet && wallet.account) {
          // ✅ 获取钱包地址
          const address = wallet.account.address;
          const friendlyAddr = toUserFriendlyAddress(address);
          console.log(friendlyAddr)

          setBindTonAccountLoading(true);
          await bindTonAccount(friendlyAddr)
          .then(res => {
            const data = res?.data;
            if(data.status == 10000) {
              toast.success(t('personalInfo.bindTonWalletSuccess'));
              handleGetUserInfo();
            }
            else {
              errCodeHandler(data.status)
            }
          })
          setBindTonAccountLoading(false);


          // Step 4️⃣ 调用你的绑定接口
          // await bindAddressToServer(address);

          // 解绑监听（避免多次触发）
          unsubscribe();
        } else {
          console.log("钱包未连接");
        }
      });

    } catch (err) {
      console.error("绑定过程中出错:", err);
    }
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
    localStorage.removeItem('wagmi.wallet');
    localStorage.removeItem('wagmi.connected')
    localStorage.removeItem('wagmi.store')
    localStorage.removeItem('wagmi.metaMask')
    sessionStorage.clear()
    await disconnect();
  }

  const handleGetBscNFTList = async() => {
    setNFTListLoading(true);

    let _addr:any = '';
    Object.entries(NFTData).find(([key, value]:any) => {
      if(value?.type == '721' && value?.nftContract) {
        _addr = value?.nftContract;
      }
    })

    let tokenIds:number[] = [];
    await readContract(wagmiConfig, {
      address: _addr,
      abi: NFT721ABI,
      functionName: 'walletOfOwner',
      args: [userInfo?.account],
    })
    .then((res:any) => {
      console.log(res)
      res.forEach((item:any) => {
        tokenIds.push(Number(item));
      })
    })

    let tempArr: any[] = [];
    console.log(tokenIds)
    if(tokenIds.length) {
      await getEvmMint721History()
      .then(res => {
        const data = res?.data;
        if(data.status == 10000) {
          tokenIds.map((token) => {
            data?.data.forEach((item:any) => {
              if(token == item.tokenId && item.state >= 2) {
                let tempItem:any = {originalTokenId: token, project: NFTData[item.project].project};
                Object.entries(NFTData[item.project]['ids']).find(([key, value]:any) => {
                  if(key == item?.resId) {
                    tempItem = {id:key, ...value}
                  }
                });
                tempArr.push({originalTokenId: token, project: NFTData[item.project].project, item: tempItem})
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
    try {
      const res = await fetch(
        'https://tonapi.io/v2/accounts/' + userInfo.tonWallet + '/nfts?collection=' + NFTData[10000].tonNftContract
      );
      const data = await res.json();
      console.log("NFT 数据：", data);

      // 过滤并提取需要的信息
      const nftList = data.nft_items?.map((item:any) => ({
        address: item.address,
        name: item.metadata?.name,
        image: normalizeIpfsUrl(item.metadata?.image),
      })) || [];

      console.log(nftList)
      // setNfts(nftList);
    } catch (err) {
      console.error("获取 NFT 失败:", err);
    } finally {
      // setLoading(false);
    }
  }

  // 处理 IPFS 链接
  const normalizeIpfsUrl = (url:string) => {
    if (!url) return "";
    if (url.startsWith("ipfs://")) {
      return url.replace("ipfs://", "https://ipfs.io/ipfs/");
    }
    return url;
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

  const handleGetMintHistory = async (tab: number) => {
    setMintHistoryLoading(true);

    try {
      const res = tab ? await getEvmMint721History() : await getTonMint721History();

      if(res) {
        const data = res?.data;
        if(data.status == 10000) {
          let temp:any[] = [];
          data?.data.forEach((item:any) => {
            Object.entries(NFTData[item.project]['ids']).find(([key, value]:any) => {
              if(key == item.resId) {
                temp.push({...item, item: value});
              }
            });
          })
          console.log(temp)
          setMintHistory(temp);
        }
        else {
          errCodeHandler(data.status)
        }
      }
    }
    catch{}
    setMintHistoryLoading(false);
  }

  const handleShowNFTDetailModal = (id:any) => {
    setCurNFTItem(null);
    Object.entries(NFTData).find(([key, value]:any) => {
      Object.entries(value?.ids)?.map(([key2, value2]:any) => {
        if(key2 == id) {
          setCurNFTItem({id: key2, project: value.project, ...value2});
        }
      })
    });
    setShowNFTDetailModal(true);
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
    if(userInfo?.account && userInfo?.tonWallet &&  userInfo?.tgAccount && NFTData) {
      if(ownIdx) {
        handleGetBscNFTList();
      }
      else {
        handleGetTonNFTList();
      }
    }
  }, [userInfo, NFTData, ownIdx])

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
    if(userFriendlyAddress && firstTonForce.current) {
      tonConnectUI.disconnect();
      firstTonForce.current = false;
    }

  }, [userFriendlyAddress])

  useEffect(() => {
    handleGetNFTData();
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
                  <div className="flex flex-wrap w-full md:w-2/3 md:border-r md:border-[#241E33] px-6 md:px-12 2xl:px-20 py-3 justify-between">
                    <div className="w-full md:w-auto">
                      <div className="text-[#8D73FF] text-[18px]">{t('personalInfo.yourTgAccount')}</div>
                      <div className="mt-2 leading-none">
                      {userInfo ? 
                        <>
                        {userInfo?.tgAccount ? 
                          <div className="text-[#FEBD32] text-[24px]">{userInfo?.tgAccount}</div>
                        :
                          bindTgAccountLoading ?
                            <div className="animate-spin w-7 h-7 border-2 border-[#8D73FF] border-t-transparent rounded-full"></div>
                          :
                          <button className="text-[#757895] flex items-end border-b border-b-transparent hover:border-b-[#757895]" onClick={() => handleBindTgAccount()}>
                            <div className="text-[24px]">{t('personalInfo.none')}</div>
                            <div className="text-[18px] ml-1 pb-1">({t('personalInfo.bindTgAccount')})&gt;</div>
                          </button>
                        }
                        </>
                        :
                        <div className="animate-pulse w-40 h-[30px] bg-gray-500 rounded-lg"></div>
                      }
                      </div>
                    </div>
                    <div className="w-full md:w-auto mt-12 md:mt-0">
                      <div className="text-[#8D73FF] text-[18px] pl-10">{t('personalInfo.yourWallet')}</div>
                      <div className="mt-2 leading-none flex items-center space-x-3">
                        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path d="M0 512a512 512 0 1 0 1024 0A512 512 0 0 0 0 512z" fill="#F3BA2F" p-id="5546"></path><path d="M379.448889 432.924444L512 300.202667l132.721778 132.664889 77.141333-77.141334L512 145.863111 302.250667 355.783111l77.141333 77.141333m-208.839111 54.499556L247.694222 410.168889l77.198222 77.198222-77.198222 77.141333-77.141333-77.141333z m208.839111 54.442667L512 674.474667l132.721778-132.721778 77.198222 77.141333L512 828.814222 302.250667 618.951111l-0.113778-0.113778 77.255111-77.084444m319.715556-54.385778l77.198222-77.198222 77.141333 77.198222-77.141333 77.141333-77.198222-77.141333z" fill="#FFFFFF" p-id="5547"></path><path d="M590.279111 487.310222L512 409.031111 454.144 466.887111l-6.656 6.656-13.710222 13.710222-0.113778 0.113778 0.113778 0.113778L512 565.703111l78.279111-78.279111 0.056889-0.056889-0.056889-0.056889" fill="#FFFFFF"></path></svg>
                        {userInfo ? 
                          <>
                          {userInfo?.account ? 
                            <div className="text-[#FEBD32] text-[24px]">
                              {userInfo?.account?.length > 4 ? userInfo?.account?.substring(0, 4) + '...' + userInfo?.account?.substring(userInfo?.account?.length - 4, userInfo?.account?.length) : userInfo?.account}
                            </div>
                          :
                          bindEvmAccountLoading ?
                            <div className="animate-spin w-7 h-7 border-2 border-[#8D73FF] border-t-transparent rounded-full"></div>
                          :
                            <button className="text-[#757895] flex items-end border-b border-b-transparent hover:border-b-[#757895]" onClick={handleOpenEvmConnectModal}>
                              <div className="text-[24px]">{t('personalInfo.none')}</div>
                              <div className="text-[18px] ml-1 pb-1">({t('personalInfo.bindWallet')})&gt;</div>
                            </button>
                          }
                          </>
                          :
                          <div className="animate-pulse w-40 h-[30px] bg-gray-500 rounded-lg"></div>
                        }
                      </div>
                    </div>

                    <div className="w-full md:w-auto mt-12 md:mt-0">
                      <div className="text-[#8D73FF] text-[18px] pl-10">{t('personalInfo.yourTonWallet')}</div>
                      <div className="mt-2 leading-none flex items-center space-x-3">
                        <svg width="28" height="28" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z" fill="#0098EA"/>
                          <path d="M37.5603 15.6277H18.4386C14.9228 15.6277 12.6944 19.4202 14.4632 22.4861L26.2644 42.9409C27.0345 44.2765 28.9644 44.2765 29.7345 42.9409L41.5381 22.4861C43.3045 19.4251 41.0761 15.6277 37.5627 15.6277H37.5603ZM26.2548 36.8068L23.6847 31.8327L17.4833 20.7414C17.0742 20.0315 17.5795 19.1218 18.4362 19.1218H26.2524V36.8092L26.2548 36.8068ZM38.5108 20.739L32.3118 31.8351L29.7417 36.8068V19.1194H37.5579C38.4146 19.1194 38.9199 20.0291 38.5108 20.739Z" fill="white"/>
                        </svg>
                        {userInfo ? 
                          <>
                          {userInfo?.tonWallet ? 
                            <div className="text-[#FEBD32] text-[24px]">
                              {userInfo?.tonWallet?.length > 4 ? userInfo?.tonWallet?.substring(0, 4) + '...' + userInfo?.tonWallet?.substring(userInfo?.tonWallet?.length - 4, userInfo?.tonWallet?.length) : userInfo?.tonWallet}
                            </div>
                          :
                          bindTonAccountLoading ?
                            <div className="animate-spin w-7 h-7 border-2 border-[#8D73FF] border-t-transparent rounded-full"></div>
                          :
                            <button className="text-[#757895] flex items-end border-b border-b-transparent hover:border-b-[#757895]" onClick={handleBindTon}>
                              <div className="text-[24px]">{t('personalInfo.none')}</div>
                              <div className="text-[18px] ml-1 pb-1">({t('personalInfo.bindTonWallet')})&gt;</div>
                            </button>
                          }
                          </>
                          :
                          <div className="animate-pulse w-40 h-[30px] bg-gray-500 rounded-lg"></div>
                        }
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/3 px-6 md:px-12 2xl:px-20 py-3 mt-12 md:mt-0">
                    <div className="flex items-center space-x-8">
                      <img className="w-12 md:w-18" src="/images/kscore.png" alt="kscore" />
                      <div>
                        <div className="text-[#8D73FF] text-[18px]">{t('personalInfo.yourKScore')}</div>
                        <div className="mt-2 leading-none">
                          {kscoreLoading ? 
                            <div className="animate-pulse w-40 h-[30px] bg-gray-500 rounded-lg"></div>
                          :
                            <div className="text-[#FEBD32] text-[24px]">{formatNumberWithCommas(kscore)}</div>
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
                <div className="flex justify-center py-3 mt-3">
                  <div className="flex bg-[#201E2A] rounded-[10px] p-2 justify-center space-x-3">
                    <button className={"w-30 text-[20px] text-white py-2 rounded-[10px] " + (ownIdx == 0 ? 'bg-[#FEBD32]' : 'hover:bg-[#FEBD32]')} onClick={() => setOwnIdx(0)}>TON</button>
                    <button className={"w-30 text-[20px] text-white py-2 rounded-[10px] " + (ownIdx == 1 ? 'bg-[#FEBD32] ' : 'hover:bg-[#FEBD32]')} onClick={() => setOwnIdx(1)}>BSC</button>
                  </div>
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
                      {configData != null && NFTlist.map((item, index) => (
                        <div key={index} className="w-full relative hover:scale-105 transition-transform duration-300" onClick={item.item ? () => handleShowNFTDetailModal(item?.item?.id) : () => {}}>
                          {ownIdx == 0 ?
                          <></>
                          :
                          item?.item ? 
                            <img className="w-full rounded-lg" src={configData.IPFS721 + item?.project + '/image/' + item.originalTokenId + '.png'} alt={item?.id} />
                            :
                            <div className="w-full relaitve overflow-hidden">
                              <div className="absolute w-full h-full flex items-center justify-center z-2">
                                <div className="text-center">
                                  <img className="animate-spin w-8 h-8" src="/images/image_loading.png" />
                                  <div className="md:text-[20px]">{(t('personalInfo.minting'))}</div>
                                </div>
                              </div>
                              <img className="w-full opacity-50" src={configData?.IPFSTON + item?.project + '/image/' +  NFTData[10000].project + '-Advanced.png'} />
                            </div>
                          }
                        </div>
                      ))}
                    </div>
                  :
                    <div className="py-16 text-center">
                      <div className="w-full">
                        <svg className="mx-auto" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="48" height="48"><path d="M855.6 427.2H168.5c-12.7 0-24.4 6.9-30.6 18L4.4 684.7C1.5 689.9 0 695.8 0 701.8v287.1c0 19.4 15.7 35.1 35.1 35.1H989c19.4 0 35.1-15.7 35.1-35.1V701.8c0-6-1.5-11.8-4.4-17.1L886.2 445.2c-6.2-11.1-17.9-18-30.6-18zM673.4 695.6c-16.5 0-30.8 11.5-34.3 27.7-12.7 58.5-64.8 102.3-127.2 102.3s-114.5-43.8-127.2-102.3c-3.5-16.1-17.8-27.7-34.3-27.7H119c-26.4 0-43.3-28-31.1-51.4l81.7-155.8c6.1-11.6 18-18.8 31.1-18.8h622.4c13 0 25 7.2 31.1 18.8l81.7 155.8c12.2 23.4-4.7 51.4-31.1 51.4H673.4zM819.9 209.5c-1-1.8-2.1-3.7-3.2-5.5-9.8-16.6-31.1-22.2-47.8-12.6L648.5 261c-17 9.8-22.7 31.6-12.6 48.4 0.9 1.4 1.7 2.9 2.5 4.4 9.5 17 31.2 22.8 48 13L807 257.3c16.7-9.7 22.4-31 12.9-47.8zM375.4 261.1L255 191.6c-16.7-9.6-38-4-47.8 12.6-1.1 1.8-2.1 3.6-3.2 5.5-9.5 16.8-3.8 38.1 12.9 47.8L337.3 327c16.9 9.7 38.6 4 48-13.1 0.8-1.5 1.7-2.9 2.5-4.4 10.2-16.8 4.5-38.6-12.4-48.4zM512 239.3h2.5c19.5 0.3 35.5-15.5 35.5-35.1v-139c0-19.3-15.6-34.9-34.8-35.1h-6.4C489.6 30.3 474 46 474 65.2v139c0 19.5 15.9 35.4 35.5 35.1h2.5z" fill="#757895"></path></svg>
                      </div>
                      <div className="flex flex-wrap items-center space-x-6 justify-center">
                        {!userInfo?.account &&
                          <Button className="text-xl font-light text-white w-80 text-center py-3 md:py-4 mt-6" onClick={handleOpenEvmConnectModal}>
                            {t('personalInfo.bindWallet')}
                            {bindEvmAccountLoading && <div className="animate-spin w-5 h-5 border-2 border-[#8D73FF] border-t-transparent rounded-full ml-2"></div>}
                          </Button>
                        }

                        {!userInfo?.tgAccount &&
                          <Button className="text-xl font-light text-white w-80 text-center py-3 md:py-4 mt-6" onClick={() => handleBindTgAccount()}>
                            {t('personalInfo.bindTgAccount')}
                            {bindTgAccountLoading && <div className="animate-spin w-5 h-5 border-2 border-[#8D73FF] border-t-transparent rounded-full ml-2"></div>}
                          </Button>
                        }

                        {!userInfo?.tonWallet &&
                          <Button className="text-xl font-light text-white w-80 text-center py-3 md:py-4 mt-6" onClick={() => handleBindTon()}>
                            {t('personalInfo.bindTonWallet')}
                            {bindTonAccountLoading && <div className="animate-spin w-5 h-5 border-2 border-[#8D73FF] border-t-transparent rounded-full ml-2"></div>}
                          </Button>
                        }

                        {userInfo?.account && userInfo?.tgAccount && userInfo?.tonWallet &&
                          <Button href="/genkiMinerMint" className="text-xl font-light text-white w-60 text-center py-3 md:py-4 mt-6">
                            {t('personalInfo.goToMint')}
                          </Button>
                        }
                      </div>
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
                <div key={index} className="flex text-[#CFC4FF] text-center text-white mt-3">
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
          <div className="flex justify-center py-3">
            <div className="flex bg-[#201E2A] rounded-[10px] p-2 justify-center space-x-3">
              <button className={"w-20 text-[16px] text-white py-1 rounded-[10px] " + (historyTabIdx == 0 ? 'bg-[#FEBD32]' : 'hover:bg-[#FEBD32]')} onClick={() => setHistoryTabIdx(0)}>TON</button>
              <button className={"w-20 text-[16px] text-white py-1 rounded-[10px] " + (historyTabIdx == 1 ? 'bg-[#FEBD32] ' : 'hover:bg-[#FEBD32]')} onClick={() => setHistoryTabIdx(1)}>BSC</button>
            </div>
          </div>
          <div className="max-h-[400px] min-h-[300px] overflow-y-auto text-[18px]">
            <div className="p-6">
              <div className="flex border-b border-[#8A84A3] text-[#8A84A3] text-center">
                <div className="w-1/5">{t('personalInfo.date')}</div>
                <div className="flex-1">{t('personalInfo.mint')}</div>
                <div className="w-1/6">{t('personalInfo.cost')}</div>
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
                    <div>{item?.item.name} <span className='text-[#2EBD85] ml-2'>x1</span></div>
                  </div>
                  <div className="w-1/6 text-[#F6465D]">-{item?.item.kscore}</div>
                  <div className="w-1/6">
                    {item?.state == 3 ? 
                      <span className="text-[#2EBD85]">{t('personalInfo.success')}</span>
                      :
                      <span className="text-white/80">{t('personalInfo.pending')}</span>
                    }
                  </div>
                  {historyTabIdx == 1 && <div className="w-1/6">{configData && <a className="text-[#757895] underline text-[12px] md:text-[16px]" href={configData?.SCAN + item?.txHash} target="_blank">{t('personalInfo.viewHash')}</a>}</div>}
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
            <div className="text-white text-center text-[20px]">{t('menu.tgLogin')}</div>
            <button id="open-tg-link" className="open-tg-link w-60 text-white md:text-[20px] px-6 py-2 md:px-12 md:py-3 bg-[#6E4DFF] mt-6 rounded-lg"
            onClick={() => {
              window.open(tgLink, '_blank');
              setShowToTgModal(false);
              reBindTimeout.current = setTimeout(() => {
                handleBindTgAccount(tgWebLoginToken, 1);
              }, 5000);
            }}>
              <span className="text-sm md:text-base font-medium ml-2">{t('menu.openTgToLogin')}</span>
            </button>
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
              <div className="text-[#2EBD85] mt-3">{curNFTItem?.airdropBoost && <span>{t('nft.airdrop')}: +{curNFTItem?.airdropBoost}%</span>}</div>
              <div className="text-[#8A84A3] mt-3">{curNFTItem?.desc}</div>
            </div>
          )}
        </div>
      </Modal>
    </main>
  ); 
}