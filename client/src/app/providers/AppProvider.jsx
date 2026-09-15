import { useLocalStorage } from '../../shared/hooks/useLocalStorage.js'
import { AppContext } from './AppContext.js'


export function AppProvider({ children }) {
  const [autoOptimize, setAutoOptimize] = useLocalStorage('savegenie-auto-optimize', true)
  const [notifyDeals, setNotifyDeals] = useLocalStorage('savegenie-notify-deals', true)

  return (
    <AppContext.Provider value={{ autoOptimize, setAutoOptimize, notifyDeals, setNotifyDeals }}>
      {children}
    </AppContext.Provider>
  )
}

