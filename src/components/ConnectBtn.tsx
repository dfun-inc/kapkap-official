'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from "react";
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi';
import Modal from 'react-modal';
import { walletConnect } from 'wagmi/connectors'
import { useTonConnectUI } from '@tonconnect/ui-react';
import { signMessage, switchChain } from '@wagmi/core'
import { config, projectId, tgtChain } from "@/config/wagmi"
import { useAppContext } from '@/context/AppContext';
import { evmLogin, getUserInfo, tgLogin } from '@/services/apis/user';
import { getUrlParamsByName } from '@/utils/url';
import Button from '@/components/ui/Button';
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
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { userInfo, handleSetUserInfo, modalTrigger, handleSetUserInfoLoading, triggerSetLogout, logoutTrigger } = useAppContext();  
  const reLoginTimeout = useRef<any>(null);
  const loginForceRef = useRef<any>(false);

  const [showToTgModal, setShowToTgModal] = useState(false);
  const [tgLink, setTgLink] = useState<string>('');
  const [tgWebLoginToken, setTgWebLoginToken] = useState<string>('');
  
  const connectForceRef = useRef(false);

  const handleConnectBsc = async() => {
    if(userInfo) {
      return;
    }
    setWalletAddr(null)
    let isConnect = false;
    setConnecting(true);
    
    try {
      const signMsgStr = 'address=' + address + ',chain_id=' + chainId;
      const refCode = localStorage.getItem('kkRefCode') ? localStorage.getItem('kkRefCode') : '';
      await switchChain(config, { chainId: tgtChain?.id });
      await new Promise(resolve => setTimeout(resolve, 1500));
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
          await localStorage.setItem('kkAddress', data?.data.account);
          await localStorage.setItem('kkLoginType', 'bsc');
          await localStorage.setItem('kkGuid', data?.data.guid);
          await new Promise(resolve => setTimeout(resolve, 500));
          setWalletAddr((_a: any) => data?.data.account)
          handleGetUserInfo();
          isConnect = true;
        }
        else {
          errCodeHandler(data.status, data.msg);
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

    // test 
    localStorage.removeItem('wagmi.wallet');
    localStorage.removeItem('wagmi.connected')
    localStorage.removeItem('wagmi.store')
    localStorage.removeItem('wagmi.metaMask')
    localStorage.removeItem('walletconnect')
    localStorage.removeItem('wc@2:client:0.3') // 旧版 WalletConnect v2
    disconnect();

    setShowLoginModal(false)
    setConnecting(false);
  }

  const handleDisconnect = async() => {
    await disconnect();
    setWalletDropdown(false);
    setWalletAddr(null);
    localStorage.removeItem('kkAuthToken');
    localStorage.removeItem('kkAddress');
    localStorage.removeItem('kkLoginType');
    handleSetUserInfo(null);
    
    localStorage.removeItem('wagmi.wallet');
    localStorage.removeItem('wagmi.connected')
    localStorage.removeItem('wagmi.store')
    localStorage.removeItem('wagmi.metaMask')
    localStorage.removeItem('walletconnect')
    localStorage.removeItem('wc@2:client:0.3') // 旧版 WalletConnect v2

    Object.keys(localStorage).forEach(k => {
      if (k.includes('wagmi') || k.includes('walletconnect') || k.includes('wc@2')) {
        localStorage.removeItem(k);
      }
    });
    sessionStorage.clear()
    localStorage.clear()
    await new Promise(r => setTimeout(r, 300));
  }

  const handleShowBscModal = async() => {
    console.log('handleConnectBsc');
    connectForceRef.current = true;
    if(isConnected) {
      await handleDisconnect();
      setTimeout(() => {
        openConnectModal?.();
      }, 500);
    }
    else {
      await handleDisconnect();
      openConnectModal?.();
    }
  }

  const handleTgLogin = async(tempToken = '', reqCount = 0) => {
    // tonConnectUI?.connectWallet();
    setConnecting(true);
    let reConnect = false;

    const refCode = localStorage.getItem('kkRefCode') ? localStorage.getItem('kkRefCode') : '';
    await tgLogin({
      webLoginToken: tempToken,
      refCode: refCode,
    })
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
          reLoginTimeout.current = setTimeout(() => {
            handleTgLogin(data?.data.webLoginToken, reqCount + 1);
          }, 5000);
        }
      }
      else if(data?.data?.tgAccount) {
        clearTimeout(reLoginTimeout.current);
        reLoginTimeout.current = null;
        await localStorage.setItem('kkAuthToken', data?.data.token);
        await localStorage.setItem('kkAddress', data?.data.tgAccount);
        await localStorage.setItem('kkLoginType', 'tg');
        await localStorage.setItem('kGuid', data?.data.guid);
        setShowLoginModal(false);
        setWalletAddr(data?.data.tgAccount);
        await new Promise(resolve => setTimeout(resolve, 500));
        handleGetUserInfo();
      }
      else if(reqCount < 10) {
        reConnect = true;
        
        reLoginTimeout.current = setTimeout(() => {
          handleTgLogin(tempToken, reqCount + 1);
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

  const handleGetUserInfo = async(loginByToen = false) => {
    handleSetUserInfoLoading(true);
    await getUserInfo().then(async(res) => {
      const data = res?.data;
      if(data.status == 10000) {
        if(loginByToen) {
          await localStorage.setItem('kkAddress', data?.data.tgAccount || data?.data.account);
          await localStorage.setItem('kGuid', data?.data.guid);
        }
        handleSetUserInfo(data?.data);
        setWalletAddr(localStorage.getItem('kkAddress'));
      }
      else {
        errCodeHandler(data.status, data.msg)
      }
    })
    handleSetUserInfoLoading(false);
  }

  useEffect(() => {
    if (isConnected && address && connectForceRef.current) {
      if(!localStorage.getItem('kkAddress') || localStorage.getItem('kkAddress') != address)  {
        connectForceRef.current = false;
        handleConnectBsc();
      }
    }
  }, [isConnected, address]);

  useEffect(() => {
    if (modalTrigger) {
      setShowLoginModal(true);
    }
  }, [modalTrigger]);

  useEffect(() => {
    if (isDisconnected && address) {
      localStorage.removeItem('wagmi.wallet');
      disconnect();
    }
  }, [isDisconnected, address]);

  /*
  useEffect(() => {
    const tempAddr = localStorage.getItem('kkAddress');
    if(wallet?.account && tempAddr != wallet?.account.address) {
      handleConnect('ton');
    }
  }, [wallet]);
  */

  useEffect(() => {
    if(logoutTrigger) {
      triggerSetLogout(false);
      handleDisconnect();
    }
  }, [logoutTrigger]);
  
  useEffect(() => {
    const addr = localStorage.getItem('kkAddress');
    const token = getUrlParamsByName("token");
    console.log(addr)
    if(addr) {
      handleGetUserInfo();
    }
    else if(token) {
      localStorage.setItem('kkAuthToken', decodeURIComponent(token));
      handleGetUserInfo(true);
    }
    else {
      handleDisconnect();
    }
    
    let temp:any[] = [...installedConnectors, walletConnect({ projectId, showQrModal: true })];
    setConnecotrs(temp);

    let refcode = getUrlParamsByName('Referer') || getUrlParamsByName('referer') || getUrlParamsByName('REFERER');
    if(localStorage.getItem('kkRefCode') && !refcode) {
      refcode = localStorage.getItem('kkRefCode');
    }
    if(refcode) {
      localStorage.setItem('kkRefCode', refcode)
    }

    return () => {
      clearTimeout(reLoginTimeout.current);
      reLoginTimeout.current = null;
    }
  }, [])

  return (
    <>
    <div className="w-full md:w-auto relative md:ml-12 h-[50vh] md:h-auto" onMouseOver={() => setWalletDropdown(true)} onMouseOut={() => setWalletDropdown(false)}>
      <div className="hidden md:flex bg-black hover:bg-black/80 block p-[6px] h-8 md:h-9 items-center justify-center rounded-full">
        <div className="w-42 flex items-center justify-center text-sm md:text-base">
          {walletAddr ? 
            <>
            <div className="w-34 flex items-center justify-center md:text-lg">
              {walletAddr.length > 4 ? walletAddr?.substring(0, 4) + '...' + walletAddr?.substring(walletAddr?.length - 4, walletAddr?.length) : walletAddr}
            </div>
            {/*
            <div className="bg-black absolute -top-2 -right-3 p-2 rounded-full">
              <img className="group-hover:w-10 w-16 rounded-full transition-all duration-300" src="/images/logo_big.png" /> 
            </div>
            */}
            <img className="w-6 rounded-full transition-all duration-300 ml-2" src="/images/logo_big.png" /> 
            </>
            :
            <>
            <div className="w-34 flex items-center justify-center md:text-lg">
              {t('menu.connectWallet')}
            </div>
            {/*
            <div className="bg-black absolute -top-2 -right-3 p-2 rounded-full">
              <div className="bg-[#5e5e5e] p-2 rounded-full">
                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5357" width="48" height="48"><path d="M621.714286 490.057143C694.857143 446.171429 738.742857 373.028571 738.742857 292.571429c0-124.342857-102.4-219.428571-226.742857-219.428572-124.342857 0-226.742857 102.4-226.742857 219.428572 0 80.457143 36.571429 153.6 109.714286 190.171428C234.057143 533.942857 109.714286 694.857143 109.714286 870.4c0 36.571429 0 80.457143 80.457143 80.457143h636.342857c65.828571 0 80.457143-36.571429 80.457143-80.457143 7.314286-175.542857-117.028571-336.457143-285.257143-380.342857z" fill="#8f8f8f" p-id="5358"></path></svg>
              </div>
            </div>
            */}
            <div className="relative w-[26px] h-[26px] ml-2">
              {connecting && <span className="absolute top-1 left-1 animate-spin w-4 h-4 border-[3px] border-gray-400 rounded-full z-1 opacity-80"></span>}
              <img className="w-full" src="/images/icon_wallet.png" />
            </div>
            </>
          }
        </div>
      </div>
      <div className={"absolute left-0 top-9 w-full pt-2 block " + (walletDropdown ? '' : "md:hidden")}>
        <div className="w-full py-1 shadow-lg md:bg-black rounded-[10px] overflow-hidden">
          <div className="w-full">
            <div className="text-white/60 md:hidden mb-6">{walletAddr ? (walletAddr.length > 4 ? walletAddr?.substring(0, 4) + '...' + walletAddr?.substring(walletAddr?.length - 4, walletAddr?.length) : walletAddr) : t('menu.connectWallet')}</div>
            {walletAddr ? (
              <>
                <Link href="/personalInfo" className="bg-white/10 md:bg-transparent rounded-lg md:rounded-none w-full px-4 py-2 text-center hover:bg-white/10 flex items-center md:text-white">
                  <div className="w-full flex items-center justify-center">{t('menu.profile')}</div>
                </Link>
                
                <button className="bg-white/10 md:bg-transparent rounded-lg md:rounded-none w-full px-4 py-2 text-center hover:bg-white/10 flex items-center md:text-white mt-6 md:mt-0" onClick={() => handleDisconnect()}>
                  <div className="w-full flex items-center justify-center">{t('menu.logout')}</div>
                </button>
              </>
            ) : (
            <>
              <button className="bg-white/10 md:bg-transparent rounded-lg md:rounded-none w-full px-4 py-2 text-center hover:bg-white/10 flex items-center md:text-white" onClick={() => handleShowBscModal()}>
                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="26" height="26"><path d="M509.1328 11.8784A502.852267 502.852267 0 1 1 6.826667 514.730667C6.826667 237.07648 231.87456 11.96032 509.5424 11.8784" fill="#F0B90B" p-id="6463"></path><path d="M379.016533 460.663467l76.049067-75.912534 16.110933-15.9744 38.0928-38.0928 129.4336 129.979734 75.502934-75.912534L509.269333 179.541333 303.650133 384.750933z" fill="#FFFFFF" p-id="6464"></path><path d="M433.670827 514.648747l75.680426-75.680427 75.69408 75.680427-75.69408 75.69408z" fill="#FFFFFF" p-id="6465"></path><path d="M638.702933 568.797867l-129.570133 129.570133-45.4656-45.4656-8.328533-8.328533-76.322134-75.776-75.3664 75.502933L509.269333 849.5104l204.936534-205.2096zM173.943467 514.730667l75.69408-75.680427 75.69408 75.680427-75.69408 75.69408zM692.87936 514.771627l75.680427-75.680427 75.69408 75.680427-75.69408 75.69408z" fill="#FFFFFF"></path></svg>
                <span className="text-sm md:text-base font-medium ml-2">{t('menu.bscWallets')}</span>
              </button>
              <button className="bg-white/10 md:bg-transparent rounded-lg md:rounded-none w-full px-4 py-2 text-center hover:bg-white/10 flex items-center md:text-white mt-6 md:mt-0" onClick={() => handleTgLogin()}>
                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7640" width="26" height="26"><path d="M0 512c0 282.624 229.376 512 512 512s512-229.376 512-512S794.624 0 512 0 0 229.376 0 512z" fill="#1196db" p-id="7641"></path><path d="M216.576 481.792S467.968 378.88 555.008 342.528c33.28-14.336 146.944-60.928 146.944-60.928s52.224-20.48 48.128 29.184c-1.536 20.48-13.312 91.648-24.576 168.448-17.408 109.056-36.352 228.352-36.352 228.352s-3.072 33.28-27.648 39.424-65.536-20.48-72.704-26.112c-5.632-4.608-109.056-69.632-146.944-101.888-10.24-8.704-22.016-26.112 1.536-46.592 52.224-48.128 114.688-107.52 152.576-145.408 17.408-17.408 34.816-58.368-37.888-8.704-102.912 71.168-204.8 138.24-204.8 138.24s-23.04 14.336-67.072 1.536c-43.52-13.312-94.208-30.72-94.208-30.72s-34.816-22.016 24.576-45.056z" fill="#FFFFFF" p-id="7642"></path></svg>
                <span className="text-sm md:text-base font-medium ml-2">{t('menu.tgLogin')}</span>
              </button>
            </>
            )}
          </div>
        </div>
      </div>
    </div>
    <Modal
        isOpen={showLoginModal}
        onRequestClose={() => setShowLoginModal(false)}
        shouldCloseOnOverlayClick={true}
        className=""
      >
        <div className="w-80 text-center p-6 bg-black rounded-lg">
          <h2 className="text-2xl font-bold mb-9 text-white">Connect to Wallet</h2>
          <Button className="w-60 text-white md:text-[20px] px-6 py-2 md:px-12 md:py-3 flex items-center" onClick={() => handleShowBscModal()}>
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="26" height="26"><path d="M509.1328 11.8784A502.852267 502.852267 0 1 1 6.826667 514.730667C6.826667 237.07648 231.87456 11.96032 509.5424 11.8784" fill="#F0B90B" p-id="6463"></path><path d="M379.016533 460.663467l76.049067-75.912534 16.110933-15.9744 38.0928-38.0928 129.4336 129.979734 75.502934-75.912534L509.269333 179.541333 303.650133 384.750933z" fill="#FFFFFF" p-id="6464"></path><path d="M433.670827 514.648747l75.680426-75.680427 75.69408 75.680427-75.69408 75.69408z" fill="#FFFFFF" p-id="6465"></path><path d="M638.702933 568.797867l-129.570133 129.570133-45.4656-45.4656-8.328533-8.328533-76.322134-75.776-75.3664 75.502933L509.269333 849.5104l204.936534-205.2096zM173.943467 514.730667l75.69408-75.680427 75.69408 75.680427-75.69408 75.69408zM692.87936 514.771627l75.680427-75.680427 75.69408 75.680427-75.69408 75.69408z" fill="#FFFFFF"></path></svg>
            <span className="text-sm md:text-base font-medium ml-2">{t('menu.bscWallets')}</span>
          </Button>
          <div className="mt-6">
            <Button className="w-60 text-white md:text-[20px] px-6 py-2 md:px-12 md:py-3 flex items-center" onClick={() => handleTgLogin()}>
              <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7640" width="26" height="26"><path d="M0 512c0 282.624 229.376 512 512 512s512-229.376 512-512S794.624 0 512 0 0 229.376 0 512z" fill="#1196db" p-id="7641"></path><path d="M216.576 481.792S467.968 378.88 555.008 342.528c33.28-14.336 146.944-60.928 146.944-60.928s52.224-20.48 48.128 29.184c-1.536 20.48-13.312 91.648-24.576 168.448-17.408 109.056-36.352 228.352-36.352 228.352s-3.072 33.28-27.648 39.424-65.536-20.48-72.704-26.112c-5.632-4.608-109.056-69.632-146.944-101.888-10.24-8.704-22.016-26.112 1.536-46.592 52.224-48.128 114.688-107.52 152.576-145.408 17.408-17.408 34.816-58.368-37.888-8.704-102.912 71.168-204.8 138.24-204.8 138.24s-23.04 14.336-67.072 1.536c-43.52-13.312-94.208-30.72-94.208-30.72s-34.816-22.016 24.576-45.056z" fill="#FFFFFF" p-id="7642"></path></svg>
              <span className="text-sm md:text-base font-medium ml-2">{t('menu.tgLogin')}</span>
            </Button>
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
          <div className="text-white text-center text-[20px]">{t('menu.tgLogin')}</div>
          <button id="open-tg-link" className="open-tg-link w-60 text-white md:text-[20px] px-6 py-2 md:px-12 md:py-3 bg-[#6E4DFF] mt-6 rounded-lg"
          onClick={() => {
            window.open(tgLink, '_blank');
            setShowToTgModal(false);
            reLoginTimeout.current = setTimeout(() => {
              handleTgLogin(tgWebLoginToken, 1);
            }, 5000);
          }}>
            <span className="text-sm md:text-base font-medium ml-2">{t('menu.openTgToLogin')}</span>
          </button>
        </div>
    </Modal>
    </>
  );
}
