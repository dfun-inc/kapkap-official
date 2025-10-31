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
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
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
