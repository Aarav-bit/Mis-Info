import React, { createContext, useContext, useState, useEffect } from 'react'
import { ClerkProvider, useUser as useClerkUser, useAuth as useClerkAuth } from '@clerk/clerk-react'

// Check if Clerk publishable key is configured
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || ''
const IS_CLERK_ENABLED = PUBLISHABLE_KEY.trim().length > 0

export interface UserProfile {
  id: string
  name: string
  email: string
  imageUrl: string
  role: string
}

interface AuthContextType {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoaded: boolean
  isMock: boolean
  loginWithGoogle: () => Promise<void>
  loginWithEmail: (email: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ─── Live Auth Wrapper (Clerk) ──────────────────────────────────────────────
function LiveAuthSync({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded: clerkUserLoaded } = useClerkUser()
  const { signOut } = useClerkAuth()
  const [syncedUser, setSyncedUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    if (clerkUser) {
      setSyncedUser({
        id: clerkUser.id,
        name: clerkUser.fullName || clerkUser.username || 'Clerk User',
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        imageUrl: clerkUser.imageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
        role: 'Premium Auditor',
      })
    } else {
      setSyncedUser(null)
    }
  }, [clerkUser])

  const loginWithGoogle = async () => {
    // Clerk handles Google login via hosted pages / redirect
    console.log('Redirecting to Clerk Google Auth...')
  }

  const loginWithEmail = async (email: string) => {
    console.log('Redirecting to Clerk Email Auth for:', email)
  }

  const logout = async () => {
    await signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user: syncedUser,
        isAuthenticated: !!clerkUser,
        isLoaded: clerkUserLoaded,
        isMock: false,
        loginWithGoogle,
        loginWithEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// ─── Mock Auth Wrapper (Local Fallback) ──────────────────────────────────────
const MOCK_USER_KEY = 'misinfo_mock_user'

function MockAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(MOCK_USER_KEY)
    if (saved) {
      try {
        setUser(JSON.parse(saved))
      } catch {
        localStorage.removeItem(MOCK_USER_KEY)
      }
    }
    setIsLoaded(true)
  }, [])

  const loginWithGoogle = async () => {
    setIsLoaded(false)
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))
    const mockUser: UserProfile = {
      id: 'mock_g_' + Math.random().toString(36).substring(2, 9),
      name: 'Google Auditor',
      email: 'google.auditor@gmail.com',
      imageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      role: 'Google SSO Auditor',
    }
    setUser(mockUser)
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser))
    setIsLoaded(true)
  }

  const loginWithEmail = async (email: string) => {
    setIsLoaded(false)
    await new Promise((resolve) => setTimeout(resolve, 800))
    const username = email.split('@')[0]
    const formattedName = username.charAt(0).toUpperCase() + username.slice(1)
    const mockUser: UserProfile = {
      id: 'mock_e_' + Math.random().toString(36).substring(2, 9),
      name: formattedName + ' Account',
      email: email,
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      role: 'Standard Auditor',
    }
    setUser(mockUser)
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser))
    setIsLoaded(true)
  }

  const logout = async () => {
    setIsLoaded(false)
    await new Promise((resolve) => setTimeout(resolve, 400))
    setUser(null)
    localStorage.removeItem(MOCK_USER_KEY)
    setIsLoaded(true)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoaded,
        isMock: true,
        loginWithGoogle,
        loginWithEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// ─── Main AuthProvider Selector ──────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (IS_CLERK_ENABLED) {
    return (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <LiveAuthSync>{children}</LiveAuthSync>
      </ClerkProvider>
    )
  } else {
    return <MockAuthProvider>{children}</MockAuthProvider>
  }
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
