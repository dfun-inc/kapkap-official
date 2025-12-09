"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Modal from "react-modal";

import { useAppContext } from "@/context/AppContext";
import { useErrCode } from "@/datas/errCode";
import { getReferralHistory, getRefeeealInfo, getReferralCode, getRankInfo, claimReward } from "@/services/apis/referral";
import { formatDatetime } from "@/utils/time";
import Button from "@/components/ui/Button";

type Props = {
  userInfo: any;
  blindboxConfig: any;
  triggerMyList: (trigger: number) => void;
  rewardBlindbox: any;
};

export default function Invite({ userInfo, blindboxConfig, triggerMyList, rewardBlindbox }: Props) {
  const t = useTranslations();

  const { configData, triggerModalOpen } = useAppContext();

  const [rankList, setRankList] = useState<any[]>([]);
  const [rankListLoading, setRankListLoading] = useState<boolean>(true);
  const [claimLoading, setClaimLoading] = useState<boolean>(false);
  const [myRankInfo, setMyRankInfo] = useState<any>(null);

  const [referralInfo, setReferralInfo] = useState<any>(null);
  const [referralInfoLoading, setReferralInfoLoading] = useState<boolean>(false);
  const [referralCode, setReferralCode] = useState<string>('');

  const [historyLoading, setHistoryLoading] = useState<boolean>(true);
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [leftBoxHeight, setLeftBoxHeight] = useState<number>(0);
  const leftBoxRef = useRef<any>(null);

  const { errCodeHandler } = useErrCode();

  const handleGetRankList = async() => {
    setRankListLoading(true);
    await getRankInfo()
    .then(res => {
      const data = res?.data;
      if(data.status == 10000) {
        setRankList(data.data?.rankData || []);
      }
      else {
        errCodeHandler(data.status);
      }
    })

    setRankListLoading(false);
  }

  const handleCopy = () => {
    if(referralCode) {
      let referralUrl = location.origin + '?referer=' + referralCode;
      navigator.clipboard.writeText(referralUrl)
      .then(() => {;
        toast.success(t('other.copySuccess'))
      })
      .catch((err) => {
        const textarea = document.createElement("textarea");
        textarea.value = referralUrl;
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
          document.execCommand("copy");
          toast.success(t('other.copySuccess'))
        } catch (err) {
          toast.error(t('other.copyFiled'))
        }
        
        document.body.removeChild(textarea);
      })
    }
  }

  const handleGetHistoryList = async() => {
    setShowHistoryModal(true);
    setHistoryLoading(true);
    setHistoryList([]);
    await getReferralHistory()
    .then(res => {
      const data = res?.data;
      if(data.status == 10000) {
        setHistoryList(data.data);
      }
      else {
        errCodeHandler(data.status);
      }
    })

    setHistoryLoading(false);
  }

  const handleClaimReward = async() => {
    if(claimLoading) {
      return;
    }
    setClaimLoading(true);
    await claimReward()
    .then(res => {
      const data = res?.data;
      if(data.status == 10000) {
        toast.success(t('blindbox.claimSuccess'));
        triggerMyList(Date.now())
        handleGetReferralInfo();
      }
      else {
        errCodeHandler(data.status);
      }
    })
    
    setClaimLoading(false);
  }

  const handleGetReferralInfo = async() => {
    setReferralInfoLoading(true);
    setReferralInfo(null);
    await getRefeeealInfo()
    .then(res => {
      const data = res?.data;
      if(data.status == 10000) {
        setReferralInfo(data.data);
      }
      else {
        errCodeHandler(data.status);
      }
    })
    setReferralInfoLoading(false);
  }

  const handleGetReferralCode = async() => {
    await getReferralCode()
    .then(res => {
      const data = res?.data;
      if(data.status == 10000) {
        setReferralCode(data.data?.referral_code);
      }
      else {
        errCodeHandler(data.status);
      }
    })
  }

  useEffect(() => {
    if(referralInfo && rankList.length) {
      const myRank = rankList.find((item:any) => item.guid == referralInfo.guid);
      const myRankIdx = rankList.findIndex((item:any) => item.guid == referralInfo.guid);
      if(myRank) {
        setMyRankInfo({
          ...myRank,
          rank: myRankIdx + 1,
        });
      }
      else {
        setMyRankInfo({
          guid: referralInfo?.guid,
          value: referralInfo?.validCount,
          rank: rankList.length + '+'
        });
      }
    }
  }, [referralInfo, rankList])

  useEffect(() => {
    if(userInfo) {
      handleGetReferralInfo();
      handleGetReferralCode();
    }
    else {
      setMyRankInfo(null);
    }
  }, [userInfo])

  useEffect(() => {
    handleGetRankList();
    if (!leftBoxRef.current) return;

    const updateHeight = () => {
      const height = leftBoxRef.current.offsetHeight;
      setLeftBoxHeight(height > 100 ? height - 100 : 0);
    };

    // 初始化
    updateHeight();

    // 如果左侧高度会变化，监听 resize
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <>
      <div className="mt-18 py-18 border-t-[2px] border-[#4C4081]">
        <div className="flex flex-wrap justify-between md:items-stretch md:space-x-12 2xl:space-x-15">
          <div ref={leftBoxRef} className="w-full md:w-1/2">
            <div className="text-[20px] md:text-[22px] 2xl:text-[24px] font-ethnocentric-rg text-[#FEBD32] inline-block uppercase pb-3 border-b border-[#FEBD32]">{t('blindbox.inviteBonus')}</div>
            <div className="bg-black rounded-[20px] p-6 flex flex-wrap justify-between items-center mt-6">
              {userInfo != null ? 
              referralInfoLoading ? 
              <>
              <div className="w-full md:w-auto animate-pulse">
                <div className="flex">
                  <div className="w-24 h-24 rounded-[10px] bg-gray-500 inline-block"></div>
                  <div className="w-20 h-5 rounded-[10px] bg-gray-500 inline-block ml-2"></div>
                </div>
                <div className="w-50 h-5 rounded-lg bg-gray-500 mt-2"></div>
                <div className="w-50 h-5 rounded-lg bg-gray-500 mt-2"></div>
              </div>
              <div className="w-full md:w-[180px] h-15 rounded-[10px] animate-pulse mt-6 md:mt-0 bg-gray-500"></div>
              </>
              :
              referralInfo != null &&
              <>
              <div className="w-full md:w-auto">
                <div className="flex">
                  <img className="w-24 rounded-[20px] mx-auto block" src={"/images/blindbox/" + rewardBlindbox?.img + ".jpg"} alt="" />
                  <div className="leading-none ml-3">
                    <div className="text-[#8A84A3] text-[20px]">{t('blindbox.avaiableQuantity')}</div>
                    <div className="font-univia-pro-bold text-white text-[30px] md:text-[40px] mt-2">x{referralInfo?.claimableBoxCount}</div>
                  </div>
                </div>
                <div className="text-[20px] mt-2">
                  <span className="text-[#DDD5FF]">{t('blindbox.inviteUsers')}: </span>
                  <span className="text-[#FEBD32]  t">{referralInfo?.inviteCount}</span>
                </div>
                <div className="text-[20px]">
                  <span className="text-[#DDD5FF]">{t('blindbox.validUsers')}: </span>
                  <span className="text-[#FEBD32]">{referralInfo?.validCount}</span>
                </div>
              </div>
              <div className="w-full md:w-[180px]">
                {referralInfo != null &&
                <Button onClick={referralInfo.claimableBoxCount > 0 ? () => handleClaimReward() : () => {}} disabled={referralInfo.claimableBoxCount == 0}
                  className="py-3 text-[16px] capitalize" fullWidth={true}>
                  {t('blindbox.claim')}
                  {claimLoading && <span className="w-5 h-5 border-[3px] border-white animate-spin ml-2"></span>}
                </Button>}
              </div>
              </>
              :
              <div className="w-full flex justify-center">
                <Button className="w-[180px] py-3 text-[16px]" onClick={() => triggerModalOpen()}>
                  {t('menu.login')}
                </Button>
              </div>
              }
            </div>
            <div className="text-[#8A84A3] text-[16px] md:text-[20px] mt-9 leading-[20px] md:leading-[24px]">
              <div className="">{t('blindbox.inviteContent1')}</div>
              <div className="mt-5">{t('blindbox.inviteContent2')}</div>
              <div className="pl-5">{t('blindbox.inviteContent2Item1')}</div>
              <div className="pl-5">{t('blindbox.inviteContent2Item2')}</div>
              <div className="mt-5">{t('blindbox.inviteContent3')}</div>
              <div className="mt-5">{t('blindbox.inviteContent4')}</div>
            </div>
          </div>
          <div className="w-full md:w-auto md:flex-1 mt-12 md:mt-0">
            <div className="w-full text-[20px] md:text-[22px] 2xl:text-[24px] font-ethnocentric-rg text-[#FEBD32] text-center uppercase pb-3 border-b border-[#FEBD32]">{t('blindbox.invitationRank')}</div>
            <div className="w-full bg-black flex items-center p-3 text-[#8A84A3] capitalize">
              <div className="w-[50px] text-center">{t('blindbox.rank')}</div>
              <div className="w-1/2 text-center">{t('blindbox.user')}</div>
              <div className="flex-1 text-center">{t('blindbox.validUsers')}</div>
            </div>
            <div className="rank-list overflow-auto max-h-[400px] pb-12 relative" style={{maxHeight: leftBoxHeight + 'px'}}>
            { rankListLoading ?
              Array.from({ length: 5 }).map((_, index) => (
                <div className="bg-gray-500 animate-pulse h-6 rounded-[10px] mt-3" key={index}></div>
              ))
              :
              rankList.map((item, index) => (
                <div className={"flex items-center px-3 py-1 border-b border-[#4C4081] " + (index < 3 ? 'text-[#FF6C8F]' : 'text-[#DDD5FF]')} 
                  key={index}>
                  <div className="w-[50px] text-center text-[24px] md:text-[30px]">{index + 1}</div>
                  <div className="w-1/2 text-center text-[16px] md:text-[20px] truncate">{item?.guid ? String(item.guid)?.substring(0, 4) + '...' + String(item.guid)?.substring(String(item.guid)?.length - 4, String(item.guid)?.length) : '' }</div>
                  <div className="flex-1 text-center text-[16px] md:text-[20px]">{item.value}</div>
                </div>
              ))
            }
            {myRankInfo != null &&
              <div className="absolute w-full bg-black py-1 px-3 left-0 bottom-0">
                <div className="flex items-center text-[#8D73FF]">
                  <div className="w-[50px] text-center text-[24px] md:text-[30px]">{myRankInfo?.rank}</div>
                  <div className="w-1/2 text-center text-[16px] md:text-[20px] truncate">{myRankInfo?.guid ? String(myRankInfo.guid)?.substring(0, 4) + '...' + String(myRankInfo.guid)?.substring(String(myRankInfo.guid)?.length - 4, String(myRankInfo.guid)?.length) : '' }</div>
                  <div className="flex-1 text-center text-[16px] md:text-[20px]">{myRankInfo.value}</div>
                </div>
              </div>
            }
            </div>
          </div>
        </div>
        <div className="mt-18 flex flex-wrap items-center justify-center">
          {userInfo != null ?
          <>
          <div className="w-full md:w-[260px]">
            <Button className="py-3 text-[18px] md:text-[20px] capitalize" fullWidth={true} onClick={handleCopy}>
              {t('blindbox.copyInvitationLink')}
            </Button>
          </div>
          <div className="w-full md:w-[260px] md:ml-15 mt-12 md:mt-0">
            <Button className="py-3 text-[18px] md:text-[20px] capitalize" fullWidth={true} onClick={handleGetHistoryList}>
              {t('blindbox.invitationHistory')}
            </Button>
          </div>
          </>
          :
          <div className="w-full md:w-[260px]">
            <Button className="py-3 text-[18px] md:text-[20px] capitalize" fullWidth={true} onClick={() => triggerModalOpen()}>
              {t('menu.login')}
            </Button>
          </div>
          }
        </div>
      </div>
      <Modal 
        isOpen={showHistoryModal}
        ariaHideApp={false}
        onRequestClose={() => setShowHistoryModal(false)}
        preventScroll={false}
        htmlOpenClassName="overflow-hidden"
        className="w-9/10! xl:w-[1000px]! 2xl:w-[1200px]!"
      >
        <div className="w-full bg-[#101014] rounded-[20px] overflow-hidden">
          <div className="p-6 relative bg-[#201e2a]">
            <div className="text-[20px] md:text-[24px] font-ethnocentric-rg text-[#FEBD32] text-center uppercase">{t('blindbox.invitationHistory')}</div>
            <button className="cursor-pointer hover:opacity-80 absolute top-1/2 right-6 -translate-y-1/2" onClick={() => setShowHistoryModal(false)}>
              <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="30" height="30"><path d="M431.559111 512L149.959111 230.4a56.888889 56.888889 0 0 1 80.440889-80.440889L512 431.559111l281.6-281.6a56.888889 56.888889 0 0 1 80.440889 80.440889L592.440889 512l281.6 281.6a56.888889 56.888889 0 1 1-80.440889 80.440889L512 592.440889 230.4 874.040889a56.888889 56.888889 0 1 1-80.440889-80.440889L431.559111 512z" fill="#ffffff"></path></svg>
            </button>
          </div>
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="w-full">
              <div className="flex text-center text-[#8A84A3] text-[14px] md:text-[20px] py-2 border-b-[2px] border-[#211c33] capitalize">
                <div className="w-1/4 px-1">{t('blindbox.userName')}</div>
                <div className="w-1/4 px-1">{t('blindbox.type')}</div>
                <div className="w-1/4 px-1">{t('blindbox.drawTime')}</div>
                <div className="w-1/4 px-1">{t('blindbox.bonus')}</div>
              </div>
              {historyLoading ? 
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="py-2 border-b-[2px] border-[#211c33]">
                    <div className="bg-gray-500 animate-pulse rounded-lg h-6"></div>
                  </div>
                ))
                :
                <>
                {historyList.length == 0 ?
                  <div className="py-16 text-center">
                    <svg className="mx-auto" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="48" height="48"><path d="M855.6 427.2H168.5c-12.7 0-24.4 6.9-30.6 18L4.4 684.7C1.5 689.9 0 695.8 0 701.8v287.1c0 19.4 15.7 35.1 35.1 35.1H989c19.4 0 35.1-15.7 35.1-35.1V701.8c0-6-1.5-11.8-4.4-17.1L886.2 445.2c-6.2-11.1-17.9-18-30.6-18zM673.4 695.6c-16.5 0-30.8 11.5-34.3 27.7-12.7 58.5-64.8 102.3-127.2 102.3s-114.5-43.8-127.2-102.3c-3.5-16.1-17.8-27.7-34.3-27.7H119c-26.4 0-43.3-28-31.1-51.4l81.7-155.8c6.1-11.6 18-18.8 31.1-18.8h622.4c13 0 25 7.2 31.1 18.8l81.7 155.8c12.2 23.4-4.7 51.4-31.1 51.4H673.4zM819.9 209.5c-1-1.8-2.1-3.7-3.2-5.5-9.8-16.6-31.1-22.2-47.8-12.6L648.5 261c-17 9.8-22.7 31.6-12.6 48.4 0.9 1.4 1.7 2.9 2.5 4.4 9.5 17 31.2 22.8 48 13L807 257.3c16.7-9.7 22.4-31 12.9-47.8zM375.4 261.1L255 191.6c-16.7-9.6-38-4-47.8 12.6-1.1 1.8-2.1 3.6-3.2 5.5-9.5 16.8-3.8 38.1 12.9 47.8L337.3 327c16.9 9.7 38.6 4 48-13.1 0.8-1.5 1.7-2.9 2.5-4.4 10.2-16.8 4.5-38.6-12.4-48.4zM512 239.3h2.5c19.5 0.3 35.5-15.5 35.5-35.1v-139c0-19.3-15.6-34.9-34.8-35.1h-6.4C489.6 30.3 474 46 474 65.2v139c0 19.5 15.9 35.4 35.5 35.1h2.5z" fill="#757895"></path></svg>
                  </div>
                  :
                  historyList.map((item, index) => (
                    <div key={index} className="flex items-center text-[#8A84A3] text-[18px] md:text-[20px] py-1 border-b-[2px] border-[#211c33]">
                      <div className="w-1/4 text-[#DDD5FF] px-1 text-center">{item?.account.length > 0 && item.account?.substring(0, 4) + '...' + item.account?.substring(item.account?.length - 4, item.account?.length) }</div>
                      <div className="w-1/4 px-2 text-[#DDD5FF] text-[10px] md:text-[20px] px-1"></div>
                      <div className="w-1/4 px-2 text-[#DDD5FF] text-[10px] md:text-[20px] px-1"></div>
                      <div className="w-1/4 px-2 text-[#DDD5FF] text-[10px] md:text-[18px] text-center px-1"></div>
                    </div>
                  ))
                }
                </>
              }
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}