import React from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../../utils/auth/AuthContext'

const HomePage: React.FC = () => {
  const { user, roles } = useAuth()
  const isAdmin = roles.includes('Admin')

  return (
    <Box>
      <Typography variant="h4" gutterBottom>مرحباً {user ? user.userName : 'بالزائر'}</Typography>
      <Typography gutterBottom>استخدم الروابط التالية للتنقل:</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={2}>
        {isAdmin && <Button variant="contained" component={RouterLink} to="/users">المستخدمون</Button>}
        {isAdmin && <Button variant="contained" component={RouterLink} to="/companies">الشركات</Button>}
        {user && <Button variant="outlined" component={RouterLink} to={`/users/${user.id}`}>صفحتي</Button>}
      </Stack>
    </Box>
  )
}

export default HomePage