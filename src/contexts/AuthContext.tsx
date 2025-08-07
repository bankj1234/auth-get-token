'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Auth0Client, User } from '@auth0/auth0-spa-js'
import getAuth0 from '@/utils/auth0.utils'

interface AuthContextType {
  isLoading: boolean
  isAuthenticated: boolean
  user?: User
  loginWithRedirect: () => Promise<void>
  logout: () => void
  getAccessToken: () => Promise<string | undefined>
  refreshAuthStatus: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | undefined>()
  const [auth0Client, setAuth0Client] = useState<Auth0Client | null>(null)

  // Function สำหรับ check auth status
  const checkAuthStatus = async (auth0: Auth0Client) => {
    const isAuth = await auth0.isAuthenticated()
    setIsAuthenticated(isAuth)
    
    if (isAuth) {
      const userData = await auth0.getUser()
      setUser(userData)
    } else {
      setUser(undefined)
    }
  }

  useEffect(() => {
    const initAuth0 = async () => {
      try {
        const auth0 = await getAuth0()
        if (auth0) {
          setAuth0Client(auth0)
          
          // ตรวจสอบว่ามี flag logout หรือไม่
          const shouldLogout = localStorage.getItem('auth0_force_logout')
          if (shouldLogout) {
            localStorage.removeItem('auth0_force_logout')
            setIsAuthenticated(false)
            setUser(undefined)
            setIsLoading(false)
            return
          }
          
          await checkAuthStatus(auth0)
        }
      } catch (error) {
        console.error('Error initializing Auth0:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth0()
  }, [])

  // เพิ่ม listener สำหรับการตรวจสอบ auth status เมื่อหน้า focus
  useEffect(() => {
    const handleFocus = async () => {
      if (auth0Client && !isLoading) {
        await checkAuthStatus(auth0Client)
      }
    }

    // เพิ่ม event listener สำหรับ window focus
    window.addEventListener('focus', handleFocus)
    
    // เพิ่ม listener สำหรับ storage event (เมื่อมีการเปลี่ยนแปลง localStorage)
    const handleStorageChange = async (e: StorageEvent) => {
      if (e.key?.includes('auth0') && auth0Client) {
        await checkAuthStatus(auth0Client)
      }
    }
    
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [auth0Client, isLoading])

  // เพิ่ม method สำหรับ manual refresh auth status
  const refreshAuthStatus = async () => {
    if (auth0Client) {
      setIsLoading(true)
      await checkAuthStatus(auth0Client)
      setIsLoading(false)
    }
  }

  const loginWithRedirect = async () => {
    if (auth0Client) {
      await auth0Client.loginWithRedirect()
    }
  }

  const logout = async () => {
    try {
      // ตั้ง flag ให้ force logout เมื่อ reload
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth0_force_logout', 'true')
      }
      
      // Clear states ก่อน
      setIsAuthenticated(false)
      setUser(undefined)
      
      // Clear localStorage และ sessionStorage อย่างสมบูรณ์
      if (typeof window !== 'undefined') {
        // Clear ทุก key ที่เกี่ยวข้องกับ Auth0
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('@@auth0spajs@@') || 
              key.includes('auth0') || 
              key.includes('Auth0') ||
              key.includes('access_token') ||
              key.includes('id_token')) {
            localStorage.removeItem(key)
          }
        })
        
        Object.keys(sessionStorage).forEach(key => {
          if (key.startsWith('@@auth0spajs@@') || 
              key.includes('auth0') || 
              key.includes('Auth0') ||
              key.includes('access_token') ||
              key.includes('id_token')) {
            sessionStorage.removeItem(key)
          }
        })
        
        // Clear cookies ที่เกี่ยวข้อง (ถ้ามี)
        document.cookie.split(";").forEach(cookie => {
          const eqPos = cookie.indexOf("=")
          const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
          if (name.includes('auth0') || name.includes('Auth0')) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
          }
        })
      }
      
      // Force re-initialize Auth0 client
      if (auth0Client) {
        // สร้าง Auth0 client ใหม่เพื่อให้แน่ใจว่า cache ถูก clear
        const newAuth0 = await getAuth0()
        if (newAuth0) {
          setAuth0Client(newAuth0)
        }
      }
      
      console.log('Complete logout finished')
    } catch (error) {
      console.error('Error during logout:', error)
      // ถ้าเกิด error ให้ clear ทุกอย่างและ reload
      setIsAuthenticated(false)
      setUser(undefined)
      
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
        window.location.reload()
      }
    }
  }

  const getAccessToken = async () => {
    if (auth0Client) {
      return await auth0Client.getTokenSilently()
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        user,
        loginWithRedirect,
        logout,
        getAccessToken,
        refreshAuthStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
