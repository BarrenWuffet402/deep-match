import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export interface AuthUser {
  id: string
  email: string
  name?: string
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  showAuthModal: boolean
  authModalMode: 'signin' | 'signup'
  openAuthModal: (mode?: 'signin' | 'signup') => void
  closeAuthModal: () => void
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)
const STORAGE_KEY = 'deepmatch_session'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    try { return JSON.parse(stored) as AuthUser } catch { localStorage.removeItem(STORAGE_KEY); return null }
  })
  const [loading] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin')

  const openAuthModal = useCallback((mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode)
    setShowAuthModal(true)
  }, [])

  const closeAuthModal = useCallback(() => {
    setShowAuthModal(false)
  }, [])

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    if (password.length < 6) return { error: 'Password must be at least 6 characters.' }
    const newUser: AuthUser = { id: btoa(email).slice(0, 12), email, name: email.split('@')[0] }
    setUser(newUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
    return {}
  }

  const signUp = async (email: string, password: string, name: string): Promise<{ error?: string }> => {
    if (!name.trim()) return { error: 'Name is required.' }
    if (password.length < 6) return { error: 'Password must be at least 6 characters.' }
    const newUser: AuthUser = { id: btoa(email).slice(0, 12), email, name: name.trim() }
    setUser(newUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
    return {}
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, loading, showAuthModal, authModalMode, openAuthModal, closeAuthModal, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
