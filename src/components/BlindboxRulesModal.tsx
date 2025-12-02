'use client';

import { useTranslations } from "next-intl";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import Modal from "react-modal";
import Button from "@/components/ui/Button";

export interface BlindboxRulesModalRef {
  showModal: () => void;
}

const BlindboxRulesModal = forwardRef<BlindboxRulesModalRef>((props, ref) => {
  const t = useTranslations();
  const [showModal, setShowModal] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    showModal() {
      setShowModal(true);
    },
  }));

  return <Modal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          shouldCloseOnOverlayClick={true}
          className="w-9/10! 2xl:w-[1200px]!"
        >
          <div className="draw-result-modal w-full bg-black rounded-[20px] overflow-hidden">
            <div className="p-6">
              <div className="text-[20px] md:text-[22px] 2xl:text-[24px] font-ethnocentric-rg text-[#FEBD32] text-center uppercase pb-6 border-b border-[#FEBD32]">{t('blindbox.airdropRules')}</div>
            </div>
            <div className="py-8 md:py-12 leading-none">
              <div className="flex items-end justify-center space-x-1 md:space-x-15">
                <div className="flex items-end">
                  <img src="/images/kscore.png" alt="" className="w-8 md:w-14 relative top-2" />
                  <div className="ml-2">
                    <div className="text-[10px] md:text-[14px] text-[#DDD5FF] mb-1">{t('blindbox.historicalKScore')}</div>
                    <div className="font-univia-pro-bold text-[#FEED32] text-[14px] md:text-[26px]">0,000,000</div>
                  </div>
                </div>
                <div className="font-univia-pro-bold relative bottom-1 text-[#FEED32] text-[12px] md:text-[26px]">+</div>
                <div className="font-univia-pro-bold relative bottom-1 text-[#FEED32] text-[12px] md:text-[26px]">{t('blindbox.nftEquityValue')}</div>
                <div className="font-univia-pro-bold relative bottom-1 text-[#FEED32] text-[12px] md:text-[26px]">=</div>
                <div className="font-univia-pro-bold relative bottom-1 text-[#FEED32] text-[12px] md:text-[26px]">{t('blindbox.airdropBenefits')}</div>
              </div>
            </div>
            <div className="px-6 md:px-24 py-3 md:py-9 bg-[#201E2A] text-[#DDD5FF] text-[14px] md:text-[18px]">
              <div>{t('blindbox.modalItem1')}</div>
              <div className="flex flex-wrap mt-3 md:mt-6 items-center">
                <div className="w-full md:w-auto md:flex-1">
                  <span className="text-[#FEBD32] md:pl-3">{t('blindbox.method')} 1: </span>
                  <span className="ml-2">{t('blindbox.modalItem1_1')}</span>
                </div>
                <div className="w-full md:w-auto mt-3 md:mt-0 flex justify-end">
                  <Button href="/genkiMinerMint" className="w-30 py-3 text-[16px] text-white text-center">{t('blindbox.joinNow')}</Button>
                </div>
              </div><div className="flex flex-wrap mt-1 md:mt-3 items-center">
                <div className="w-full md:w-auto md:flex-1">
                  <span className="text-[#FEBD32] md:pl-3">{t('blindbox.method')} 2: </span>
                  <span className="ml-2">{t('blindbox.modalItem1_2')}</span>
                </div>
                <div className="w-full md:w-auto mt-3 md:mt-0 flex justify-end">
                  <Button href="/blindbox" className="w-30 py-3 text-[16px] text-white text-center">{t('blindbox.joinNow')}</Button>
                </div>
              </div>
              <div className="mt-12">{t('blindbox.modalItem2')}</div>
              <div className="flex flex-wrap mt-3 md:mt-6 items-center">
                <div className="w-full md:w-auto md:flex-1">
                  <span className="text-[#FEBD32] md:pl-3">{t('blindbox.method')} 1: </span>
                  <span className="ml-2">{t('blindbox.modalItem2_1')}</span>
                </div>
                <div className="w-full md:w-auto mt-3 md:mt-0 flex justify-end">
                  <Button href="/personalInfo" className="w-30 py-3 text-[16px] text-white text-center">{t('blindbox.joinNow')}</Button>
                </div>
              </div><div className="flex flex-wrap mt-1 md:mt-3 items-center">
                <div className="w-full md:w-auto md:flex-1">
                  <span className="text-[#FEBD32] md:pl-3">{t('blindbox.method')} 2: </span>
                  <span className="ml-2">{t('blindbox.modalItem2_2')}</span>
                </div>
                <div className="w-full md:w-auto mt-3 md:mt-0 flex justify-end">
                  <Button href="/blindbox" className="w-30 py-3 text-[16px] text-white text-center">{t('blindbox.joinNow')}</Button>
                </div>
              </div>
            </div>
          </div>
        </Modal>;
});

export default BlindboxRulesModal;