'use client';

import { useTranslations } from 'next-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';

import 'swiper/css';
import { useEffect, useRef, useState } from 'react';
import Footer from '@/components/Footer';
import { getAppList } from '@/services/apis/app';
import { toast } from 'react-toastify';
import { useAppContext } from '@/context/AppContext';

export default function Explore() {
  const t = useTranslations();
  const [appList, setAppList] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { configData } = useAppContext();

  const [pageLimit, setPageLimit] = useState(6);

  const liveSwiperRef = useRef<any>(null);
  const [livePage, setLivePage] = useState(0);
  const upcomingSwiperRef = useRef<any>(null);
  const [upcomingPage, setUpcomingPage] = useState(0);

  const handleResize = () => {
    const windowWidth = window.innerWidth;
    if (windowWidth > 1024) {
      setPageLimit(6);
    } else if (windowWidth > 768) {
      setPageLimit(4);
    } else {
      setPageLimit(2);
    }

    if(!loading) {
      setLivePage(0);
      liveSwiperRef.current?.slideTo(0, 500);

      setUpcomingPage(0);
      upcomingSwiperRef.current?.slideTo(0, 500);
    }
  }

  const handlePrev = (type = "upcoming") => {
    if(type == "live") {
      const prevPage = livePage > 0  ? livePage - 1 : 0;
      liveSwiperRef.current?.slideTo(prevPage, 500);
      setLivePage(prevPage);
    }
    else if(type == "upcoming") {
      const prevPage = upcomingPage > 0  ? upcomingPage - 1 : 0;
      upcomingSwiperRef.current?.slideTo(prevPage, 500);
      setUpcomingPage(prevPage);
    }
  }

  const handleNext = (type = "upcoming") => {
    if(type == "live") {
      const nextPage = (livePage + 1) < Math.ceil(appList['live'].length/pageLimit) ? livePage + 1 : Math.floor(appList['live'].length/pageLimit) - 1;
      liveSwiperRef.current?.slideTo(nextPage, 500);
      setLivePage(nextPage);
    }
    else if(type == "upcoming") {
      const nextPage = (upcomingPage + 1) < Math.ceil(appList['upcoming'].length/pageLimit) ? upcomingPage + 1 : Math.floor(appList['upcoming'].length/pageLimit) - 1;
      upcomingSwiperRef.current?.slideTo(nextPage, 500);
      setUpcomingPage(nextPage);
    }
  }

  const handleGetAppList = async () => {
    setLoading(true);
    await getAppList()
    .then((res) => {
      const data = res?.data;
      if(data?.status == 10000) {
        let temp:any = {
          'upcoming': [],
          'live': []
        };
        for (const key in data?.data) {
          if(data.data[key].process == 'upcomming') {
            temp['upcoming'].push({
              id: key,
              tagArr: data.data[key].tag.split(' '),
              ...data.data[key],
            })
          }
          else if(data.data[key].process == 'launch' || data.data[key].process == 'pre-launch') {
            temp['live'].push({
              id: key,
              tagArr: data.data[key].tag.split(' '),
              ...data.data[key],
            })
          }
        }
        setAppList({
          'upcoming': temp['upcomming'],
          'live': temp['live']
        });
      }
      else {
        toast(t('common.getFailed') + ": " + data.status);
      }
    })
    setLoading(false);
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    handleResize();

    handleGetAppList();

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, [])

  return (
    <main className="min-h-screen bg-[#121212]">
      <div className="max-w-[1920px] mx-auto relative">
        <Link className="fixed z-[2] right-6 md:right-9 top-1/2 -mt-3 animate__animated animate__fadeInUp rounded-full bg-[#6c4dfe] p-3 transform transition duration-300 ease-in-out hover:scale-110" href="/support">
          <svg className="opacity-90" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="26" height="26"><path d="M993.405047 412.651402c0-30.081421-21.896-54.381888-49.010206-54.381888S895.691589 382.569981 895.691589 412.651402v445.951944c0 23.379607-13.557103 66.813495-32.332412 66.813495H155.831888c-18.72415 0-39.341178-43.433888-39.341178-66.813495V213.694524c0-23.430766 18.366037-67.222766 37.090187-67.222767h352.63815c27.114206 0 49.010206-13.352467 49.010205-43.229252s-21.896-54.381888-49.010205-54.381888H105.184598c-47.526598 0-86.305028 48.652093-86.305028 107.842916v758.12342c0 59.395458 38.77843 107.842916 86.305028 107.842916h801.557308c47.526598 0 86.305028-48.600935 86.305028-107.842916V419.14858a38.624953 38.624953 0 0 0 0.358113-6.497178z" p-id="11363" fill="#ffffff"></path><path d="M455.725234 439.151701H262.753944a49.010206 49.010206 0 1 1 0-97.969252H455.725234a49.010206 49.010206 0 1 1 0 97.969252zM749.735308 730.910785H261.321495a48.652093 48.652093 0 0 1 0-97.201869h488.311496a48.652093 48.652093 0 0 1 0 97.201869zM944.599477 242.241178h-292.88458a47.526598 47.526598 0 0 1 0-95.002038h292.88458a47.526598 47.526598 0 0 1 0 95.002038z" p-id="11364" fill="#ffffff"></path><path d="M798.182766 388.709047a47.526598 47.526598 0 0 1-47.526598-47.526598V48.349028a47.526598 47.526598 0 1 1 95.002038 0v292.833421a47.475439 47.475439 0 0 1-47.47544 47.526598z" fill="#ffffff"></path></svg>
        </Link>
        <div className="h-[150px] md:h-auto relative">
          <img className="w-full h-full md:h-auto object-cover" src="/images/app_top_banner.png" />
          <div className="absolute top-0 left-0 w-full h-full flex items-center px-3 lg:px-18 2xl:px-24 leading-[1.1]">
            <div className="font-ethnocentric-rg pt-10 md:pt-12 text-center md:text-left text-[18px] md:text-[42px] 2xl:text-[60px] w-full md:w-[480px] 2xl:w-[680px]">
              {t('explore.title')}
            </div>
          </div>
        </div>

        <div className="px-3 lg:px-18 2xl:px-24">
          <div className="py-12">
            <div className="pb-6">
              <div className="font-ethnocentric-rg text-white text-[22px] md:text-[36px] 2xl:text-[40px]">{t('explore.live')}</div>
              <div className="mt-4 text-[#8D73FF] text-[18px] md:text-[24px] leading-0">{t('explore.liveDesc')}</div>
            </div>
            {loading ? 
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex justify-between flex-wrap gap-8 mt-8">
                  {Array.from({ length: pageLimit / 2 }).map((_, j) => (
                    <div key={j} className="flex-1 rounded-[20px] overflow-hidden h-[320px] animate-pulse bg-gray-500/50"></div>
                  ))}
                </div>
              ))
              : 
              <>
              { appList != null && appList['live']?.length && (
              <>
              <Swiper
                className="live-swiper explore-swiper !h-auto"
                onSwiper={(swiper) => (liveSwiperRef.current = swiper)}
              >
                {Array.from({ length: Math.ceil(appList['live'].length / pageLimit) }).map((_, i) => (
                  <SwiperSlide key={i} className="!h-auto">
                      {Array.from({ length: 2 }).map((_, j) => (
                        <div key={j} className="grid gap-8 mt-8 md:grid-cols-2 xl:grid-cols-3">
                          {Array.from({ length: pageLimit / 2 }).map((_, k) => (
                            appList['live'][i * pageLimit + j * pageLimit / 2 + k] != undefined && 
                            <Link href={'/product?id=' + appList['live'][i * pageLimit + j * pageLimit / 2 + k]?.id} key={k} className="group block flex-1 rounded-[20px] overflow-hidden bg-black hover:bg-[#201e2a] cursor-pointer">
                              <div className="aspect-[7/4] w-full relative overflow-hidden">
                                {configData != null && <img className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110" src={configData.cdn + appList['live'][i * pageLimit + j * pageLimit / 2 + k]?.banner} />}
                                <div className="absolute top-3 left-2 rounded-full bg-black/70 text-right pl-14 pr-3 pt-[10px] pb-[6px]">
                                  <span className="text-white text-[18px] md:text-[20px] leading-[16px] md:leading-[18px]">%</span>
                                </div>
                                <div className="absolute left-0 bottom-0 flex items-end w-full">
                                  <div className="w-[15px] bg-black/70 h-[50px]"></div>
                                  <div className="p-[5px] pb-[9px] rounded-t-[20px] bg-black/70 ">
                                    {configData != null && <img className="w-[70px]" src={configData.cdn + appList['live'][i * pageLimit + j * pageLimit / 2 + k]?.icon} />}
                                  </div>
                                  <div className="flex-1 h-[50px] bg-black/70">
                                    <div className="text-white text-[24px] 2xl:text-[30px] leading-[1.1] pl-4 pt-4 2xl:pt-2">
                                      { appList['live'][i * pageLimit + j * pageLimit / 2 + k]?.name}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="px-[20px] py-[10px]">
                                <div className="flex flex-wrap">
                                  { appList['live'][i * pageLimit + j * pageLimit / 2 + k]?.tagArr.map((tagItem: any, tagIdx: number) => (
                                    <div key={tagIdx} className={'text-white mr-2 text-[14px] xl:text-[18px] px-[16px] py-[6px] rounded-[10px] ' + tagIdx % 2 ? "bg-[#452C7A]" : "bg-[#6D4F0E]"}>{tagItem.name}</div>
                                  ))}
                                </div>
                                <div className="mt-[10px] text-[#A6A6A6] " dangerouslySetInnerHTML={{__html:  appList['live'][i * pageLimit + j * pageLimit / 2 + k]?.desc}}></div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ))}
                  </SwiperSlide>
                ))}
              </Swiper>   
              <div className="w-[300px] md:w-[400px] mx-auto rounded-full bg-black flex items-center mt-8">
                <button className="rounded-full w-20 text-center bg-[#6c4dfe] py-2 text-center cursor-pointer hover:opacity-90" onClick={() => handlePrev('live')}>
                  <svg className="mx-auto" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M358.997 512l311.168-311.168a42.667 42.667 0 1 0-60.33-60.33L268.5 481.834a42.667 42.667 0 0 0 0 60.33L609.835 883.5a42.667 42.667 0 0 0 60.33-60.331L358.997 512z" fill="#ffffff"></path></svg>
                </button>
                <div className="flex-1 text-center text-[18px]">{livePage + 1}/{Math.ceil(appList['live'].length / pageLimit)}</div>
                <button className="rounded-full w-20 text-center bg-[#6c4dfe] py-2 text-center cursor-pointer hover:opacity-90" onClick={() => handleNext('live')}>
                  <svg className="mx-auto" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M665.003 512L353.835 200.832a42.667 42.667 0 0 1 60.33-60.33L755.5 481.834a42.667 42.667 0 0 1 0 60.33L414.165 883.5a42.667 42.667 0 1 1-60.33-60.331L665.003 512z" p-id="3110" fill="#ffffff"></path></svg>
                </button>
              </div>
              </>
              )}
              </>
            }
          </div>
          
          <div className="py-12">
            <div className="pb-6">
              <div className="font-ethnocentric-rg text-white text-[22px] md:text-[36px] 2xl:text-[40px]">{t('explore.upcoming')}</div>
              <div className="mt-4 text-[#8D73FF] text-[18px] md:text-[24px] leading-0">{t('explore.upcomingDesc')}</div>
            </div>
            {loading ? 
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex justify-between flex-wrap gap-8 mt-8">
                  {Array.from({ length: pageLimit / 2 }).map((_, j) => (
                    <div key={j} className="flex-1 rounded-[20px] overflow-hidden h-[320px] animate-pulse bg-gray-500/50"></div>
                  ))}
                </div>
              ))
             : 
              <>
              { appList != null && appList['upcoming']?.length && (
              <>
              <Swiper
                className="live-swiper explore-swiper !h-auto"
                onSwiper={(swiper) => (liveSwiperRef.current = swiper)}
              >
                {Array.from({ length: Math.ceil(appList['upcoming'].length / pageLimit) }).map((_, i) => (
                  <SwiperSlide key={i} className="!h-auto">
                      {Array.from({ length: 2 }).map((_, j) => (
                        <div key={j} className="grid gap-8 mt-8 md:grid-cols-2 xl:grid-cols-3">
                          {Array.from({ length: pageLimit / 2 }).map((_, k) => (
                            appList['upcoming'][i * pageLimit + j * pageLimit / 2 + k] != undefined && 
                            <Link href={'/product?id=' + appList['upcoming'][i * pageLimit + j * pageLimit / 2 + k]?.id} key={k} className="group block flex-1 rounded-[20px] overflow-hidden bg-black hover:bg-[#201e2a] cursor-pointer">
                              <div className="aspect-[7/4] w-full relative overflow-hidden">
                                {configData != null && <img className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110" src={configData.cdn + appList['upcoming'][i * pageLimit + j * pageLimit / 2 + k]?.banner} />}
                                <div className="absolute top-3 left-2 rounded-full bg-black/70 text-right pl-14 pr-3 pt-[10px] pb-[6px]">
                                  <span className="text-white text-[18px] md:text-[20px] leading-[16px] md:leading-[18px]">%</span>
                                </div>
                                <div className="absolute left-0 bottom-0 flex items-end w-full">
                                  <div className="w-[15px] bg-black/70 h-[50px]"></div>
                                  <div className="p-[5px] pb-[9px] rounded-t-[20px] bg-black/70 ">
                                    {configData != null && <img className="w-[70px]" src={configData.cdn + appList['upcoming'][i * pageLimit + j * pageLimit / 2 + k]?.icon} />}
                                  </div>
                                  <div className="flex-1 h-[50px] bg-black/70">
                                    <div className="text-white text-[24px] 2xl:text-[30px] leading-[1.1] pl-4 pt-4 2xl:pt-2">
                                      { appList['upcoming'][i * pageLimit + j * pageLimit / 2 + k]?.name}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="px-[20px] py-[10px]">
                                <div className="flex flex-wrap">
                                  { appList['upcoming'][i * pageLimit + j * pageLimit / 2 + k]?.tagArr.map((tagItem: any, tagIdx: number) => (
                                    <div key={tagIdx} className={'text-white mr-2 text-[14px] xl:text-[18px] px-[16px] py-[6px] rounded-[10px] ' + tagIdx % 2 ? "bg-[#452C7A]" : "bg-[#6D4F0E]"}>{tagItem.name}</div>
                                  ))}
                                </div>
                                <div className="mt-[10px] text-[#A6A6A6] " dangerouslySetInnerHTML={{__html:  appList['upcoming'][i * pageLimit + j * pageLimit / 2 + k]?.desc}}></div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ))}
                  </SwiperSlide>
                ))}
              </Swiper>   
              <div className="w-[300px] md:w-[400px] mx-auto rounded-full bg-black flex items-center mt-8">
                <button className="rounded-full w-20 text-center bg-[#6c4dfe] py-2 text-center cursor-pointer hover:opacity-90" onClick={() => handlePrev('upcoming')}>
                  <svg className="mx-auto" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M358.997 512l311.168-311.168a42.667 42.667 0 1 0-60.33-60.33L268.5 481.834a42.667 42.667 0 0 0 0 60.33L609.835 883.5a42.667 42.667 0 0 0 60.33-60.331L358.997 512z" fill="#ffffff"></path></svg>
                </button>
                <div className="flex-1 text-center text-[18px]">{livePage + 1}/{Math.ceil(appList['upcoming'].length / pageLimit)}</div>
                <button className="rounded-full w-20 text-center bg-[#6c4dfe] py-2 text-center cursor-pointer hover:opacity-90" onClick={() => handleNext('upcoming')}>
                  <svg className="mx-auto" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M665.003 512L353.835 200.832a42.667 42.667 0 0 1 60.33-60.33L755.5 481.834a42.667 42.667 0 0 1 0 60.33L414.165 883.5a42.667 42.667 0 1 1-60.33-60.331L665.003 512z" p-id="3110" fill="#ffffff"></path></svg>
                </button>
              </div>
              </>
              )}
              </>
            }
          </div>
        </div>
      </div>
      <div className="bg-[#090909] py-6">
        <div className="max-w-[1920px] mx-auto px-5 lg:px-18 2xl:px-24">
          <Footer />
        </div>
      </div>
    </main>
  );
}
