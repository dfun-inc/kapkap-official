'use client';

import Bottom from '@/components/Home/bottom';
import Case from '@/components/Home/case';
import Future from '@/components/Home/future';
import Main from '@/components/Home/main';
import Other from '@/components/Home/other';
import Roadmap from '@/components/Home/roadmap';

export default function Home() {

  return (
    <main className="">
      <Main />
      <Future />
      <Case />
      <Roadmap />
      <Other />
      <Bottom />
    </main>
  );
}
