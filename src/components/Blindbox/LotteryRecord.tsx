"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Modal from "react-modal";

import { useAppContext } from "@/context/AppContext";
import { useErrCode } from "@/datas/errCode";

export default function LooteryRecord() {
  const t = useTranslations();

  const [addr, setAddr] = useState<string>('');
  const [recordModalOpen, setRecordModalOpen] = useState<boolean>(false);
  const [recordList, setRecordList] = useState<any[]>([]);
  const [recordListLoading, setRecordListLoading] = useState<boolean>(true);

  const handleGetRecordList = async() => {

  }

  useEffect(() => {
    if(recordModalOpen) {
      setRecordList([]);
      setRecordListLoading(true);
      handleGetRecordList();
    }
  }, [recordModalOpen])

  useEffect(() => {
    const addr = localStorage.getItem('kkAddress');
    setAddr(addr || '');
  }, [])

  return (
    <>
      <button className="text-[#8D73FF] cursor-pointer underline hover:text-[#6E4DFF] text-[20px] uppercase" onClick={() => setRecordModalOpen(true)}>{t('blindbox.lotteryRecord')}</button>
      <Modal 
        isOpen={recordModalOpen}
        onRequestClose={() => setRecordModalOpen(false)}
        shouldCloseOnOverlayClick={true}
        className="w-9/10! xl:w-[1000px]! 2xl:w-[1200px]!"
      >
        <div className="w-full bg-[#101014] rounded-[20px] overflow-hidden">
          <div className="p-6 relative bg-[#201e2a]">
            <div className="text-[20px] md:text-[24px] font-ethnocentric-rg text-[#FEBD32] text-center uppercase">{t('blindbox.drawHistory')}</div>
            <button className="cursor-pointer hover:opacity-80 absolute top-1/2 right-6 -translate-y-1/2" onClick={() => setRecordModalOpen(false)}>
              <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="30" height="30"><path d="M431.559111 512L149.959111 230.4a56.888889 56.888889 0 0 1 80.440889-80.440889L512 431.559111l281.6-281.6a56.888889 56.888889 0 0 1 80.440889 80.440889L592.440889 512l281.6 281.6a56.888889 56.888889 0 1 1-80.440889 80.440889L512 592.440889 230.4 874.040889a56.888889 56.888889 0 1 1-80.440889-80.440889L431.559111 512z" fill="#ffffff"></path></svg>
            </button>
          </div>
          <div className="p-6">
            <div className="w-full overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="flex text-center text-[#8A84A3] text-[18px] md:text-[20px] py-2 border-b-[2px] border-[#211c33]">
                  <div className="w-[28%] px-1">{t('blindbox.bonusName')}</div>
                  <div className="w-[28%] px-1">{t('blindbox.bonusType')}</div>
                  <div className="w-[28%] px-1">{t('blindbox.drawTime')}</div>
                  <div className="flex px-1">{t('blindbox.status')}</div>
                </div>
                {recordListLoading ? 
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="py-2 border-b-[2px] border-[#211c33]">
                      <div className="bg-gray-500 animate-pulse rounded-lg h-6"></div>
                    </div>
                  ))
                  :
                  <>
                  {recordList.length == 0 ?
                    <div className="py-16 text-center">
                      <svg className="mx-auto" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="48" height="48"><path d="M855.6 427.2H168.5c-12.7 0-24.4 6.9-30.6 18L4.4 684.7C1.5 689.9 0 695.8 0 701.8v287.1c0 19.4 15.7 35.1 35.1 35.1H989c19.4 0 35.1-15.7 35.1-35.1V701.8c0-6-1.5-11.8-4.4-17.1L886.2 445.2c-6.2-11.1-17.9-18-30.6-18zM673.4 695.6c-16.5 0-30.8 11.5-34.3 27.7-12.7 58.5-64.8 102.3-127.2 102.3s-114.5-43.8-127.2-102.3c-3.5-16.1-17.8-27.7-34.3-27.7H119c-26.4 0-43.3-28-31.1-51.4l81.7-155.8c6.1-11.6 18-18.8 31.1-18.8h622.4c13 0 25 7.2 31.1 18.8l81.7 155.8c12.2 23.4-4.7 51.4-31.1 51.4H673.4zM819.9 209.5c-1-1.8-2.1-3.7-3.2-5.5-9.8-16.6-31.1-22.2-47.8-12.6L648.5 261c-17 9.8-22.7 31.6-12.6 48.4 0.9 1.4 1.7 2.9 2.5 4.4 9.5 17 31.2 22.8 48 13L807 257.3c16.7-9.7 22.4-31 12.9-47.8zM375.4 261.1L255 191.6c-16.7-9.6-38-4-47.8 12.6-1.1 1.8-2.1 3.6-3.2 5.5-9.5 16.8-3.8 38.1 12.9 47.8L337.3 327c16.9 9.7 38.6 4 48-13.1 0.8-1.5 1.7-2.9 2.5-4.4 10.2-16.8 4.5-38.6-12.4-48.4zM512 239.3h2.5c19.5 0.3 35.5-15.5 35.5-35.1v-139c0-19.3-15.6-34.9-34.8-35.1h-6.4C489.6 30.3 474 46 474 65.2v139c0 19.5 15.9 35.4 35.5 35.1h2.5z" fill="#757895"></path></svg>
                    </div>
                    :
                    recordList.map((item, index) => (
                      <div key={index} className="flex text-center text-[#8A84A3] text-[18px] md:text-[20px] py-2 border-b-[2px] border-[#211c33]">

                      </div>
                    ))
                  }
                  </>
                }
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}