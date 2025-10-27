'use client';

import { Locale } from "@/lib/i18n";
import { getConfig } from "@/services/apis/config";
import { useTranslations } from 'next-intl';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import ConnectBtn from "@/components/ConnectBtn";
import { getAppList } from "@/services/apis/app";
import { toast } from "react-toastify";

type Props = {
  locale: Locale;
  handleChangeLang: (lang: Locale) => void;
};

export default function Header(props:Props) {
  const t = useTranslations();
  const [dropdown, setDropdown] = useState(false);
  const screenWidth = useRef<number>(0);
  const screenHeight = useRef<number>(0);
  const pathname = usePathname();
  const [showHeader, setShowHeader] = useState(false);

  const [activeIdx, setActiveIdx] = useState<number>(0);

  const { handleSetConfigData, handleSetAppData } = useAppContext();

  const handleChangeLand = (lang:Locale) => {
    setDropdown(false);
    props.handleChangeLang(lang);
  }

  const handleClick = (idx: number) => {
    setActiveIdx(idx);
    const elmnt = document.getElementById('home-section-' + idx);
    const elementPosition = elmnt?.getBoundingClientRect().top
    const offsetPosition = elementPosition! + window.pageYOffset - 100
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  };

  const handleScroll = () => {
    // const sec1Rect = document.getElementsByClassName('home-section-1')[0]?.getBoundingClientRect();
    // const sec2Rect = document.getElementsByClassName('home-section-2')[0]?.getBoundingClientRect();
    const sec3Rect = document.getElementsByClassName('home-section-3')[0]?.getBoundingClientRect();
    // const sec4Rect = document.getElementsByClassName('home-section-4')[0]?.getBoundingClientRect();

    if(sec3Rect?.top < screenHeight.current / 1.5) {
      setActiveIdx(3);
    }
    /*
    else if(sec2Rect?.top < screenHeight.current / 1.5){
      setActiveIdx(2);
    }
    */
    else {
      setActiveIdx(0);
    }
    
    changeHeaderBg();
  };

  const changeHeaderBg = () => {
    const header = document.getElementsByTagName('header');
    if (screenWidth.current < 768) {
      header[0].style.backgroundColor = `rgba(0, 0, 0, 0)`;
    }
    else {
      if(pathname == '/') {
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const progress = Math.min(scrollY / 800, 0.8);
      
        header[0].style.backgroundColor = `rgba(0, 0, 0, ${progress * 0.8})`;
        header[0].style.backdropFilter = `blur(${progress * 10}px)`;
        (header[0].style as any).WebkitBackdropFilter = `blur(${progress * 10}px)`;
      }
      else {
        header[0].style.backgroundColor = `rgba(0, 0, 0, 0.2)`;
        header[0].style.backdropFilter = `blur(10px)`;
        (header[0].style as any).WebkitBackdropFilter = `blur(10px)`;
      }
    }
  }

  const handleResize = () => {
    const _width = window.innerWidth || document.documentElement.clientWidth;
    const _height = window.innerHeight || document.documentElement.clientHeight;

    screenWidth.current = _width;
    screenHeight.current = _height;
    handleScroll();

    if (screenWidth.current >= 768) {
      setDropdown(false);
      setShowHeader(true);
    }
    else {
      setShowHeader(false);
    }
  }

  const handleGetConfig = async () => {
    await getConfig()
    .then((res) => {
      const data = res?.data;
      if(data?.status == 10000) {
        handleSetConfigData(data?.data);
      }
      else {
        handleSetConfigData({ cdn: "https://cdn.kapkap.io/ile/" });
      }
    })
    .catch(() => {
      handleSetConfigData({ cdn: "https://cdn.kapkap.io/ile/" });
    })
  }

  const handleGetAppData = async () => {
    await getAppList()
    .then((res) => {
      const data = res?.data;
      if(data?.status == 10000) {
        handleSetAppData(data?.data);
      }
      else {
        toast(t('common.getFailed') + ": " + data.status);
        handleSetAppData(null);
      }
    })
    .catch(() => {
      handleSetAppData({});
    })
  }

  useEffect(() => {
    handleScroll();
    handleResize();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    handleGetConfig();
    handleGetAppData();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleResize);
    };
  }, [pathname]);

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-[10]">
      <div className={"flex justify-between items-center py-3 px-3 md:hidden " + (showHeader ? 'w-16 absolute z-[3] top-0 right-0' : 'w-full')}>
        <img className={"w-40 " + (showHeader ? 'hidden' : 'block')} src="/images/logo.png" alt="logo" />
        <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#6E4DFF]" onClick={() => setShowHeader(!showHeader)}>
          { showHeader ? 
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="22" height="22"><path d="M914.45248 881.11104l-344.38144-344.39168 344.52992-344.52992a52.26496 52.26496 0 0 0 14.76608-36.51584c0-28.97408-23.57248-52.54144-52.55168-52.54144-13.70624 0-26.6752 5.248-36.66432 14.91968L495.7696 462.41792 151.22944 117.888a52.25984 52.25984 0 0 0-36.51072-14.76096c-28.96896 0-52.54144 23.57248-52.54144 52.54144 0 13.70112 5.24288 26.67008 14.91456 36.67456l344.37632 344.37632-344.53504 344.54528a52.2496 52.2496 0 0 0-14.75584 36.49536c0 28.9792 23.57248 52.5568 52.54144 52.5568 13.71136 0 26.68032-5.248 36.66944-14.9248l344.37632-344.3712 344.36096 344.35072a52.03456 52.03456 0 0 0 37.17632 15.47264c14.0544 0 27.25376-5.49376 37.13536-15.44192a52.1728 52.1728 0 0 0 15.40096-37.15072c0-14.02368-5.46304-27.2128-15.3856-37.14048z" p-id="9742" fill="#ffffff"></path></svg>
            : 
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="26" height="26"><path d="M128 469.333333m40.533333 0l686.933334 0q40.533333 0 40.533333 40.533334l0 4.266666q0 40.533333-40.533333 40.533334l-686.933334 0q-40.533333 0-40.533333-40.533334l0-4.266666q0-40.533333 40.533333-40.533334Z" p-id="11280" fill="#ffffff"></path><path d="M128 682.666667m40.533333 0l686.933334 0q40.533333 0 40.533333 40.533333l0 4.266667q0 40.533333-40.533333 40.533333l-686.933334 0q-40.533333 0-40.533333-40.533333l0-4.266667q0-40.533333 40.533333-40.533333Z" p-id="11281" fill="#ffffff"></path><path d="M128 256m40.533333 0l686.933334 0q40.533333 0 40.533333 40.533333l0 4.266667q0 40.533333-40.533333 40.533333l-686.933334 0q-40.533333 0-40.533333-40.533333l0-4.266667q0-40.533333 40.533333-40.533333Z" p-id="11282" fill="#ffffff"></path></svg>
          }
        </button>
      </div>
      <div className={"w-full md:h-auto md:bg-transparent relative z-[2] overflow-hidden md:overflow-visible " + (showHeader ? 'bg-black/50 h-screen ' : '')}>
        <div className={"absolute md:relative mx-auto w-[300px] bg-[#181818] h-full md:h-auto md:bg-transpaent md:w-auto md:max-w-[1920px] flex flex-wrap justify-end md:items-center px-12 py-4 md:bg-transparent transition-all duration-300 md:duration-0 " + (showHeader ? 'left-0' : '-left-[300px] md:left-0')}>
          {/*<Link href="/"><img className="w-[182px] hidden md:block" src="/images/logo.png" alt="logo" /></Link>*/}
          <div className="w-full md:w-auto flex md:items-center flex-wrap">
            <menu className="w-full md:w-auto md:flex items-center my-20 md:my-0 ">
              <Link href="/" className='block md:inline text-xl md:mr-8 cursor-pointertext-white hover:text-[#8D73FF] mt-6 md:mt-0'>
                <span className="text-xl">{t('menu.main')}</span>
              </Link>
              {/*
                <div onClick={() => handleClick(0)} className={'block md:inline text-xl mr-8 cursor-pointer mt-6 md:mt-0 ' + (activeIdx == 0 ? ' active-menu text-[#8D73FF]' : ' text-white hover:text-[#8D73FF]')}>
                  <span className="text-xl">{t('menu.introduce')}</span>
                </div>
                <div onClick={() => handleClick(3)} className={'block md:inline text-xl mr-8 cursor-pointer mt-6 md:mt-0 ' + (activeIdx == 3 ? ' active-menu text-[#8D73FF]' : ' text-white hover:text-[#8D73FF]')}>
                  <span className="text-xl">{t('menu.roadmap')}</span>
                </div>
              </>
              */}
              <Link href="/kscore" className='block md:inline text-xl mr-8 cursor-pointertext-white hover:text-[#8D73FF] mt-6 md:mt-0'>
                  <span className="text-xl">{t('menu.kscore')}</span>
              </Link>
              <Link href="/explore" className='block md:inline text-xl mr-8 cursor-pointertext-white hover:text-[#8D73FF] mt-6 md:mt-0'>
                  <span className="text-xl">{t('menu.explore')}</span>
              </Link>
              <a href="https://kapkap.gitbook.io/about" target="_blank" className='block md:inline text-xl mr-8 cursor-pointertext-white hover:text-[#8D73FF] mt-6 md:mt-0'>
                <span className="text-xl">{t('menu.doc')}</span>
              </a>
            </menu>
            <ConnectBtn />
          </div>
        </div>
      </div>
    </header>
  );
}
