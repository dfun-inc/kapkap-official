'use client';

import { Locale } from "@/lib/i18n";
import { useTranslations } from 'next-intl';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from "react";

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


  const menu:any[] = [
    {name: t('menu.main'), idx: 0},
    {name: t('menu.feature'), idx: 1},
    //{name: t('menu.case'), idx: 2},
    {name: t('menu.roadmap'), idx: 3},
    {name: t('menu.other'), idx: 4},
  ];
  const [activeIdx, setActiveIdx] = useState<number>(0);

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
    const sec1Rect = document.getElementsByClassName('home-section-1')[0]?.getBoundingClientRect();
    //const sec2Rect = document.getElementsByClassName('home-section-2')[0]?.getBoundingClientRect();
    const sec3Rect = document.getElementsByClassName('home-section-3')[0]?.getBoundingClientRect();
    const sec4Rect = document.getElementsByClassName('home-section-4')[0]?.getBoundingClientRect();

    if(sec4Rect?.top < screenHeight.current / 1.5) {
      setActiveIdx(4);
    }
    else if(sec3Rect?.top < screenHeight.current / 1.5) {
      setActiveIdx(3);
    }
    /*
    else if(sec2Rect?.top < screenHeight.current / 1.5){
      setActiveIdx(2);
    }
    */
    else if(sec1Rect?.top < screenHeight.current / 1.5){
      setActiveIdx(1);
    }
    else {
      setActiveIdx(0);
    }
    
    changeHeaderBg();
  };

  const changeHeaderBg = () => {
    const header = document.getElementsByTagName('header');
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const progress = Math.min(scrollY / 800, 0.8);
  
    header[0].style.backgroundColor = `rgba(0, 0, 0, ${progress * 0.8})`;
    header[0].style.backdropFilter = `blur(${progress * 10}px)`;
    (header[0].style as any).WebkitBackdropFilter = `blur(${progress * 10}px)`;
  }

  const handleResize = () => {
    const _width = window.innerWidth || document.documentElement.clientWidth;
    const _height = window.innerHeight || document.documentElement.clientHeight;

    screenWidth.current = _width;
    screenHeight.current = _height;
    handleScroll();
  }

  useEffect(() => {
    handleScroll();
    handleResize();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.addEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-[10]">
      <div className="mx-auto max-w-[1920px] flex justify-between items-center px-6 md:px-12 py-3 md:py-6">
        {pathname == '/' ?
        <>
          <img className="w-[120px] md:w-[182px]" src="/images/logo.png" />
          <div className="flex items-center">
            <menu className="hidden lg:flex">
              {menu.map((item, i:number) => (
                <div key={i} onClick={() => handleClick(item.idx)} className={'text-xl mr-8 cursor-pointer ' + (activeIdx == item.idx ? ' active-menu text-[#8D73FF]' : ' text-white hover:text-[#8D73FF]')}>
                  <span className="text-xl">{item.name}</span>
                </div>
              ))}
            </menu>
            {/*
            <div className="relative ml-3" onMouseOver={() => setDropdown(true)} onMouseOut={() => setDropdown(false)}>
              <button className="btn-common block p-1 h-8 md:h-9 flex items-center justify-center bg-white/10 rounded-[10px]">
                <div className="w-5 md:w-6 ml-1 md:ml-2 mr-[7px] flex items-center justify-between text-sm md:text-base">
                  {props.locale == 'en' ?
                  (
                    <>
                      <span className="font-light">EN</span>
                    </>
                  ) : (
                    <>
                      <span className="font-light">CN</span>
                    </>
                  )}
                </div>
                <span className="bg-[#6E4DFF]/50 w-5 md:w-6 h-5 md:h-6 rounded-[8px] flex items-center justify-center">
                  <svg className={"scale-[0.9] md:scale-none mt-[1px] md:mt-[3px] origin-center duration-200 " + (dropdown ? "rotate-180" : "")} width="11" height="7" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M5.88212 7.14717L0.225124 1.49017L1.63912 0.0761714L6.58912 5.02617L11.5391 0.0761718L12.9531 1.49017L7.29612 7.14717C7.1086 7.33464 6.85429 7.43996 6.58912 7.43996C6.32396 7.43996 6.06965 7.33464 5.88212 7.14717Z" fill="#ffffff"/>
                  </svg>
                </span>
              </button>
              <div className={"absolute left-0 top-9 w-full py-1 shadow-lg bg-white/10 rounded-[10px] " + (dropdown ? 'block' : "hidden")}>
                <button className="w-full px-3 py-2 text-center hover:bg-white/10 flex items-center" onClick={() => handleChangeLand('en')}>
                  <span className="text-sm md:text-base font-medium mr-2">EN</span>
                </button>
                <button className="w-full px-3 py-2 text-center hover:bg-white/10 flex items-center" onClick={() => handleChangeLand('zh')}>
                  <span className="text-sm md:text-base font-medium mr-2">CN</span>
                </button>
              </div>
            </div>
            */}
          </div>
        </>
        :
        <Link className="" href="/">
          <img className="w-[120px] md:w-[182px]" src="/images/logo.png" />
        </Link>
        }
      </div>
    </header>
  );
}
