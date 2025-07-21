'use client';

import Bottom from '@/components/Home/bottom';
import Case from '@/components/Home/case';
import Feature from '@/components/Home/feature';
import Main from '@/components/Home/main';
import Other from '@/components/Home/other';
import Roadmap from '@/components/Home/roadmap';
import Support from '@/components/Support';

export default function Home() {

  return (
    <main className="">
      <Main />
      <Feature />
      <Case />
      <Roadmap />
      <Other />
      <Bottom />
      <Support />
    </main>
  );
}
