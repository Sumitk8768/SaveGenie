import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [autoOptimize, setAutoOptimize] = useLocalStorage('savegenie-auto-optimize', true)
  const [notifyDeals, setNotifyDeals] = useLocalStorage('savegenie-notify-deals', true)

  return (
    <AppContext.Provider value={{ autoOptimize, setAutoOptimize, notifyDeals, setNotifyDeals }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used inside AppProvider')
  }
  return context
}