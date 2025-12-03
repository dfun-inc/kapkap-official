'use client';

import { useAppContext } from '@/context/AppContext';
import { useErrCode } from '@/datas/errCode';
import { getEvmMint1155History, getTonMint721History } from '@/services/apis/nft';
import { formatDatetime } from '@/utils/time';
import { useTranslations } from 'next-intl';
import { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import Modal from 'react-modal';

type Props = {
  NFTData: any;
  NFT1155Data: any;
};

type HistoryHandle = {
  handleShowModal: () => void;
};

const History = forwardRef<HistoryHandle, Props>(({NFTData, NFT1155Data}, ref) => {
  const t = useTranslations();
  const [mintHistoryModal, setMintHistoryModal] = useState(false);
  const [historyTabIdx, setHistoryTabIdx] = useState(0);
  const [mintHistory, setMintHistory] = useState<any[]>([]);
  const [mintHistoryLoading, setMintHistoryLoading] = useState<boolean>(false);

  const { configData } = useAppContext();
  
  const { errCodeHandler } = useErrCode();

  const handleGetMintHistory = async (tab: number) => {
    setMintHistoryLoading(true);
    setMintHistory([]);

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
          errCodeHandler(data.status)
        }
      }
    }
    catch{}
    setMintHistoryLoading(false);
  }

  useImperativeHandle(ref, () => ({
    handleShowModal() {
      setMintHistoryModal(true);
    }
  }));

  useEffect(() => {
    if(mintHistoryModal) {
      handleGetMintHistory(historyTabIdx);
    }
    else {
      setHistoryTabIdx(0);
    }
  }, [mintHistoryModal, historyTabIdx])

  return (
    <>
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
    </>
  );
})

History.displayName = 'History'; // Next.js 中避免 forwardRef 命名警告
export default History;