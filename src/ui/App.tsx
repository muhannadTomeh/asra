import React from 'react'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '../utils/auth/AuthContext'
import Layout from './components/Layout'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ChangePasswordRequestPage from './pages/auth/ChangePasswordRequestPage'
import ChangePasswordPage from './pages/auth/ChangePasswordPage'
import HomePage from './pages/HomePage'
import UsersListPage from './pages/users/UsersListPage'
import UserDetailsPage from './pages/users/UserDetailsPage'
import UserEditPage from './pages/users/UserEditPage'
import CompaniesListPage from './pages/companies/CompaniesListPage'
import CompanyDetailsPage from './pages/companies/CompanyDetailsPage'
import CompanyCreatePage from './pages/companies/CompanyCreatePage'
import CompanyEditPage from './pages/companies/CompanyEditPage'
import SeasonsListPage from './pages/seasons/SeasonsListPage'
import SeasonDetailsPage from './pages/seasons/SeasonDetailsPage'
import SeasonCreatePage from './pages/seasons/SeasonCreatePage'
import SeasonEditPage from './pages/seasons/SeasonEditPage'

const theme = createTheme({
  direction: 'rtl',
  typography: { fontFamily: 'Tajawal, "Noto Kufi Arabic", Arial' }
})

type PropsWithRole = { children: React.ReactNode; roles?: string[] }
const ProtectedRoute: React.FC<PropsWithRole> = ({ children, roles }) => {
  const { user, roles: userRoles, loading } = useAuth()
  if (loading) return <div style={{ padding: 24 }}>جارٍ التحميل...</div>
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.some(r => userRoles.includes(r))) return <Navigate to="/" replace />
  return <>{children}</>
}

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="users" element={<ProtectedRoute roles={["Admin"]}><UsersListPage /></ProtectedRoute>} />
            <Route path="users/:id" element={<ProtectedRoute><UserDetailsPage /></ProtectedRoute>} />
            <Route path="users/:id/edit" element={<ProtectedRoute><UserEditPage /></ProtectedRoute>} />

            <Route path="companies" element={<ProtectedRoute roles={["Admin"]}><CompaniesListPage /></ProtectedRoute>} />
            <Route path="companies/new" element={<ProtectedRoute><CompanyCreatePage /></ProtectedRoute>} />
            <Route path="companies/:id" element={<ProtectedRoute><CompanyDetailsPage /></ProtectedRoute>} />
            <Route path="companies/:id/edit" element={<ProtectedRoute><CompanyEditPage /></ProtectedRoute>} />

            <Route path="companies/:companyId/seasons" element={<ProtectedRoute><SeasonsListPage /></ProtectedRoute>} />
            <Route path="companies/:companyId/seasons/new" element={<ProtectedRoute><SeasonCreatePage /></ProtectedRoute>} />
            <Route path="seasons/:seasonId" element={<ProtectedRoute><SeasonDetailsPage /></ProtectedRoute>} />
            <Route path="seasons/:seasonId/edit" element={<ProtectedRoute><SeasonEditPage /></ProtectedRoute>} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/change-password-request" element={<ChangePasswordRequestPage />} />
          <Route path="/auth/change-password" element={<ChangePasswordPage />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App