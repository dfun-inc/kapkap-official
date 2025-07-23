'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'

import Bubble from '@/components/GamePartners/Bubble'
import Wall from '@/components/GamePartners/Wall'

export default function Pool() {
  const data = [
    {imgData: '/images/game_partners/BabyDoge PAWS.jpg'},
    {imgData: '/images/game_partners/Beetz.jpg'},
    {imgData: '/images/game_partners/bitsolara.jpg'},
    {imgData: '/images/game_partners/boinkers.jpg'},
    {imgData: '/images/game_partners/Bounty Hash.jpg'},
    {imgData: '/images/game_partners/Boxing Star X.jpg'},
    {imgData: '/images/game_partners/Bums.jpg'},
    {imgData: '/images/game_partners/CapsGame.jpg'},
    {imgData: '/images/game_partners/Cattea.jpg'},
    {imgData: '/images/game_partners/cityhold.jpg'},
    {imgData: '/images/game_partners/Dogiators.jpg'},
    {imgData: '/images/game_partners/Dragonz Land.jpg'},
    {imgData: '/images/game_partners/DRFT Party.jpg'},
    {imgData: '/images/game_partners/Dropster.jpg'},
    {imgData: '/images/game_partners/duck.jpg'},
    {imgData: '/images/game_partners/Duckygram.jpg'},
    {imgData: '/images/game_partners/Fight Me.jpg'},
    {imgData: '/images/game_partners/fomo_hash.jpg'},
    {imgData: '/images/game_partners/GILF.jpg'},
    {imgData: '/images/game_partners/Gold Striker.jpg'},
    {imgData: '/images/game_partners/labrador.jpg'},
    {imgData: '/images/game_partners/League of Llamas.jpg'},
    {imgData: '/images/game_partners/LuckyGo.jpg'},
    {imgData: '/images/game_partners/Majestic.jpg'},
    {imgData: '/images/game_partners/Major.jpg'},
    {imgData: '/images/game_partners/Memgift.jpg'},
    {imgData: '/images/game_partners/MemHustle.jpg'},
    {imgData: '/images/game_partners/Mine XRP.jpg'},
    {imgData: '/images/game_partners/Nuts Farm.jpg'},
    {imgData: '/images/game_partners/PandaFiT.jpg'},
    {imgData: '/images/game_partners/Planet X.jpg'},
    {imgData: '/images/game_partners/pokergram.jpg'},
    {imgData: '/images/game_partners/Prison.jpg'},
    {imgData: '/images/game_partners/Puparty.jpg'},
    {imgData: '/images/game_partners/Rich Dog.jpg'},
    {imgData: '/images/game_partners/Spin the Bottle.jpg'},
    {imgData: '/images/game_partners/Squad Game.jpg'},
    {imgData: '/images/game_partners/TAPX.jpg'},
    {imgData: '/images/game_partners/TON Kombat.jpg'},
    {imgData: '/images/game_partners/TonDating.jpg'},
    {imgData: '/images/game_partners/Trumps Empire.jpg'},
    {imgData: '/images/game_partners/TTHero.jpg'},
    {imgData: '/images/game_partners/Uni Jump.jpg'},
    {imgData: '/images/game_partners/VIRUS.jpg'},
    {imgData: '/images/game_partners/VOXEL.jpg'},
    {imgData: '/images/game_partners/Your Waifu.jpg'},
    {imgData: '/images/game_partners/ZarGates.jpg'},
  ];
  const [finishLoadAll, setFinishLoadAll] = useState(false);
  const completeNum = useRef(0);
  const [allowLoading, setAllowLoading] = useState(false);

  const handleAddCompleteNum = () => {
    completeNum.current += 1;
    if(completeNum.current >= data.length) {
      console.log(completeNum.current)
      setFinishLoadAll(_l => true);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setAllowLoading(true)
    }, 2000);
  }, [])

  return (
    <div className="relative w-full h-[800px] md:h-[600px] lg:h-[500px] xl:h-[400px] 2xl:h-[300px]">
      {allowLoading ?
      <Canvas id="main-canvas" orthographic camera={{ position: [0, 0, 200], zoom: 10 }}>
        <Physics /*debug*/ interpolate={false} timeStep={1 / 30} gravity={[0, 0, 0]}>
          <Wall />
          {data.length != 0 && (
            <>
            {data.map((partner, i) => (
              <Bubble key={i} {...partner} index={i} amount={data.length} finishLoadAll={finishLoadAll} addCompleteNum={handleAddCompleteNum} />
            ))}
            </>
          )}
        </Physics>
      </Canvas>
      :
      <div className="h-full w-full flex items-center justify-center">
        <span className="animate-spin w-12 h-12 border-[8px]"></span>
      </div>
      }
    </div>
  );
}