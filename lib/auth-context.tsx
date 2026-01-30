"use client"

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react"

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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api"

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [roles, setRoles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, { credentials: "include" })
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
        setRoles(data.roles || [])
      } else {
        setUser(null)
        setRoles([])
      }
    } catch {
      setUser(null)
      setRoles([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const login = useCallback(async (phoneNumber: string, password: string, rememberMe: boolean) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ phoneNumber, password, rememberMe }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "فشل تسجيل الدخول")
    }
    await refresh()
  }, [refresh])

  const register = useCallback(async (userName: string, phoneNumber: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userName, phoneNumber, password }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || "فشل إنشاء الحساب")
    }
    await refresh()
  }, [refresh])

  const logout = useCallback(async () => {
    await fetch(`${API_BASE}/auth/logout`, { method: "POST", credentials: "include" })
    setUser(null)
    setRoles([])
  }, [])

  const value = useMemo(
    () => ({ user, roles, loading, login, logout, register, refresh }),
    [user, roles, loading, login, logout, register, refresh]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
