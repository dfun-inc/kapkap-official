'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface AppContextType {
  triggerModalOpen: () => void
  modalTrigger: number
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [modalTrigger, setModerTrigger] = useState(0);

  const triggerModalOpen = () => {
    setModerTrigger(prev => prev + 1);
  }

  return (
    <AppContext.Provider
      value={{
        modalTrigger,
        triggerModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
