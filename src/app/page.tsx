'use client';

import Bottom from '@/components/Home/bottom';
import Ecosystem from '@/components/Home/ecosystem';
import Feature from '@/components/Home/feature';
import Main from '@/components/Home/main';
import Other from '@/components/Home/other';
import Roadmap from '@/components/Home/roadmap';
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
      <Roadmap />
      <Other />
      <Bottom />
    </main>
  );
}
