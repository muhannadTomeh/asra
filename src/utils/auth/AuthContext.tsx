import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'

export type AuthUser = {
  id: string
  userName: string
  phoneNumber: string
  isActive: boolean
}

type AuthContextType = {
  user: AuthUser | null
  roles: string[]
  loading: boolean
  login: (phoneNumber: string, password: string, rememberMe: boolean) => Promise<void>
  logout: () => Promise<void>
  register: (userName: string, phoneNumber: string, password: string) => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [roles, setRoles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    try {
      const { data } = await api.get('/auth/me')
      setUser(data.user)
      setRoles(data.roles || [])
    } catch {
      setUser(null)
      setRoles([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const login = async (phoneNumber: string, password: string, rememberMe: boolean) => {
    await api.post('/auth/login', { phoneNumber, password, rememberMe })
    await refresh()
  }

  const register = async (userName: string, phoneNumber: string, password: string) => {
    await api.post('/auth/register', { userName, phoneNumber, password })
    await refresh()
  }

  const logout = async () => {
    await api.post('/auth/logout')
    setUser(null)
    setRoles([])
  }

  const value = useMemo(() => ({ user, roles, loading, login, logout, register, refresh }), [user, roles, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}