'use client'

import { config } from "@/config/wagmi"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { WagmiProvider } from "wagmi"
import {
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';

const queryClient = new QueryClient()
function EvmProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact">
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default EvmProvider