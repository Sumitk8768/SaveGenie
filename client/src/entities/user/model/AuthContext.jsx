import { createContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem('savegenie-authenticated') === 'true')

  const value = useMemo(() => ({
    isAuthenticated,
    signIn: () => {
      sessionStorage.setItem('savegenie-authenticated', 'true')
      setIsAuthenticated(true)
    },
    signOut: () => {
      sessionStorage.removeItem('savegenie-authenticated')
      setIsAuthenticated(false)
    },
  }), [isAuthenticated])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext }
