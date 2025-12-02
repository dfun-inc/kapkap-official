"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Modal from "react-modal";

import { useAppContext } from "@/context/AppContext";
import Button from "@/components/ui/Button";
import { useErrCode } from "@/datas/errCode";
import { getKScore } from "@/services/apis/user";
import { exchangeBox } from "@/services/apis/blindbox";

type Props = {
  userInfo: any;
  onSaleBlindbox: any;
  triggerMyList: (val: number) => void;
  kscoreTrigger: number;
};
export default function MysteryShop({ userInfo, onSaleBlindbox, triggerMyList, kscoreTrigger }: Props) {
  const t = useTranslations();

  const { triggerModalOpen } = useAppContext();
  const [addr, setAddr] = useState<string>('');
  const [kscore, setKscore] = useState<number>(0);
  const [kscoreLoading, setKscoreLoading] = useState<boolean>(true);
  const [shopModalOpen, setShopModalOpen] = useState<boolean>(false);
  const [buyAmount, setBuyAmount] = useState(1);
  const [buyLoading, setBuyLoading] = useState<boolean>(false);

  const { errCodeHandler } = useErrCode();

  const handleGetKscore = async () => {
    setKscoreLoading(true);
    await getKScore(10000)
    .then((res) => {
      const data = res?.data;
      if(data.status == 10000 || data.status == 30082) {
        setKscore(data?.data || 0);
      }
      else {
        errCodeHandler(data.status, data.msg)
      }
    })
    setKscoreLoading(false);
  }

  const handleBuyAmountChange = (e: any) => {
    const value = e.target.value;
    if(value <= 0) {
      setBuyAmount(1);
      return;
    }
    setBuyAmount(parseInt(value));
  }

  const handleBuy = async () => {
    if(buyLoading || kscoreLoading || buyAmount * 10 > kscore) {
      return;
    }

    setBuyLoading(true);

    await exchangeBox({
      boxId: onSaleBlindbox ? onSaleBlindbox?.boxID : '',
      amount: buyAmount,
    })
    .then((res) => {
      const data = res?.data;
      if(data.status == 10000) {
        toast.success(t('blindbox.buySuccess'));
        handleGetKscore();
        triggerMyList(Date.now());
      }
      else {
        errCodeHandler(data.status, data.msg);
      }
    })
    
    setBuyLoading(false);
  }

  useEffect(() => {
    if(userInfo) {
      handleGetKscore();
    }
    else {
      setAddr('');
      setKscore(0);
    }
  }, [userInfo, kscoreTrigger])

  useEffect(() => {
    const addr = localStorage.getItem('kkAddress');
    setAddr(addr || '');
  }, [])

  return (
    <div className="w-full md:w-[360px] 2xl:w-[400px] p-7 bg-black rounded-[20px]">
      <div className="text-[20px] md:text-[22px] 2xl:text-[24px] font-ethnocentric-rg text-[#FEBD32] text-center uppercase pb-6 border-b border-[#FEBD32]">{t('blindbox.mysteryShop')}</div>
      
      {onSaleBlindbox == null ? 
        <div className="animate-pulse">
          <div className="mt-9 w-[240px] rounded-[20px] mx-auto block bg-gray-500 aspect-square"></div>
          <div className="mt-6 h-6 w-1/2 mx-auto bg-gray-500 rounded-lg"></div>
        </div>
        :
        <>
          <img className="mt-9 w-[240px] rounded-[20px] mx-auto block" src={"/images/blindbox/" + onSaleBlindbox?.img + ".jpg"} alt="" />
          <div className="mt-4 font-univia-pro-bold text-[40px] text-center text-white leading-none">x1</div>
          <div className="text-center text-[#FEBD32] text-[12px] md:text-[16px]">{onSaleBlindbox?.name}</div>
        </>
      }
      <div className="mt-10">
        <Button className="flex items-center justify-between py-4 px-7 text-[20px]" fullWidth={true} onClick={addr || userInfo ? () => setShopModalOpen(true) : () => triggerModalOpen()}>
          <div className="flex items-center ">
            <img className="block w-9 mr-2" src="/images/kscore.png" />
            {onSaleBlindbox == null ?
              <span className="animate-spin w-5 h-5 border-[3px]"></span>
              :
              <span className="text-[#FEED32] font-univia-pro-bold">{onSaleBlindbox?.price}</span>
            }
          </div>
          <span className="text-white capitalize">{t('blindbox.buy')}</span>
        </Button>
      </div>

      <Modal
        isOpen={shopModalOpen}
        onRequestClose={() => setShopModalOpen(false)}
        shouldCloseOnOverlayClick={true}
        className="w-9/10! lg:w-[440px]!"
      >
        <div className="w-full bg-black rounded-[20px] overflow-hidden">
          <div className="p-6">
            {onSaleBlindbox != null &&
            <>
              <div className="text-[18px] md:text-[20px] font-ethnocentric-rg text-[#FEBD32] text-center uppercase pb-6 border-b border-[#FEBD32]">{onSaleBlindbox?.name}</div>
              <img className="mt-9 w-[240px] rounded-[20px] mx-auto block" src={"/images/blindbox/" + onSaleBlindbox?.img + ".jpg"} alt="" />
            </>}
            <div className="mt-9 flex justify-center items-center">
              <img className="block w-9" src="/images/kscore.png" />
              <div className="flex items-center justify-center ml-1 text-[#FEED32] font-univia-pro-bold text-[20px]">
                <span>{10 * buyAmount}</span>
                <span>/</span>
                {kscoreLoading ? 
                  <span className="animate-spin w-5 h-5 border-[3px]"></span>
                  :
                  <span>{kscore}</span>
                }
              </div>
            </div>
            <div className="mt-1 flex items-center justify-between space-x-2 px-6">
              <Button className="w-15 h-15 flex items-center justify-center text-[24px] md:text-[30px]" outerClassName="w-15 h-16 shrink-0" onClick={() => setBuyAmount(buyAmount > 1 ? buyAmount - 1 : 1)}>-</Button>
              <div className="flex-1 shrink-1 h-15 flex items-center justify-center text-white bg-[#1a1a1a] text-[20px] rounded-[10px]">{buyAmount}</div>
              <Button className="w-15 h-15 flex items-center justify-center text-[24px] md:text-[30px]" outerClassName="w-15 h-16 shrink-0" onClick={() => setBuyAmount(buyAmount + 1)} disabled={buyLoading}>+</Button>
            </div>
          </div>
          <div className="px-12 py-5 mt-6 bg-[#1d1b27]">
            <Button className="text-[24px] text-[30px] py-3 md:py-5 capitalize flex items-center justify-center" 
              fullWidth={true} onClick={handleBuy} disabled={kscoreLoading || buyAmount * 10 > kscore}>
              <span className="mr-2">{t('blindbox.buy')}</span>
              {buyLoading && <span className="w-5 h-5 border-[3px] border-white animate-spin ml-2"></span>}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}