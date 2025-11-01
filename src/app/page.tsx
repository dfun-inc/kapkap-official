'use client';

import Bottom from '@/components/Home/bottom';
import Core from '@/components/Home/core';
import Ecosystem from '@/components/Home/ecosystem';
import Feature from '@/components/Home/feature';
import IP from '@/components/Home/ip';
import Main from '@/components/Home/main';
import Model from '@/components/Home/model';
import Revenue from '@/components/Home/revenue';
import Roadmap from '@/components/Home/roadmap';
import SocialData from '@/components/Home/socialData';
import Summary from '@/components/Home/summary';
import { useEffect, useRef } from 'react';
import { usePathname } from "next/navigation";

import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Home() {

  const pathname = usePathname();
  const resizeTimeoutRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      // 页面卸载时清理所有触发器
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleResize = () => {
      // 清除上一个延时
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current)
      // 新延时
      resizeTimeoutRef.current = setTimeout(() => {
        ScrollTrigger.refresh()
      }, 300)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimeoutRef.current)
      resizeTimeoutRef.current = null
    }
  }, [])

  return (
    <main className="">
      <Main />
      <Feature />
      <Ecosystem />
      <Core />
      <Model />
      <Summary />
      <Revenue />
      <IP />
      <SocialData />
      <Roadmap />
      <Bottom />
    </main>
  );
}
