'use client'

import { useEffect } from "react";

export default function Tag(props:any) {
  const color:any = {
    "game": "#452C7A",
    "p2e": "#6D4F0E",
    "defi": "#262D38",
    "ton": "#176A99",
    "bsc": "#B78E00",
    "solana": "#642192",
  }

  return (
    <>
      <div className="inline-block text-white text-[14px] xl:text-[18px] px-[14px] py-[6px] rounded-[10px] mb-[10px] capitalize" 
        style={{backgroundColor: (color[props.name?.toLowerCase()] ? color[props.name?.toLowerCase()] : props.index % 2 == 0 ? "#452C7A" : "#6D4F0E")}}>{props.name}</div>
    </>
  );
}