'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface AppContextType {
  triggerModalOpen: () => void
  modalTrigger: number,
  userInfo: any,
  handleSetUserInfo: (info: any) => void,
  userInfoLoading: boolean,
  handleSetUserInfoLoading: (loading: boolean) => void,
  configData: any,
  handleSetConfigData: (data: any) => void,
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [modalTrigger, setModerTrigger] = useState(0);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [userInfoLoading, setUserInfoLoading] = useState<boolean>(false);
  const [configData, setConfigData] = useState<any>(null);

  const triggerModalOpen = () => {
    setModerTrigger(prev => prev + 1);
  }

  const handleSetUserInfo = (info: any) => {
    setUserInfo(info);
  }

  const handleSetUserInfoLoading = (loading: boolean) => {
    setUserInfoLoading(loading);
  }

  const handleSetConfigData = (data: any) => {
    setConfigData(data);
  }

  return (
    <AppContext.Provider
      value={{
        modalTrigger,
        triggerModalOpen,
        userInfo,
        handleSetUserInfo,
        userInfoLoading,
        handleSetUserInfoLoading,
        configData,
        handleSetConfigData,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
