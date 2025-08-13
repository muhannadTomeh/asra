import React from 'react'
import { api } from '../../../utils/api'
import { Box, CircularProgress, IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import InfoIcon from '@mui/icons-material/Info'

const UsersListPage: React.FC = () => {
  const [data, setData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/users')
        setData(res.data)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <Box textAlign="center"><CircularProgress /></Box>
  if (error) return <Typography color="error">{error}</Typography>

  return (
    <Paper>
      <Typography variant="h5" p={2}>المستخدمون</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>الاسم</TableCell>
            <TableCell>رقم الهاتف</TableCell>
            <TableCell>الحالة</TableCell>
            <TableCell>إجراءات</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(u => (
            <TableRow key={u.userId} hover>
              <TableCell>{u.userName}</TableCell>
              <TableCell>{u.phoneNumber}</TableCell>
              <TableCell>{u.isActive ? 'نشط' : 'غير نشط'}</TableCell>
              <TableCell>
                <IconButton component={RouterLink} to={`/users/${u.userId}`}><InfoIcon /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

export default UsersListPage