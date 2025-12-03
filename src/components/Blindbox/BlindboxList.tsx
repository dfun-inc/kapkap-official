"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Modal from "react-modal";

import { useAppContext } from "@/context/AppContext";
import Button from "@/components/ui/Button";
import { useErrCode } from "@/datas/errCode";
import { getMyBoxList, openBox } from "@/services/apis/blindbox";

type Props = {
  userInfo: any;
  blindboxConfig: any;
  boxConfigLoading: boolean;
  myListTrigger: number;
  NftData: any;
  triggerKscore: (val: number) => void;
};
export default function BlindboxList({ userInfo, blindboxConfig, boxConfigLoading, myListTrigger, NftData, triggerKscore }: Props) {
  const t = useTranslations();

  const { configData, triggerModalOpen } = useAppContext();
  const [addr, setAddr] = useState<string>('');
  const [myboxLoading, setMyBoxLoading] = useState<boolean>(true);
  const [myBoxList, setMyBoxList] = useState<any>({});
  const [drawLaoding, setDrawLoading] = useState<string[]>([]);
  const [drawResultList, setDrawResultList] = useState<any[]>([]);
  const [resultModalOpen, setResultModalOpen] = useState<boolean>(false);
  const [blindBoxConfigList, setBlindboxConfigList] = useState<any[]>([]);

  const [showBlindboxDetailModal, setShowBlindboxDetailModal] = useState<boolean>(false);
  const [blindboxDetail, setBlindboxDetail] = useState<any>(null);

  const { errCodeHandler } = useErrCode();

  const handleOpenBox = async (boxId: string, amount: number) => {
    if(!myBoxList.hasOwnProperty(boxId) || myBoxList[boxId] < amount) {
      return;
    }
    if(drawLaoding.length) {
      return;
    }
    setDrawLoading([...drawLaoding, boxId + '-' + amount]);

    await openBox({
      boxId,
      count: amount
    })
    .then(res => {
      const data = res?.data
      if(data.status == 10000) {
        let temp:any[] = [];
        data.data?.map((item:any) => {
          if(item?.type.toLowerCase() == 'item') {
            temp.push({
              ...item,
              item: blindboxConfig[item.itemId]
            })
          }
          else if(item?.type.toLowerCase() == 'nft') {
            temp.push({
              ...item,
              item: NftData[item.itemId]
            })
          }
          else {
            temp.push({
              ...item
            })
          }
        })
        setDrawResultList(temp);
        setResultModalOpen(true);
        handleGetMyBoxList();
        triggerKscore(Date.now())
      }
      else {
        errCodeHandler(data.status);
      }
    })

    setDrawLoading([])
  }

  const handleGetMyBoxList = async () => {
    setMyBoxList([]);
    setMyBoxLoading(true);
    await getMyBoxList()
    .then((res) => {
      const data = res?.data
      if(data.status == 10000) {
        let temp:any[] = [];
        data.data.forEach((item: any) => {
          temp[item.valueType] = item.value;
        })
        setMyBoxList(temp);
      }
      else {
        errCodeHandler(data.status);
      }
    })
    setMyBoxLoading(false);
  }

  const handleShowBlindboxDetailModal = (item:any) => {
    setBlindboxDetail(item);
    setShowBlindboxDetailModal(true);
  }

  useEffect(() => {
    if(blindboxConfig != null && Object.keys(blindboxConfig).length) {
      let temp:any[] = [];
      Object.keys(blindboxConfig).forEach((key) => {
        if(blindboxConfig[key]?.type == 'box') {
          temp.push(blindboxConfig[key]);
        }
      })
      temp.sort((a, b) => a.boxID - b.boxID);
      setBlindboxConfigList(temp);
    }
  }, [blindboxConfig])

  useEffect(() => {
    if(userInfo) {
      handleGetMyBoxList();
    }
    else {
      setAddr('');
    }
  }, [userInfo, myListTrigger])

  useEffect(() => {
    const addr = localStorage.getItem('kkAddress');
    setAddr(addr || '');
  }, [])

  return (
    <div className="flex flex-wrap justify-between mt-18 xl:px-24">
      {boxConfigLoading ?  (
        <>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="animate-pulse w-[45%] md:w-[21%] mb-12">
              <div className="w-1/2 mx-auto h-6 bg-gray-500 rounded-md"></div>
              <div className="mt-3 w-full aspect-square bg-gray-500 rounded-[20px]"></div>
              <div className="mt-3 w-16 mx-auto h-8 bg-gray-500 rounded-md"></div>
              <div className="mt-6 w-full h-10 bg-gray-500 rounded-md"></div>
            </div>
          ))}
        </>
      )
      :
      blindBoxConfigList?.map((item: any, index: number) => (
        <div key={index} className="w-[46%] md:w-[22%] mb-12">
          <div className="text-center text-[#FEBD32] text-[12px] md:text-[16px]">{item?.name}</div>
          <img className="w-full mt-3 rounded-[20px] cursor-pointer hover:scale-[105%] transition-all duration-300" src={'/images/blindbox/' + item?.img + '.jpg'} alt="" onClick={() => handleShowBlindboxDetailModal(item)} />
          {addr != '' || userInfo ? 
            <>
              {userInfo &&
              <>
                {myboxLoading ? 
                  <div className="my-4 flex justify-center">
                    <div className="w-13 h-13 border-[8px] animate-spin"></div>
                  </div>
                :
                  <div className="mt-3 font-univia-pro-bold text-[50px] text-center text-white">x{myBoxList.hasOwnProperty(item?.boxID) ? myBoxList[item?.boxID] : 0}</div>
                }
              </>}
              <Button className="w-full text-[18px] lg:text-[20px] text-white flex items-end justify-center py-2 leading-none mt-2" fullWidth={true} disabled={myBoxList.hasOwnProperty(item?.boxID) ? myBoxList[item?.boxID] <= 0 : true} onClick={() => handleOpenBox(item?.boxID, 1)}>
                <span className="capitalize">{t('blindbox.open')}</span>
                <span className="font-univia-pro-bold text-[24px] lg:text-[30px] mx-2 relative top-[3px]">1</span>
                <span className="">{t('blindbox.box')}</span>
                {drawLaoding.includes(item?.boxID + '-1') &&
                  <div className="w-5 h-5 border-[3px] animate-spin ml-2"></div>
                }
              </Button>
              <Button className="w-full text-[18px] lg:text-[20px] text-white flex items-end justify-center py-2 leading-none mt-4" fullWidth={true} disabled={myBoxList.hasOwnProperty(item?.boxID) ? myBoxList[item?.boxID] < 10 : true} onClick={() => handleOpenBox(item?.boxID, 10)}>
                <span className="capitalize">{t('blindbox.open')}</span>
                <span className="font-univia-pro-bold text-[24px] lg:text-[30px] mx-2 relative top-[3px]">10</span>
                <span className="">{t('blindbox.boxes')}</span>
                {drawLaoding.includes(item?.boxID + '-10') &&
                  <div className="w-5 h-5 border-[3px] animate-spin ml-2"></div>
                }
              </Button>
            </>
            :
            <Button className="w-full text-[18px] lg:text-[20px] text-white flex items-end justify-center py-2 leading-none mt-6" fullWidth={true} onClick={() => triggerModalOpen()}>
              {t('menu.login')}
            </Button>
          }
        </div>
      ))}

      <Modal
        isOpen={resultModalOpen}
        onRequestClose={() => setResultModalOpen(false)}
        shouldCloseOnOverlayClick={true}
        preventScroll={true}
        className={"w-9/10! " + (drawResultList.length > 1 ? "xl:w-[1000px]!" : "xl:w-[800px]!")}
      >
        <div className="draw-result-modal w-full bg-black rounded-[20px] overflow-hidden">
          <div className="p-6">
            <div className="text-[20px] md:text-[22px] 2xl:text-[24px] font-ethnocentric-rg text-[#FEBD32] text-center uppercase pb-6 border-b border-[#FEBD32]">
              {drawResultList.length} {drawResultList.length > 1 ? t('blindbox.drawResults') : t('blindbox.drawResult')}
            </div>
          </div>
          <div className={"px-6 max-h-[70vh] overflow-y-auto flex flex-wrap items-stretch " + (drawResultList.length > 1 ? "justify-between" : "justify-center")}>
          {drawResultList?.map((item: any, index: number) => (
            <div key={index} className={"my-5 flex flex-wrap flex-col items-stretch justify-between " + (drawResultList.length > 1 ? "w-[45%] lg:w-[18%]" : "w-[50%] md:w-[200px]")}>
              <div className="w-full text-[12px] md:text-[14px] text-center text-[#DDD5FF]">
                {item.type?.toLowerCase() == 'item' && item.item?.name}
                {item.type?.toLowerCase() == 'nft' && 
                  <><span className="text-[#FEBD32] mr-1">Lv.{item.item?.level}</span> {item.item?.name}</>}
              </div>
              <div className="flex justify-center mt-3 w-full">
                {item.type?.toLowerCase() == 'kscore' && <img className="h-[80px] block" src="/images/kscore.png" />}
                {item.type?.toLowerCase() == 'item' && <>{
                  item.item?.type == 'asset' ?
                    <img className="h-[80px] block" src="/images/kscore.png" alt="" />
                    :
                    <img className="h-[80px] block rounded-[20px]" src={'/images/blindbox/' + item.item?.img + '.jpg'} alt="" />
                }</>}
                {item.type?.toLowerCase() == 'nft' && <img className="h-[80px] block rounded-[20px]" src={configData?.IPFSTON + item.item?.project + '/image/' +  item.item?.name.replace(' ', '-') + '.png'} alt="" />}
              </div>
              <div className="w-full text-center mt-4 text-[#FEED32] text-[20px] md:text-[26px]">x{item?.amount}</div>
            </div>
          ))}
          </div>
          <div className="px-12 py-5 mt-6 bg-[#1d1b27] flex justify-center">
            <Button className="text-[24px] text-[30px] py-3 md:py-5 px-[80px] md:px-[150px]" onClick={() => setResultModalOpen(false)}>OK</Button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={showBlindboxDetailModal}
        onRequestClose={() => setShowBlindboxDetailModal(false)}
        shouldCloseOnOverlayClick={true}
        className="w-9/10! lg:w-[400px]!"
      >
        <div className="w-full p-6 bg-black rounded-lg">
          <div className="relative text-white">
            <button className="absolute top-1/2 right-0 -translate-y-1/2 cursor-pointer hover:opacity-80" onClick={() => setShowBlindboxDetailModal(false)}>
              <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="22" height="22"><path d="M431.559111 512L149.959111 230.4a56.888889 56.888889 0 0 1 80.440889-80.440889L512 431.559111l281.6-281.6a56.888889 56.888889 0 0 1 80.440889 80.440889L592.440889 512l281.6 281.6a56.888889 56.888889 0 1 1-80.440889 80.440889L512 592.440889 230.4 874.040889a56.888889 56.888889 0 1 1-80.440889-80.440889L431.559111 512z" fill="#ffffff"></path></svg>
            </button>
          </div>
          {blindboxDetail != null && (
            <div className="mt-6">
              <div className="text-white text-[20px] text-center">{blindboxDetail?.name}</div>
              <img className="w-1/2 mx-auto block rounded-[20px] mt-6" src={'/images/blindbox/' + blindboxDetail?.img + '.jpg'} alt="" />
              <div className="text-[#8A84A3] mt-3">{blindboxDetail?.desc}</div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}