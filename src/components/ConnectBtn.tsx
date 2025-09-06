'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from "react";
import { useConnectModal } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi';
import { walletConnect } from 'wagmi/connectors'
import { signMessage } from '@wagmi/core'
import { config, projectId } from "@/config/wagmi"
import { useAppContext } from '@/context/AppContext';
import { evmLogin, getUserInfo, tgLogin } from '@/services/apis/user';
import { useErrCode } from '@/datas/errCode';

export default function ConnectBtn() {
  const t = useTranslations();
  const [walletDropdown, setWalletDropdown] = useState(false);
  const { errCodeHandler } = useErrCode();

  const { address, isConnected, connector, isDisconnected } = useAccount();
  const { connectors: installedConnectors } = useConnect();
  const { disconnect } = useDisconnect()
  const [connectors, setConnecotrs] = useState<any[]>([])
  const [walletAddr, setWalletAddr] = useState<any>(null);
  const [connecting, setConnecting] = useState(false);
  const chainId = useChainId();
  const { openConnectModal } = useConnectModal();

  const { userInfo, handleSetUserInfo, modalTrigger, handleSetUserInfoLoading } = useAppContext();  
  const reLoginTimeout = useRef<any>(null);

  const handleConnectWallet = async() => {
    setWalletAddr(null)
    let isConnect = false;
    setConnecting(true);
    
    try {
      const signMsgStr = 'address=' + address + ',chain_id=' + chainId;
      const refCode = localStorage.getItem('kkRefCode') ? localStorage.getItem('kkRefCode') : '';
      const signedMessage = await signMessage(config, {message: signMsgStr});

      await evmLogin({
        address: address,
        sign: signedMessage.replace(/['"]+/g, ''),
        chain_id: chainId,
        chain: 'evm',
        refCode: refCode,
      })
      .then(async(res) => {
        const data = res?.data;
        if(data.status == 10000) {
          await localStorage.setItem('kkAuthToken', data?.data.token);
          await localStorage.setItem('kkAddress', address as any);
          await localStorage.setItem('kkLoginType', 'bsc');
          await localStorage.setItem('kkGuid', data?.data.guid);
          setWalletAddr((_a: any) => address)
          // handleGetUserInfo();
          isConnect = true;
        }
        else {
          errCodeHandler(data.status);
        }
      })
    }
    catch {
      setConnecting(false);
      handleDisconnect();
    }

    if(!isConnect) {
      setConnecting(false);
      handleDisconnect();
    }
    setConnecting(false);
  }

  const handleDisconnect = async() => {
    setWalletDropdown(false);
    setWalletAddr(null);
    localStorage.removeItem('kkAuthToken');
    localStorage.removeItem('kkAddress');
    localStorage.removeItem('kkLoginType');
    handleSetUserInfo(null);
    localStorage.removeItem('wagmi.wallet');
    await disconnect();
  }

  const handleShowBscModal = async() => {
    openConnectModal?.();
  }

  const handleBindTg = async(tempToken = '', reqCount = 0) => {
    // tonConnectUI?.connectWallet();
    setConnecting(true);
    let reConnect = false;

    await tgLogin({
      webLoginToken: tempToken,
      refCode: '',
    })
    .then(async(res) => {
      const data = res?.data;
      if(data.code == '200' && data?.data.botUrl) {
        window.open(data?.data.botUrl, '_blank');
        reConnect = true;
        reLoginTimeout.current = setTimeout(() => {
          handleBindTg(data?.data.webLoginToken, reqCount + 1);
        }, 5000);
      }
      else if(data?.data?.account) {
        clearTimeout(reLoginTimeout.current);
        reLoginTimeout.current = null;
        await localStorage.setItem('kkAuthToken', data?.data.token);
        await localStorage.setItem('kkAddress', data?.data.account);
        await localStorage.setItem('kkGuid', data?.data.guid);
        setWalletAddr(data?.data.account);
        // handleGetUserInfo();
      }
      else if(reqCount < 10) {
        reConnect = true;
        
        reLoginTimeout.current = setTimeout(() => {
          handleBindTg(tempToken, reqCount + 1);
        }, 5000);
      }
      else {
        clearTimeout(reLoginTimeout.current);
        reLoginTimeout.current = null;
      }
    })
    if(!reConnect) {
      setConnecting(false);
    }
  }

  /*
  const handleGetUserInfo = async() => {
    handleSetUserInfoLoading(true);
    await getUserInfo().then((res) => {
      const data = res?.data;
      if(data.code == '200') {
        handleSetUserInfo(data?.data);
        setWalletAddr(data?.data.account);
      }
      else {
        errCodeHandler(data.code)
      }
    })
    handleSetUserInfoLoading(false);
  }
  */

  useEffect(() => {
    if (isConnected && address) {
      if(!localStorage.getItem('kkAddress') || localStorage.getItem('kkAddress') != address)  {
        handleConnectWallet();
      }
    }
  }, [isConnected, address]);

  useEffect(() => {
    if (modalTrigger) {
      handleShowBscModal();
    }
  }, [modalTrigger]);

  useEffect(() => {
    if (isDisconnected && address) {
      handleDisconnect();
    }
  }, [isDisconnected, address]);
  
  useEffect(() => {
    const addr = localStorage.getItem('kkAddress');
    console.log(addr)
    if(addr) {
      setWalletAddr(addr);
      // handleGetUserInfo();
    }
    else {
      handleDisconnect();
    }
    
    let temp:any[] = [...installedConnectors, walletConnect({ projectId, showQrModal: true })];
    setConnecotrs(temp);

    return () => {
      clearTimeout(reLoginTimeout.current);
      reLoginTimeout.current = null;
    }
  }, [])

  return (
    <>
    {walletAddr ? (
    <div className="group w-full md:w-auto relative md:ml-6" onMouseOver={() => setWalletDropdown(true)} onMouseOut={() => setWalletDropdown(false)}>
      <div className="bg-black relative rounded-full w-46 px-1 py-[6px] cursor-pointer" onClick={() => handleShowBscModal()}>
        <div className="w-31 flex items-center justify-center md:text-lg">
          {walletAddr.length > 4 ? walletAddr?.substring(0, 4) + '...' + walletAddr?.substring(walletAddr?.length - 4, walletAddr?.length) : walletAddr}
        </div>
        <div className="bg-black absolute -top-2 -right-3 p-2 rounded-full">
          <img className="group-hover:w-10 w-16 rounded-full transition-all duration-300" src="/images/logo_big.png" /> 
        </div>
      </div>
      <div className={"absolute left-0 top-8 w-full pt-3 block " + (walletDropdown ? '' : "md:hidden")}>
        <div className="w-full py-1 shadow-lg md:bg-white/10 rounded-[10px]">
          <div className="w-full mt-6 md:mt-0">
            <div className="text-white/60 md:hidden mb-6">{t('menu.myAccount')}</div>
            {walletAddr && (
              <>
                <Link href="/profile" className="bg-white/10 md:bg-transparent rounded-lg md:rounded-none w-full px-4 py-2 text-center hover:bg-white/10 flex items-center md:text-white">
                  <div className="w-full flex items-center justify-center">{t('menu.yourKapILE')}</div>
                </Link>
                
                <button className="bg-white/10 md:bg-transparent rounded-lg md:rounded-none w-full px-4 py-2 text-center hover:bg-white/10 flex items-center md:text-white mt-6 md:mt-0" onClick={() => handleDisconnect()}>
                  <div className="w-full flex items-center justify-center">{t('menu.disconnect')}</div>
                </button>
              </>
            )} 
          </div>
        </div>
      </div>
    </div>
    ) : (
    <div className="w-full md:w-auto relative md:ml-6 mr-2" >
      <button className="bg-black relative rounded-full w-46 px-1 py-[6px] cursor-pointer" onClick={() => handleShowBscModal()}>
        <div className="w-31 flex items-center justify-center md:text-lg">
          {t('menu.login')} <>{connecting && <span className="ml-2 animate-spin w-4 h-4 border-[3px] border-gray-400 rounded-full relative z-1"></span>}</>
        </div>
        <div className="bg-black absolute -top-2 -right-3 p-2 rounded-full">
          <div className="bg-[#5e5e5e] p-2 rounded-full">
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5357" width="48" height="48"><path d="M621.714286 490.057143C694.857143 446.171429 738.742857 373.028571 738.742857 292.571429c0-124.342857-102.4-219.428571-226.742857-219.428572-124.342857 0-226.742857 102.4-226.742857 219.428572 0 80.457143 36.571429 153.6 109.714286 190.171428C234.057143 533.942857 109.714286 694.857143 109.714286 870.4c0 36.571429 0 80.457143 80.457143 80.457143h636.342857c65.828571 0 80.457143-36.571429 80.457143-80.457143 7.314286-175.542857-117.028571-336.457143-285.257143-380.342857z" fill="#8f8f8f" p-id="5358"></path></svg>
          </div>
        </div>
      </button>
    </div>
    )}
    </>
  );
}
