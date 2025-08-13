import React from 'react'
import { AppBar, Toolbar, Typography, Container, Box, Button, IconButton, Menu, MenuItem } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { Outlet, Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../utils/auth/AuthContext'

const Layout: React.FC = () => {
  const { user, roles, logout } = useAuth()
  const isAdmin = roles.includes('Admin')
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()

  const handleMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton color="inherit" onClick={handleMenu} sx={{ display: { xs: 'inline-flex', md: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem component={RouterLink} to="/" onClick={handleClose}>الرئيسية</MenuItem>
            {isAdmin && <MenuItem component={RouterLink} to="/users" onClick={handleClose}>المستخدمون</MenuItem>}
            {isAdmin && <MenuItem component={RouterLink} to="/companies" onClick={handleClose}>الشركات</MenuItem>}
          </Menu>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>لوحة التحكم</Typography>
          {user ? (
            <>
              <Button color="inherit" onClick={() => navigate(`/users/${user.id}`)}>{user.userName}</Button>
              <Button color="inherit" onClick={() => { logout(); navigate('/login') }}>تسجيل الخروج</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">تسجيل الدخول</Button>
              <Button color="inherit" component={RouterLink} to="/register">إنشاء حساب</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container sx={{ flex: 1, py: 3 }}>
        <Outlet />
      </Container>
      <Box component="footer" sx={{ py: 3, textAlign: 'center', opacity: 0.8 }}>© {new Date().getFullYear()} جميع الحقوق محفوظة</Box>
    </Box>
  )
}

export default Layout