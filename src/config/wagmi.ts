// wagmi.ts
import { connectorsForWallets, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { createConfig, http } from 'wagmi';
import { bsc, bscTestnet, opBNB, opBNBTestnet } from 'wagmi/chains'
import {
  okxWallet,
  binanceWallet,
  metaMaskWallet,
  walletConnectWallet
} from '@rainbow-me/rainbowkit/wallets';

export const projectId = 'e29dd843efef3adfe3d1cbda24d21e51'

// export const tgtChain:any = process.env.NEXT_PUBLIC_BUILD_ENV == 'dev' ? bscTestnet: bsc;
export const tgtChain:any = process.env.NEXT_PUBLIC_BUILD_ENV == 'dev' ? opBNBTestnet: opBNB;
export const tgtBscChain:any = process.env.NEXT_PUBLIC_BUILD_ENV == 'dev' ? bscTestnet: bsc;

const connectors = connectorsForWallets([
  {
    groupName: 'Recommend',
    wallets: [
      binanceWallet,
      okxWallet,
      metaMaskWallet,
      walletConnectWallet
    ],
  },
  ],
  {
    appName: 'KapKap',
    projectId: projectId,
  }
);

/*
export const config = createConfig({
  chains: [tgtChain],
  transports: {
    [tgtChain.id]: http()
  },
})
*/

export const config = createConfig({
  connectors,
  chains: [tgtChain],
  transports: {
    [tgtChain?.id]: http(),
  },
});

export const bscWagmiConfig = createConfig({
  connectors,
  chains: [tgtBscChain],
  transports: {
    [tgtBscChain?.id]: http(),
  },
});
