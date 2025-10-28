// wagmi.ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { mainnet, bsc } from 'wagmi/chains'

export const projectId = 'e29dd843efef3adfe3d1cbda24d21e51'

// export const tgtChain:any = process.env.NEXT_PUBLIC_BUILD_ENV == 'dev' ? bscTestnet: bsc;
export const tgtChain:any = bsc;

/*
export const config = createConfig({
  chains: [tgtChain],
  transports: {
    [tgtChain.id]: http()
  },
})
*/

export const config = getDefaultConfig({
  appName: 'KapKap',
  projectId: projectId,
  chains: [bsc],
  transports: {
    [bsc.id]: http(),
  },
});

