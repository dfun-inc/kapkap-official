'use client';

import Bottom from '@/components/Home/bottom';
import Ecosystem from '@/components/Home/ecosystem';
import Feature from '@/components/Home/feature';
import Main from '@/components/Home/main';
import Other from '@/components/Home/other';
import Roadmap from '@/components/Home/roadmap';

export default function Home() {

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
